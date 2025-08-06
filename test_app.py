#!/usr/bin/env python3
"""
Simple test script for MarkdownConverter
"""

import os
import sys
import tempfile
import unittest
from io import BytesIO

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, allowed_file

class TestMarkdownConverter(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_home_page(self):
        """Test that the home page loads"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'MarkdownConverter', response.data)
    
    def test_allowed_file_extensions(self):
        """Test file extension validation"""
        self.assertTrue(allowed_file('test.md'))
        self.assertTrue(allowed_file('test.markdown'))
        self.assertFalse(allowed_file('test.txt'))
        self.assertFalse(allowed_file('test.pdf'))
    
    def test_upload_without_file(self):
        """Test upload without file"""
        response = self.app.post('/upload')
        self.assertEqual(response.status_code, 302)  # Redirect
    
    def test_contact_page(self):
        """Test contact page loads"""
        response = self.app.get('/contact-advertiser')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Advertise with MarkdownConverter', response.data)

def test_markdown_conversion():
    """Test markdown to HTML conversion"""
    from markdown import markdown
    
    test_md = """
# Test Document

This is a **bold** test with *italic* text.

## Features
- Feature 1
- Feature 2

```python
print("Hello World")
```
"""
    
    html = markdown(test_md, extensions=['extra', 'tables', 'codehilite', 'toc'])
    
    # Check that HTML was generated
    assert '<h1>' in html
    assert '<h2>' in html
    assert '<strong>' in html
    assert '<em>' in html
    assert '<ul>' in html
    assert '<code>' in html
    
    print("✅ Markdown conversion test passed")

if __name__ == '__main__':
    print("🧪 Running MarkdownConverter tests...")
    
    # Test markdown conversion
    test_markdown_conversion()
    
    # Run unit tests
    unittest.main(argv=[''], exit=False, verbosity=2)
    
    print("\n✅ All tests completed!") 