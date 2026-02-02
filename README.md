# Task Management Application (Role-Based Access)

A full-stack **Task Management Application** built using **React (Vite)**, **Node.js**, **Express**, and **MySQL (Sequelize ORM)**, featuring **JWT-based authentication** and **role-based access control** for **Admin** and **Employee** users.

---

## Features

### Authentication
- Login using email & password
- JWT-based authentication
- Protected routes
- Role-based access control (Admin / Employee)

### Admin Capabilities
- Login as Admin
- Create and assign tasks to employees
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
- Context API

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
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
│ ├── seed.js
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

**Create .env file in backend/**

```
PORT=5000
JWT_SECRET=your_jwt_secret

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=task_manager
DB_USER=root
DB_PASSWORD=your_mysql_password
```

**Create MySQL**
```
CREATE DATABASE task_manager;
```

**Seed Admin & Employee Users**
```
npm run seed
```

**Start backend server:**
```
npm run dev
```
**Backend will run on:**
```
http://localhost:5000
```
---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


**Frontend will run on:**
```
http://localhost:5173
```
---

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

- PUT /api/tasks/:id (Employee – update status only)

- DELETE /api/tasks/:id (Admin only)

## Users
- GET /api/users/employees (Admin only)

## Testing

- APIs tested using Postman

- Role-based access verified for Admin and Employee
  
- Employee can access only assigned tasks

- Unauthorized actions are blocked at API level

- Task status updates persist after refresh

## Notes

- Admin has full control over task creation, assignment, and deletion

- Employee can update only task status

- Authorization is enforced at backend middleware

- Clean separation of Admin and Employee responsibilities

### Author

**Bhupendra Patil**
