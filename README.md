# Task Management Application (Role-Based Access)

A full-stack Task Management Application built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**, featuring **JWT-based authentication** and **role-based access control** for Admin and Employee users.

---

## Features

### Authentication
- Login using email & password
- JWT-based authentication
- Protected routes

### Admin Capabilities
- Login as Admin
- Create tasks
- View all tasks
- Delete tasks
- Logout

### Employee Capabilities
- Login as Employee
- View only assigned tasks
- Update task status:
  - Pending
  - In Progress
  - Completed
- Logout

---

## Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

---

## Project Structure

```
task-management-application/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── server.js
│ ├── app.js
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── auth/
│ │ ├── pages/
│ │ ├── components/
│ │ └── App.jsx
│ └── vite.config.js
│
└── README.md

```


## Setup Instructions

### Clone the Repository
```bash
git clone <your-github-repo-link>
cd task-management-application

```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start backend server:
```
npm run dev
```
---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

```
Frontend will run on:

http://localhost:5173
---

```
## Login Credentials (Seeded Users)

### Admin

- Email: admin@example.com

- Password: Admin@123

### Employee

- Email: employee@example.com

- Password: Emp@123


## API Endpoints

## Auth

- POST /api/login

- GET /api/profile

## Tasks

- POST /api/tasks (Admin only)

- GET /api/tasks

- PUT /api/tasks/:id (Employee – status update)

- DELETE /api/tasks/:id (Admin only)

## Testing

- APIs tested using Postman

- Role-based access verified for Admin and Employee

- Status updates persist after page refresh

## Notes

- Employee users can only access tasks assigned to them

- Admin users have full control over task creation and deletion

- Unauthorized actions are blocked at the API level

### Author

Developed by Bhupendra Patil
