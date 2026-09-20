import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Connected successfully to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find(
      {},
      'title slug category difficulty visualizationType'
    );
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

app.get('/api/assignments/:slug', async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ slug: req.params.slug });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving assignment' });
  }
});

app.get('/', (req, res) => {
  res.send('NOVA.lab 2.0 API is running smoothly.');
});

app.listen(PORT, () => {
  console.log(`📡 NOVA.lab Server running on http://localhost:${PORT}`);
});