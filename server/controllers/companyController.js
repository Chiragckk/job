import Company from "../models/company.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";

// Register a new company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.status(400).json({ success: false, message: "Missing details" });
    }

    try {
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(409).json({ success: false, message: "Company already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        });

        res.status(201).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

// Company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ email });

        if (!company || !(await bcrypt.compare(password, company.password))) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get company data
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company;
        res.json({ success: true, company });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}; 

// Post a new job
export const postJob = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        });

        await newJob.save();
        res.json({ success: true, newJob });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id;
        const applications = await JobApplication.find({ companyId })
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()
        return res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId });

        const jobsData = await Promise.all(
            jobs.map(async (job) => {
                const applicants = await JobApplication.find({ jobId: job._id });
                return { ...job.toObject(), applicants: applicants.length };
            })
        );

        res.json({ success: true, jobsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Change job application status
export const changeJobApplicationsStatus = async (req, res) => {
    
    try {
        const { id, status } = req.body

        //Find Job application and updata status
        await JobApplication.findOneAndUpdate({_id:id},{status})
        res.json({success:true,message:'Status Changed'})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
    

// Change job visibility
export const changeVisiblity = async (req, res) => {
    try {
        const { id } = req.body;
        const companyId = req.company._id;

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        if (companyId.toString() !== job.companyId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        job.visible = !job.visible;
        await job.save();

        res.json({ success: true, job });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};







