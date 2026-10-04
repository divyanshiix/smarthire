# 🚀 SmartHire – Applicant Tracking System (ATS)

SmartHire is a modern, production-ready internal recruitment platform built on the **MERN (MongoDB, Express.js, React, Node.js)** stack with **TypeScript** on the frontend. It allows recruiters to publish job openings, manage candidate pipelines across hiring stages, view analytics through a glassmorphic dashboard, upload PDF resumes, and export applicant data.

---

## 🌟 Live Demo & Cloud Deployment

- **Frontend App (Vercel)**: [https://smarthire-na7s.vercel.app/](https://smarthire-na7s.vercel.app/)
- **Backend API (Render)**: `https://<your-render-app>.onrender.com/api`
- **Database**: MongoDB Atlas

---

## 🚀 Key Features

### 🔐 Auth & Security
- **JWT Authentication**: Secure token-based session management.
- **Password Hashing**: Passwords encrypted using `bcryptjs`.
- **Protected Routes**: Client-side & server-side authorization guards.
- **Input Validation**: Express-validator middleware preventing invalid payloads.

### 💼 Job Management
- Create, view, search, filter, and delete job postings.
- Categorize by Job Type (Full-time, Part-time, Contract, Remote, Internship) and Department.

### 👥 Applicant Tracking & Stage Pipeline
- Track candidates through hiring stages: `Applied` ➔ `Screening` ➔ `Interview` ➔ `Offered` ➔ `Hired` ➔ `Rejected`.
- Drag-and-drop / single-click hiring stage transitions.
- Filter candidates by job, stage, or search by name/email/skill keywords.

### 📄 File Upload & CSV Export
- **PDF Resume Upload**: Validated single-file PDF uploads with inline previewing/downloading.
- **CSV Data Export**: Export candidate applicant lists instantly to `.csv` format.
- **Email Notifications**: Nodemailer service integration for candidate updates.

### 📊 Dashboard & UI/UX
- **Analytics Overview**: Real-time metrics on total jobs, applications, hired count, and stage distribution.
- **Dark / Light Mode**: Dynamic modern theme switcher with persistent user preference.
- **Glassmorphism Design System**: Modern visual hierarchy built with Vanilla CSS variables and micro-animations.

---

## 🛠️ Architecture & Tech Stack

```
smart-hire/
├── client/          # React 18 + TypeScript + Vite (Frontend SPA)
│   ├── src/
│   │   ├── api/          # Axios HTTP client configuration
│   │   ├── components/   # Reusable UI components (Modal, Navbar, Cards)
│   │   ├── context/      # AuthContext & ThemeContext state
│   │   ├── pages/        # Dashboard, Jobs, Applicants, Login, Register
│   │   └── types/        # TypeScript interfaces & definitions
└── server/          # Node.js + Express.js (MVC Backend API)
    ├── config/       # MongoDB connection setup
    ├── controllers/  # Auth, Job, Applicant & Analytics controllers
    ├── middleware/   # Auth check, Multer PDF upload & Error handlers
    ├── models/       # Mongoose schemas (User, Job, Applicant)
    ├── routes/       # Express REST API endpoint routers
    └── seed.js       # Database seeder script
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: Local MongoDB instance or a free MongoDB Atlas connection URI

### 2. Clone Repository
```bash
git clone git@github.com:divyanshiix/smarthire.git
cd smarthire
```

### 3. Server Setup (`/server`)
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smarthire
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Seed initial sample data (optional):
```bash
npm run seed
```

Start the backend dev server:
```bash
npm run dev
```
*(Server runs at `http://localhost:5001`)*

### 4. Client Setup (`/client`)
```bash
cd ../client
npm install
```

Create a `.env` file inside `/client`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend dev server:
```bash
npm run dev
```
*(Client runs at `http://localhost:5173`)*

---

## 🧪 Testing

Run backend API automated tests:
```bash
cd server
npm test
```

---

## 📦 Production Deployment Summary

- **Frontend**: Deployed on **Vercel** with `VITE_API_URL` environment variable pointing to the Render backend endpoint.
- **Backend**: Deployed on **Render** as a Web Service configured with `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
- **Database**: Hosted on **MongoDB Atlas** with IP Access List set to allow cloud connections (`0.0.0.0/0`).

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
