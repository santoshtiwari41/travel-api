import express from 'express';
import type { Express } from 'express';
import userRoutes from './routes/user.route.js';
export const app:Express=express();


app.get('/', (_req, res) => {
  res.send('Travel API is running ');
});

app.use('/api/users',userRoutes)