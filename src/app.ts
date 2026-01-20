import express from 'express';
import type { Express } from 'express';
import cors from 'cors'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import placeRoutes from './routes/place.route.js'
export const app:Express=express();
app.use(cors())
app.use(express.json());
app.get('/', (_req, res) => {
  res.send('Travel API is running ');
});

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/place',placeRoutes)
