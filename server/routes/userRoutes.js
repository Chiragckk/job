import express from 'express';
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume
} from '../controllers/userController.js';
import upload from '../config/multer.js';
import { requireAuth } from '@clerk/express'; // ✅ Import Clerk protection

const router = express.Router();

// ✅ Get logged-in user profile data
router.get('/user', requireAuth(), getUserData);

// ✅ Apply for a job
router.post('/apply', requireAuth(), applyForJob);

// ✅ Get all jobs user has applied to
router.get('/applications', requireAuth(), getUserJobApplications);

// ✅ Update user's resume
router.post(
  '/update-resume',
  requireAuth(),
  upload.single('resume'),
  updateUserResume
);

export default router;
