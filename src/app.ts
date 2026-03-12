import express from 'express';
import type { Express } from 'express';
import cors from 'cors'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import placeRoutes from './routes/place.route.js'
import {TripRoutes} from './routes/trip.route.js'
import friendRoutes from './routes/friend.route.js'
import conversationRoutes from './routes/message.route.js'
import notificationRoutes from './routes/notification.route.js'
import { TripService } from './services/trip.service.js';
import { attachTripMatchNotifications } from './listeners/trip-match-notifications.js';

attachTripMatchNotifications(TripService);

export const app:Express=express();
app.use(cors())
app.use(express.json());
app.get('/', (_req, res) => {
  res.send('Travel API is running ');
});

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/place',placeRoutes)
app.use('/api/v1/trip',new TripRoutes().router)
app.use('/api/v1/friends',friendRoutes)
app.use('/api/v1/conversations',conversationRoutes)
app.use('/api/v1/notifications',notificationRoutes)
