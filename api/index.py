# Vercel API entry point for Flask app
import sys
import os
import json
import markdown
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

# In-memory storage for Vercel
file_storage = {}

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'md', 'markdown'}

def handler(request):
    """Vercel serverless function handler for all routes"""
    path = request.path
    method = request.method
    
    # Handle ads.txt
    if path == '/ads.txt':
        ads_content = "google.com, ca-pub-6865885814212781, DIRECT, f08c47fec0942fa0"
        return ads_content, 200, {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600'
        }
    
    # Handle debug route
    if path == '/debug':
        debug_info = {
            'cwd': os.getcwd(),
            'files_in_cwd': os.listdir('.'),
            'python_version': sys.version,
            'request_method': method,
            'request_path': path,
            'file_storage_count': len(file_storage)
        }
        return json.dumps(debug_info, indent=2), 200, {'Content-Type': 'application/json'}
    
    # Handle upload
    if path == '/upload' and method == 'POST':
        try:
            if 'file' not in request.files:
                return json.dumps({'error': 'No file selected'}), 400, {'Content-Type': 'application/json'}
            
            file = request.files['file']
            
            if file.filename == '':
                return json.dumps({'error': 'No file selected'}), 400, {'Content-Type': 'application/json'}
            
            if not allowed_file(file.filename):
                return json.dumps({'error': 'Please upload a valid Markdown file (.md or .markdown)'}), 400, {'Content-Type': 'application/json'}
            
            # Generate unique filename
            unique_id = str(uuid.uuid4())
            filename = f"{unique_id}_{secure_filename(file.filename or 'upload')}"
            
            # Read file content
            content = file.read().decode('utf-8')
            
            # Store in memory
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
            
            return json.dumps({
                'success': True,
                'filename': filename,
                'original_filename': file.filename,
                'preview_html': html_content,
                'message': 'File uploaded successfully!'
            }), 200, {'Content-Type': 'application/json'}
            
        except Exception as e:
            return json.dumps({
                'success': False,
                'error': f'Error uploading file: {str(e)}'
            }), 500, {'Content-Type': 'application/json'}
    
    # Handle download routes
    if path.startswith('/download/'):
        try:
            parts = path.split('/')
            if len(parts) >= 4:
                format_type = parts[2]  # pdf or docx
                filename = parts[3]
                
                if filename not in file_storage:
                    return json.dumps({'error': 'File not found'}), 404, {'Content-Type': 'application/json'}
                
                file_data = file_storage[filename]
                md_content = file_data['content']
                
                # For now, return a simple response indicating the file would be processed
                # In a full implementation, you'd generate the actual PDF/DOCX
                return json.dumps({
                    'success': True,
                    'message': f'File {filename} would be converted to {format_type}',
                    'format': format_type,
                    'filename': filename
                }), 200, {'Content-Type': 'application/json'}
            else:
                return json.dumps({'error': 'Invalid download path'}), 400, {'Content-Type': 'application/json'}
        except Exception as e:
            return json.dumps({'error': f'Download error: {str(e)}'}), 500, {'Content-Type': 'application/json'}
    
    # Default response for other routes
    return json.dumps({
        'message': 'Markdown to PDF Converter API',
        'available_routes': ['/upload', '/download/{format}/{filename}', '/ads.txt', '/debug'],
        'status': 'running'
    }), 200, {'Content-Type': 'application/json'}
