// index.js (or api/index.js)

import '../config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../config/db.js';
import * as Sentry from "@sentry/node";
import clerkWebhooks from '../controllers/webhooks.js';
import companyRoutes from '../routes/companyRouts.js';
import connectCloudinary from '../config/cloudinary.js';
import jobRoutes from '../routes/jobRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import serverless from 'serverless-http';

const app = express();

// Connect DB + Cloudinary on cold start
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Sentry error handler (after routes)
Sentry.setupExpressErrorHandler(app);

// ❌ Remove app.listen()
// ✅ Export for Vercel
export default serverless(app);
