import express from 'express';
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationsStatus,
  changeVisiblity,
  postJob // You were using postJob but forgot to import it
} from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middlewares/authMiddleWare.js';

const router = express.Router();

// Register a company
router.post('/register', upload.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get company data
router.get('/company',protectCompany, getCompanyData);

// Post a job
router.post('/post-job', protectCompany, postJob);

// Get application data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get company job list
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change application status
router.post('/change-status', protectCompany, changeJobApplicationsStatus);

// Change application visibility
router.post('/change-visiblity', protectCompany, changeVisiblity);

export default router;
