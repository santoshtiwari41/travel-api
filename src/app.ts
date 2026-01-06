import express from 'express';
import type { Express } from 'express';
export const app:Express=express();


app.get('/', (_req, res) => {
  res.send('Travel API is running ');
});