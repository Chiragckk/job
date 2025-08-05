# 🚀 InsiderJobs - MERN Stack Application

A fully-featured Job Portal built using the MERN (MongoDB, Express, React, Node.js) stack. It allows companies to post job listings and candidates to search and apply for jobs. Authentication and authorization are implemented for both users and companies.

---

## 🖼️ Screenshots

> Add screenshots or demo images of your app here:


 ![Home Page]<img width="1920" height="871" alt="Screenshot (165)" src="https://github.com/user-attachments/assets/fd42acd1-067a-47fa-bffb-e47b23d07c8c" />
 ![Admin Login]<img width="1919" height="870" alt="Screenshot (166)" src="https://github.com/user-attachments/assets/f81c3487-8a68-43d7-a3a6-63885a8a09b8" />
 ![Applied Jobs]<img width="1920" height="853" alt="Screenshot (167)" src="https://github.com/user-attachments/assets/0f12939d-bb1e-4f22-b8f0-791245502ee9" />
 |
---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Axios  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Authentication:** Clerk/JWT
---

## ✨ Features

- 👨‍💼 Company & Candidate Registration/Login
- 📝 Job Posting by Companies
- 🔍 Job Search & Filter by Candidates
- 💼 Apply to Jobs with Resume Upload
- 🔒 Role-based Authentication
- 🧾 Admin Dashboard for Management
- 📄 Resume & Profile Management

---


---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or Atlas)
- Clerk/Auth0 credentials (if applicable)

### Clone the repository

```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal

Setup Backend
cd server
npm install
# Create a .env file and add your variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
npm run dev

Setup Frontend

cd client
npm install
# Create a .env file and add API base URL if needed
npm start


