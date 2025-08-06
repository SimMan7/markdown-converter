import os
import logging
import markdown
from flask import Flask, request, render_template, send_file, flash, redirect, url_for, jsonify, Response
from werkzeug.utils import secure_filename
# from weasyprint import HTML, CSS  # Commented out for Vercel compatibility
from docx import Document
import io
import tempfile
import uuid
from datetime import datetime
from email_service import send_advertiser_contact_email, send_confirmation_email
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Database configuration for Vercel (using PostgreSQL)
database_url = os.environ.get("DATABASE_URL")
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# Fallback to SQLite if no database URL is provided
if not database_url:
    database_url = "sqlite:///app.db"

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'md', 'markdown'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# In-memory storage for Vercel (since filesystem is read-only)
file_storage = {}

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cleanup_old_files():
    """Remove files older than 1 hour from uploads directory"""
    try:
        current_time = datetime.now()
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename == '.gitkeep':
                continue
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.isfile(filepath):
                file_time = datetime.fromtimestamp(os.path.getctime(filepath))
                if (current_time - file_time).seconds > 3600:  # 1 hour
                    os.remove(filepath)
                    logging.info(f"Removed old file: {filename}")
    except Exception as e:
        logging.error(f"Error cleaning up files: {e}")

@app.route('/')
def index():
    """Main page"""
    try:
        cleanup_old_files()
        return render_template('index.html')
    except Exception as e:
        logging.error(f"Error in index route: {e}")
        return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    try:
        if 'file' not in request.files:
            flash('No file selected', 'error')
            return redirect(url_for('index'))
        
        file = request.files['file']
        
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(url_for('index'))
        
        if not allowed_file(file.filename):
            flash('Please upload a valid Markdown file (.md or .markdown)', 'error')
            return redirect(url_for('index'))
        
        # Generate unique filename to avoid conflicts
        unique_id = str(uuid.uuid4())
        filename = f"{unique_id}_{secure_filename(file.filename or 'upload')}"
        
        # Read file content
        content = file.read().decode('utf-8')
        
        # Store in memory (in production, use cloud storage)
        file_storage[filename] = {
            'content': content,
            'original_filename': file.filename,
            'upload_time': datetime.now()
        }
        
        # Convert markdown to HTML for preview
        html_content = markdown.markdown(
            content, 
            extensions=['extra', 'tables', 'codehilite', 'toc']
        )
        
        flash('File uploaded successfully!', 'success')
        return render_template('index.html', 
                             preview_content=html_content, 
                             filename=filename,
                             original_filename=file.filename)
        
    except Exception as e:
        logging.error(f"Upload error: {e}")
        flash(f'Error uploading file: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/download/<format>/<filename>')
def download_file(format, filename):
    """Download converted file"""
    try:
        if filename not in file_storage:
            flash('File not found. Please upload a file first.', 'error')
            return redirect(url_for('index'))
        
        file_data = file_storage[filename]
        md_content = file_data['content']
        
        # Convert markdown to HTML
        html_content = markdown.markdown(
            md_content, 
            extensions=['extra', 'tables', 'codehilite', 'toc']
        )
        
        # Add CSS styling for better formatting
        styled_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                h1, h2, h3, h4, h5, h6 {{
                    color: #2c3e50;
                    margin-top: 24px;
                    margin-bottom: 12px;
                }}
                code {{
                    background-color: #f8f9fa;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Monaco', 'Courier New', monospace;
                }}
                pre {{
                    background-color: #f8f9fa;
                    padding: 12px;
                    border-radius: 5px;
                    overflow-x: auto;
                }}
                blockquote {{
                    border-left: 4px solid #ddd;
                    margin: 0;
                    padding-left: 16px;
                    color: #666;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 16px 0;
                }}
                table th, table td {{
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }}
                table th {{
                    background-color: #f2f2f2;
                }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        if format == 'pdf':
            # For Vercel, we'll return HTML that can be printed to PDF
            # In production, use a cloud PDF service
            styled_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    h1, h2, h3, h4, h5, h6 {{
                        color: #2c3e50;
                        margin-top: 24px;
                        margin-bottom: 12px;
                    }}
                    code {{
                        background-color: #f8f9fa;
                        padding: 2px 4px;
                        border-radius: 3px;
                        font-family: 'Monaco', 'Courier New', monospace;
                    }}
                    pre {{
                        background-color: #f8f9fa;
                        padding: 12px;
                        border-radius: 5px;
                        overflow-x: auto;
                    }}
                    blockquote {{
                        border-left: 4px solid #ddd;
                        margin: 0;
                        padding-left: 16px;
                        color: #666;
                    }}
                    table {{
                        border-collapse: collapse;
                        width: 100%;
                        margin: 16px 0;
                    }}
                    table th, table td {{
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }}
                    table th {{
                        background-color: #f2f2f2;
                    }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
            </html>
            """
            
            # Get original filename without extension and unique ID
            original_name = filename.split('_', 1)[1] if '_' in filename else filename
            base_name = os.path.splitext(original_name)[0]
            
            from flask import Response
            return Response(
                styled_html,
                mimetype='text/html',
                headers={
                    'Content-Disposition': f'attachment; filename="{base_name}.html"',
                    'Content-Type': 'text/html'
                }
            )
            
        elif format == 'docx':
            # Convert to Word document
            doc = Document()
            
            # Add title if present
            lines = md_content.split('\n')
            for line in lines:
                line = line.strip()
                if line.startswith('# '):
                    doc.add_heading(line[2:], 0)
                elif line.startswith('## '):
                    doc.add_heading(line[3:], 1)
                elif line.startswith('### '):
                    doc.add_heading(line[4:], 2)
                elif line.startswith('#### '):
                    doc.add_heading(line[5:], 3)
                elif line and not line.startswith('#'):
                    doc.add_paragraph(line)
            
            doc_io = io.BytesIO()
            doc.save(doc_io)
            doc_io.seek(0)
            
            # Get original filename without extension and unique ID
            original_name = filename.split('_', 1)[1] if '_' in filename else filename
            base_name = os.path.splitext(original_name)[0]
            
            return send_file(
                doc_io,
                as_attachment=True,
                download_name=f'{base_name}.docx',
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
        else:
            flash('Invalid download format', 'error')
            return redirect(url_for('index'))
            
    except Exception as e:
        logging.error(f"Download error: {e}")
        flash(f'Error converting file: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.errorhandler(413)
def too_large(e):
    flash('File too large. Maximum size is 16MB.', 'error')
    return redirect(url_for('index'))

@app.errorhandler(404)
def not_found(e):
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    flash('An internal server error occurred. Please try again.', 'error')
    return redirect(url_for('index'))

# Initialize database tables with error handling
try:
    with app.app_context():
        import models
        db.create_all()
except Exception as e:
    logging.error(f"Database initialization error: {e}")
    # Continue without database if it fails

@app.route('/contact-advertiser', methods=['GET', 'POST'])
def contact_advertiser():
    """Handle advertiser contact form"""
    if request.method == 'GET':
        # Get the ad location from query parameter
        ad_location = request.args.get('location', 'General Inquiry')
        return render_template('contact_form.html', ad_location=ad_location)
    
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        company = request.form.get('company', '').strip()
        message = request.form.get('message', '').strip()
        ad_location = request.form.get('ad_location', 'General Inquiry')
        
        # Basic validation
        if not all([name, email, message]):
            flash('Please fill in all required fields.', 'error')
            return render_template('contact_form.html', 
                                 name=name, email=email, company=company, 
                                 message=message, ad_location=ad_location)
        
        # Email validation
        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address.', 'error')
            return render_template('contact_form.html',
                                 name=name, email=email, company=company,
                                 message=message, ad_location=ad_location)
        
        # Get user IP and user agent
        user_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR', ''))
        user_agent = request.headers.get('User-Agent', '')
        
        # Try to save to database, but don't fail if it doesn't work
        try:
            from models import ContactSubmission
            if not ContactSubmission.can_submit(user_ip, email):
                flash('Please wait 2 minutes before submitting another inquiry.', 'warning')
                return render_template('contact_form.html',
                                     name=name, email=email, company=company,
                                     message=message, ad_location=ad_location)
            
            # Send email
            success, error_msg = send_advertiser_contact_email(name, email, company, message, ad_location)
            
            # Save to database
            submission = ContactSubmission()
            submission.ip_address = user_ip
            submission.email = email
            submission.name = name
            submission.company = company
            submission.ad_location = ad_location
            submission.message = message
            submission.email_sent = success
            submission.user_agent = user_agent
            
            db.session.add(submission)
            db.session.commit()
            
            if success:
                # Send confirmation email to user
                send_confirmation_email(email, name)
                flash('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success')
                return redirect(url_for('index'))
            else:
                flash(f'Sorry, there was an issue sending your message: {error_msg}', 'error')
                return render_template('contact_form.html',
                                     name=name, email=email, company=company,
                                     message=message, ad_location=ad_location)
        except Exception as e:
            logging.error(f"Database/email error: {e}")
            flash('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success')
            return redirect(url_for('index'))
            
    except Exception as e:
        logging.error(f"Contact form error: {e}")
        flash('An unexpected error occurred. Please try again later.', 'error')
        return render_template('contact_form.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
