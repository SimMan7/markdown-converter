import { fileStorage } from '../upload.js';
import path from 'path';

export default async function handler(req, res) {
  console.log('Download request started:', req.url);
  console.log('Request method:', req.method);
  console.log('Query params:', req.query);
  console.log('Path params:', req.query.params);

  try {
    if (req.method !== 'GET') {
      console.error('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const params = req.query.params;
    if (!params || params.length < 2) {
      console.error('Invalid parameters:', params);
      return res.status(400).json({ 
        error: 'Invalid parameters',
        received: params 
      });
    }

    const [format, filename] = params;
    console.log('Processing download:', { format, filename });

    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      console.error('Invalid format:', format);
      return res.status(400).json({ 
        error: 'Invalid file format. Use "pdf" or "docx"',
        received: format 
      });
    }

    // Check if file exists in storage
    if (!fileStorage.has(filename)) {
      console.error('File not found in storage:', filename);
      return res.status(404).json({ 
        error: 'File not found',
        filename: filename 
      });
    }

    const fileData = fileStorage.get(filename);
    console.log('File data retrieved:', {
      originalFilename: fileData.originalFilename,
      contentLength: fileData.content.length
    });

    // Get original filename without extension and unique ID
    const originalName = filename.split('_', 1)[1] || filename;
    const baseName = path.basename(originalName, path.extname(originalName));

    if (format === 'pdf') {
      console.log('Generating PDF for:', baseName);
      
      try {
        // For now, return HTML that can be converted to PDF by the browser
        // In production, you'd use a PDF generation service or library
        const htmlContent = generateStyledHTML(fileData.content, baseName);
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename="${baseName}.html"`);
        res.setHeader('Cache-Control', 'no-cache');
        
        console.log('HTML response sent successfully');
        return res.status(200).send(htmlContent);
        
      } catch (error) {
        console.error('PDF generation error:', error);
        return res.status(500).json({
          error: 'PDF generation failed',
          message: error.message
        });
      }
      
    } else if (format === 'docx') {
      console.log('Generating DOCX for:', baseName);
      
      try {
        // For now, return a simple text file
        // In production, you'd use a DOCX generation library
        const textContent = fileData.content;
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${baseName}.txt"`);
        res.setHeader('Cache-Control', 'no-cache');
        
        console.log('Text response sent successfully');
        return res.status(200).send(textContent);
        
      } catch (error) {
        console.error('DOCX generation error:', error);
        return res.status(500).json({
          error: 'DOCX generation failed',
          message: error.message
        });
      }
    }

  } catch (error) {
    console.error('Download function error:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

function generateStyledHTML(markdownContent, title) {
  // Simple markdown to HTML conversion
  let html = markdownContent
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|li|pre|p]).*$/gim, '<p>$&</p>');

  html = html.replace(/<li>.*<\/li>/g, function(match) {
    return '<ul>' + match + '</ul>';
  });

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #1a202c;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: white;
            font-size: 16px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #2d3748;
            margin-top: 40px;
            margin-bottom: 20px;
            page-break-after: avoid;
            font-weight: 600;
            line-height: 1.3;
        }
        
        h1 {
            font-size: 2.5rem;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-top: 0;
            margin-bottom: 30px;
            color: #1a202c;
        }
        
        h2 {
            font-size: 2rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
            margin-top: 35px;
            color: #2d3748;
        }
        
        h3 {
            font-size: 1.5rem;
            color: #4a5568;
            margin-top: 30px;
        }
        
        p {
            margin-bottom: 1.5rem;
            text-align: justify;
            color: #2d3748;
        }
        
        code {
            background-color: #f7fafc;
            color: #e53e3e;
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Monaco', 'Courier New', 'Fira Code', monospace;
            font-size: 0.9em;
            border: 1px solid #e2e8f0;
        }
        
        pre {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
            margin: 25px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
            color: #2d3748;
            border: none;
            font-size: 0.95em;
            line-height: 1.6;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            margin: 25px 0;
            padding: 15px 25px;
            color: #4a5568;
            font-style: italic;
            background-color: #f7fafc;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 25px 0;
            font-size: 0.95rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        table th, table td {
            border: 1px solid #e2e8f0;
            padding: 15px;
            text-align: left;
        }
        
        table th {
            background-color: #667eea;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
        }
        
        table tr:nth-child(even) {
            background-color: #f7fafc;
        }
        
        ul, ol {
            margin-bottom: 1.5rem;
            padding-left: 2.5rem;
            color: #2d3748;
        }
        
        li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-bottom 0.2s ease;
        }
        
        a:hover {
            border-bottom: 1px solid #667eea;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 30px;
                font-size: 12pt;
                line-height: 1.6;
            }
            
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                margin-top: 20pt;
                margin-bottom: 10pt;
            }
            
            pre, blockquote, table {
                page-break-inside: avoid;
                margin: 15pt 0;
            }
            
            a {
                color: #000;
                text-decoration: underline;
            }
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}
