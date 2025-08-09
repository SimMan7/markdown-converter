import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileStorage from './storage.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Upload request started:', req.url);
  console.log('Request method:', req.method);

  try {
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse form data
    const form = formidable({
      maxFileSize: 16 * 1024 * 1024, // 16MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log('Form parsed successfully');

    if (!files.file || !files.file[0]) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file selected' });
    }

    const uploadedFile = files.file[0];
    console.log('File received:', uploadedFile.originalFilename);

    // Validate file type
    const allowedExtensions = ['.md', '.markdown'];
    const fileExtension = path.extname(uploadedFile.originalFilename).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      console.error('Invalid file type:', fileExtension);
      return res.status(400).json({ error: 'Please upload a valid Markdown file (.md or .markdown)' });
    }

    // Read file content
    const fileContent = fs.readFileSync(uploadedFile.filepath, 'utf-8');
    console.log('File content read, size:', fileContent.length);

    // Generate unique filename
    const uniqueId = uuidv4();
    const filename = `${uniqueId}_${uploadedFile.originalFilename}`;
    
    // Store in shared memory
    fileStorage.set(filename, {
      content: fileContent,
      originalFilename: uploadedFile.originalFilename,
      uploadTime: new Date().toISOString(),
    });

    console.log('File stored in memory with ID:', filename);

    // Clean up temporary file
    fs.unlinkSync(uploadedFile.filepath);

    // Return success response
    res.status(200).json({
      success: true,
      filename: filename,
      originalFilename: uploadedFile.originalFilename,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload function error:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Export for use in other functions
export { fileStorage };
