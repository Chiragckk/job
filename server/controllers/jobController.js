// controllers/jobController.js

import Job from "../models/job.js";

// GET: All visible jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: 'companyId',
      select: '-password'
    });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: 'companyId',
      select: '-password'
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
