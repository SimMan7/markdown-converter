import fileStorage from '../storage.js';

export default function handler(req, res) {
  console.log('Debug storage request:', req.url);
  
  try {
    const stats = fileStorage.getStats();
    
    res.status(200).json({
      message: 'Storage debug info',
      stats: stats,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    console.error('Debug storage error:', error);
    res.status(500).json({
      error: 'Debug storage failed',
      message: error.message
    });
  }
}
