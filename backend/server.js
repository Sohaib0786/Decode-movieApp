import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  {connectDB}  from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movie.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'CineScope API running 🎬' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎬 CineScope server running on port ${PORT}`);
});
