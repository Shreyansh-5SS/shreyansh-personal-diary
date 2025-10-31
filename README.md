# Personal Diary Application

A full-stack personal diary application built with React and Node.js.

## Features (Planned)

- Secure user authentication
- Create, edit, and delete diary entries
- Rich text editing
- File attachments
- Email notifications
- Data visualization
- Drag and drop organization

## Tech Stack

### Frontend
- React + Vite
- React Router v6
- React Bootstrap
- Chart.js with react-chartjs-2
- React Beautiful DnD
- Axios for API calls

### Backend
- Node.js + Express
- SQLite database with Knex
- JWT authentication
- File uploads with Multer
- Email notifications with Nodemailer
- Scheduled tasks with node-cron
- Security with Helmet

## Development Setup

### Prerequisites
- Node.js 20.x
- npm

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend API runs at http://localhost:4000

## Environment Variables
Copy `.env.example` to `.env` in the backend directory and configure as needed.