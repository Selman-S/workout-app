import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/authRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import workoutPlanRoutes from './routes/workoutPlanRoutes';
import progressRoutes from './routes/progressRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/progress', progressRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitlife')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Workout tracking events
  socket.on('startWorkout', (data) => {
    console.log('Workout started:', data);
    // Emit workout start event to client
    socket.emit('workoutStarted', { message: 'Workout session started' });
  });

  socket.on('completeExercise', (data) => {
    console.log('Exercise completed:', data);
    // Emit exercise completion event to client
    socket.emit('exerciseCompleted', { message: 'Exercise completed', data });
  });

  socket.on('endWorkout', (data) => {
    console.log('Workout ended:', data);
    // Emit workout end event to client
    socket.emit('workoutEnded', { message: 'Workout session ended', data });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FitLife API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 