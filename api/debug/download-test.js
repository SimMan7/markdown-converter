import fileStorage from '../storage.js';

export default function handler(req, res) {
  console.log('Debug download test called');
  
  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter required' });
  }
  
  console.log('Checking for filename:', filename);
  
  const fileExists = fileStorage.has(filename);
  const fileData = fileExists ? fileStorage.get(filename) : null;
  const storageStats = fileStorage.getStats();
  
  console.log('File exists:', fileExists);
  console.log('Storage stats:', storageStats);
  
  return res.status(200).json({
    message: 'Download debug info',
    requestedFilename: filename,
    fileExists: fileExists,
    fileData: fileData ? {
      contentLength: fileData.content.length,
      originalFilename: fileData.originalFilename,
      uploadTime: fileData.uploadTime
    } : null,
    storageStats: storageStats
  });
}
