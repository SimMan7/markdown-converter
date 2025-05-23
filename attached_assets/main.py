from flask import Flask, request, send_file, jsonify
import markdown
import os
from weasyprint import HTML
from docx import Document
import io

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'})
    if file and file.filename.endswith(('.md', '.markdown')):
        file_path = os.path.join(UPLOAD_FOLDER, 'uploaded.md')
        file.save(file_path)
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Invalid file format'})

@app.route('/download/<format>')
def download_file(format):
    file_path = os.path.join(UPLOAD_FOLDER, 'uploaded.md')
    if not os.path.exists(file_path):
        return "No file uploaded", 400

    with open(file_path, 'r') as f:
        md_content = f.read()
    
    # Convert Markdown to HTML
    html_content = markdown.markdown(md_content, extensions=['extra', 'tables'])

    if format == 'pdf':
        # Convert HTML to PDF using weasyprint
        html = HTML(string=html_content)
        pdf_io = io.BytesIO()
        html.write_pdf(pdf_io)
        pdf_io.seek(0)
        return send_file(pdf_io, download_name='converted.pdf', as_attachment=True, mimetype='application/pdf')
    
    elif format == 'docx':
        # Create Word document
        doc = Document()
        doc.add_paragraph(md_content)  # Simplified: add raw Markdown (can be enhanced)
        doc_io = io.BytesIO()
        doc.save(doc_io)
        doc_io.seek(0)
        return send_file(doc_io, download_name='converted.docx', as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    
    return "Invalid format", 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)