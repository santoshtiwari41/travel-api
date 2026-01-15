import express from 'express';
import type { Express } from 'express';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
export const app:Express=express();

app.use(express.json());
app.get('/', (_req, res) => {
  res.send('Travel API is running ');
});

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
