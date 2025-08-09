import fileStorage from '../storage.js';

export default function handler(req, res) {
  console.log('Debug upload test called');
  
  if (req.method === 'POST') {
    // Simulate storing a test file
    const testFilename = 'test-file.md';
    const testContent = '# Test File\n\nThis is a test markdown file.';
    
    fileStorage.set(testFilename, {
      content: testContent,
      originalFilename: 'test-file.md',
      uploadTime: new Date().toISOString(),
    });
    
    console.log('Test file stored:', testFilename);
    
    return res.status(200).json({
      message: 'Test file stored successfully',
      filename: testFilename,
      storageStats: fileStorage.getStats()
    });
  }
  
  if (req.method === 'GET') {
    // Check if test file exists
    const testFilename = 'test-file.md';
    const fileExists = fileStorage.has(testFilename);
    const fileData = fileExists ? fileStorage.get(testFilename) : null;
    
    return res.status(200).json({
      message: 'Storage debug info',
      testFileExists: fileExists,
      testFileData: fileData,
      storageStats: fileStorage.getStats()
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
