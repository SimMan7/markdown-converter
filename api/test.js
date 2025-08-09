export default function handler(req, res) {
  console.log('Test function called with:', req.url);
  console.log('Request method:', req.method);
  console.log('Query params:', req.query);
  
  return res.status(200).json({ 
    message: 'Vercel API is working correctly',
    query: req.query,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
