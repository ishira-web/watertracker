# 💧 Water Tracker Application

## Overview
The **Water Tracker** is a full-stack web application designed to help users monitor and achieve their daily hydration goals. It features secure user authentication and a real-time dashboard for logging water intake and managing personal hydration targets.

---

## 🏛️ Architecture
The project follows a decoupled, two-part architecture:

- **Frontend (Client)**: A Next.js application responsible for the user interface, routing, and making API calls.
- **Backend (Server)**: An Express.js API responsible for user authentication, database management (MongoDB), and handling all water log data.

---

## 🔑 Core Features

- **Secure Authentication**: User registration and login protected by JWT (JSON Web Tokens).  
- **Protected Routes**: Dashboard is inaccessible to unauthorized users via a client-side AuthGuard.  
- **Daily Tracking**: Users can log water intake (in ml), updating total progress in real-time.  
- **Goal Management**: Users can view and update their personal daily hydration goal.  
- **Real-time Dashboard**: Displays total intake, daily goal, and a historical log of today's entries.  

---

## 🛠️ Local Development Setup

You must run the backend and frontend simultaneously in two separate terminal windows.

### Prerequisites
- Node.js (v18+) and npm  
- MongoDB instance (local or cloud-hosted via MongoDB Atlas)  

### Step 1: Backend Setup (water-tracker-server)
1. Navigate to the server directory:
    ```bash
    cd water-tracker-server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables:  
   Create a `.env` file in the root of the `water-tracker-server` directory:
    ```
    PORT=5000
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-name>/watertracker
    JWT_SECRET=YOUR_SECURE_RANDOM_STRING
    CLIENT_URL=http://localhost:3000
    ```
4. Start the server:
    ```bash
    npm run dev
    ```
   The server will run at [http://localhost:5000](http://localhost:5000).

### Step 2: Frontend Setup (water-tracker-client)
1. Navigate to the client directory:
    ```bash
    cd water-tracker-client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure API URL:  
   Create a `.env.local` file in the root of `water-tracker-client`:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
4. Start the frontend:
    ```bash
    npm run dev
    ```
   The client will run at [http://localhost:3000](http://localhost:3000).

---

## 💻 Technical Stack

| Category        | Technology        | Purpose                                        |
|-----------------|-----------------|-----------------------------------------------|
| **Frontend**     | Next.js (App Router) | React framework for server-side rendering and routing |
| **Styling**      | Tailwind CSS & Shadcn/ui | Utility-first CSS framework and UI components |
| **State/Data Fetching** | axios | HTTP client for interacting with the Express API |
| **Backend**      | Express.js       | Lightweight Node.js framework for API creation |
| **Database**     | MongoDB & Mongoose | NoSQL database & object modeling |
| **Security**     | JSON Web Tokens (JWT) | Stateless, secure authentication for API requests |

---

## ☁️ Deployment Guide

The application is split into two deployable services: the **Next.js frontend** and the **Express.js backend**.

### 1. Backend Deployment (Express.js on Render)
1. Update server configuration:  
   In `water-tracker-server/src/server.ts`:
   ```ts
   const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
