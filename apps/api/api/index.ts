import app from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

// Connect to database once (cached between invocations)
let isConnected = false;

const handler = async (req: any, res: any) => {
  // Set CORS headers first for all requests
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://dx-ed-rqv1.vercel.app',
    'https://dx-ed.vercel.app',
  ];

  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || (origin.includes('dx-ed') && origin.includes('vercel.app')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export default handler;
