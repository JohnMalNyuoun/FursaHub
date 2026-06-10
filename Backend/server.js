const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jwt =require('jsonwebtoken');
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5174',
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

app.get('/', (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FursaHub running on port ${PORT}`);
});