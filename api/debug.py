import os
import json

def handler(request):
    """Vercel serverless function handler for debug information"""
    debug_info = {
        'cwd': os.getcwd(),
        'files_in_cwd': os.listdir('.'),
        'python_version': os.sys.version,
        'environment': dict(os.environ),
        'request_method': request.method,
        'request_url': request.url,
        'request_headers': dict(request.headers)
    }
    
    return json.dumps(debug_info, indent=2), 200, {'Content-Type': 'application/json'}
