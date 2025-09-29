import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://mappm.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    message: 'MapPM API is running on AWS Lambda!',
    timestamp: new Date().toISOString(),
    stage: process.env.NODE_ENV
  });
});

app.use('/api/users', userRoutes);

// Lambda handler
export const handler = serverless(app, {
  request: async (request, event, context) => {
    await connectDB();
  }
});