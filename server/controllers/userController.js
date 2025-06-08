// controllers/userController.js

import JobApplication from "../models/jobApplication.js";
import User from "../models/User.js";
import Job from "../models/job.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Get user profile data
export const getUserData = async (req, res) => {
  const { userId } = req.auth();


  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
const { userId } = req.auth();


  try {
    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (isAlreadyApplied) {
      return res.status(400).json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }

    const application = await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      status: "Pending",
      date: Date.now(),
    });

    res.status(201).json({ success: true, message: "Applied Successfully", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all job applications by the logged-in user
export const getUserJobApplications = async (req, res) => {
  try {
   const { userId } = req.auth();


    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary");

    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: "No job applications found" });
    }

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update user's resume via file upload
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth();

    const resumeFile = req.file; // Ensure multer is configured for 'resume'

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (resumeFile && resumeFile.path) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
        resource_type: "auto",
      });
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    res.status(200).json({ success: true, message: "Resume Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
