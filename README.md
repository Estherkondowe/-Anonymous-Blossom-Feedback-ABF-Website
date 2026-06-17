# 🌸 Anonymous Blossom Feedback (ABF)

A safe, anonymous feedback platform built for Code Blossom participants. Inspired by Marion's call for honest feedback at every All Hands Call.

---

## 🌸 Live Demo

- **Frontend:**https://blossom-feedback.vercel.app
- **Backend:** https://anonymous-blossom-feedback-abf-website-1.onrender.com

---

## 💡 About The Project

Anonymous Blossom Feedback (ABF) is a full-stack web application that allows Code Blossom participants to share honest feedback anonymously  no account needed, no judgment, just honest voices.

Admins can securely login to view, manage and delete feedback through a protected dashboard.

---

## ✨ Features

-  **100% Anonymous** — participants submit feedback without creating an account
-  **Feedback Form** — session, mentor, message and rating fields
-  **Admin Dashboard** — secure login to view and manage all feedback
-  **Delete Feedback** — admins can remove feedback from the dashboard
-  **Responsive Design** — works on mobile, tablet and desktop
- 🌸 **Clean UI** — pink and white Blossom theme

---

## 🛠️ Tech Stack

| Area | Technology |
|------|-----------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### Clone the Repository
```bash
git clone https://github.com/Estherkondowe/-Anonymous-Blossom-Feedback-ABF-Website.git
cd -Anonymous-Blossom-Feedback-ABF-Website
```

### Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Start the backend:
```bash
node index.js
```

### Setup Frontend
```bash
cd Frontend/blossom-feedback
npm install
npm start
```

---




## 👩‍💻 Author

**Esther Kondowe**
Built as a final project for Code Blossom 🌸

---

## 🌸 Acknowledgements

- Inspired by **Marion**, founder of Code Blossom, who always says *"We need your feedback"* at every All Hands Call
- Built with love for the Code Blossom community
