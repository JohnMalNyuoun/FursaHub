const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const jwt =require('jsonwebtoken');
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:5172', 'http://localhost:5171'],
  credentials: true
}));
app.use(express.json());

// Auth routes
app.use('/api/auth/youth', require('./routes/auth/youthAuth'));
app.use('/api/auth/org', require('./routes/auth/orgAuth'));

// Youth routes
app.use('/api/youth/profile', require('./routes/youth/profile'));
app.use('/api/youth/courses', require('./routes/youth/courses'));
app.use('/api/youth/applications', require('./routes/youth/applications'));

// Organisation routes
app.use('/api/org/profile', require('./routes/organisation/profile'));
app.use('/api/org/courses', require('./routes/organisation/courses'));
app.use('/api/org/applications', require('./routes/organisation/applications'));

app.use('/api/youth/notifications', require('./routes/youth/notifications'));
app.use('/api/org/notifications', require('./routes/organisation/notifications'));

// Admin routes
app.use('/api/admin/organisations', require('./routes/admin/organisations'));
app.use('/api/admin/courses', require('./routes/admin/courses'));
app.use('/api/admin/users', require('./routes/admin/users'));
app.use('/api/org/impact', require('./routes/organisation/impact'));
app.use('/api/youth/outcomes', require('./routes/youth/outcomes'));
app.get('/api', (req, res) => {
  res.json({ message: 'FursaHub API Running' });
});
app.get('/api/debug/token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.json({error: 'No token provided'});
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ decoded });
  } catch (err) { 
    res.json({ error: err.message });
  }
});

// Serve built frontend on the same port (single-port deployment)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback: any non-API GET returns index.html so React Router handles it.
  // Express 5 dropped wildcard path strings, so we use middleware.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'FursaHub API Running',
      hint: 'Run `npm run build:client` (or `npm run serve`) inside /Backend to build the frontend first.'
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FursaHub running on port ${PORT}`);
});