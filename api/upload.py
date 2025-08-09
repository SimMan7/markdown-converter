from flask import Flask, request, jsonify
import markdown
import uuid
import os
import tempfile
from datetime import datetime
from werkzeug.utils import secure_filename

# In-memory storage for Vercel
file_storage = {}

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'md', 'markdown'}

def handler(request):
    """Vercel serverless function handler for file upload"""
    if request.method != 'POST':
        return jsonify({'error': 'Method not allowed'}), 405
    
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file selected'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Please upload a valid Markdown file (.md or .markdown)'}), 400
        
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
        
        return jsonify({
            'success': True,
            'filename': filename,
            'original_filename': file.filename,
            'preview_html': html_content,
            'message': 'File uploaded successfully!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error uploading file: {str(e)}'
        }), 500
