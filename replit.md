# MarkdownConverter

## Overview

MarkdownConverter is a Flask-based web application that converts Markdown files to PDF and Word (DOCX) formats. The application provides a simple web interface for users to upload Markdown files and download converted documents. It includes file upload tracking, email notification system for advertising inquiries, and a responsive web interface with advertisement spaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM for database operations
- **File Processing**: Markdown conversion using the `markdown` library with support for extensions like tables and extra features
- **PDF Generation**: WeasyPrint for HTML-to-PDF conversion with CSS styling support
- **DOCX Generation**: python-docx library for Word document creation
- **Database**: SQLAlchemy with configurable database backend (DATABASE_URL environment variable)
- **Session Management**: Flask sessions with configurable secret key

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap dark theme for responsive UI
- **Styling**: Custom CSS with Bootstrap integration and Font Awesome icons
- **JavaScript**: Vanilla JavaScript for file upload validation, form handling, and UI interactions
- **Preview System**: Client-side Markdown preview with syntax highlighting using Prism.js

### File Management
- **Upload Handling**: Secure file upload with validation for Markdown file types (.md, .markdown)
- **Storage**: Local file system storage in 'uploads' directory
- **Size Limits**: 16MB maximum file size limit
- **Security**: Werkzeug secure filename handling to prevent path traversal attacks

### Data Models
- **FileUpload Model**: Tracks file uploads with metadata including filename, size, timestamps, IP address, and download statistics
- **Analytics**: Built-in tracking for PDF and DOCX download events with timestamp recording

### Email System
- **Service Provider**: SendGrid integration for transactional emails
- **Use Cases**: Advertiser contact form notifications and confirmation emails
- **Configuration**: Environment variable-based API key management

## External Dependencies

### Core Libraries
- **Flask**: Web framework and application server
- **SQLAlchemy**: Database ORM and connection management
- **WeasyPrint**: PDF generation from HTML content
- **python-docx**: Microsoft Word document creation
- **markdown**: Markdown parsing and HTML conversion

### Email Service
- **SendGrid**: Third-party email delivery service with API integration
- **Configuration**: Requires SENDGRID_API_KEY environment variable

### Frontend Assets
- **Bootstrap**: UI framework with dark theme variant
- **Font Awesome**: Icon library for enhanced UI elements
- **Prism.js**: Syntax highlighting for code blocks in Markdown preview

### Database
- **SQLAlchemy Compatible**: Supports PostgreSQL, MySQL, SQLite through DATABASE_URL configuration
- **Connection Pooling**: Configured with pool recycling and pre-ping for reliability

### Development Dependencies
- **Werkzeug**: WSGI utilities and development server
- **Jinja2**: Template engine for HTML rendering
- **Python Standard Library**: tempfile, uuid, datetime, logging, and os modules for core functionality