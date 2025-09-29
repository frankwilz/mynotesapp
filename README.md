My Notes App

A full-stack web application for creating, managing, and organizing personal notes with user authentication.




Table of Contents
• [Overview](#overview)
• [Features](#features)
• [Technologies Used](#technologies-used)
• [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
• [API Documentation](#api-documentation)
- [Authentication Endpoints](#authentication-endpoints)
- [Notes Endpoints](#notes-endpoints)
• [Frontend](#frontend)
• [Project Structure](#project-structure)
• [Security](#security)


Overview

My Notes App is a responsive web application that allows users to create an account, log in, and manage their personal notes. The application features a clean, intuitive interface with dark mode support and search functionality.


Features
• **User Authentication**: Register and login functionality with JWT-based authentication
• **CRUD Operations**: Create, read, update, and delete notes
• **Search Functionality**: Search through notes by title or content
• **Dark Mode**: Toggle between light and dark themes
• **Responsive Design**: Works on desktop and mobile devices
• **Secure**: Password hashing and JWT authentication
• **Tutorial**: First-time user tutorial video


Technologies Used

Backend
• Node.js
• Express.js
• MongoDB with Mongoose
• JWT for authentication
• bcryptjs for password hashing


Frontend
• HTML5
• CSS3
• Vanilla JavaScript
• Local Storage for client-side data persistence


Getting Started

Prerequisites
• Node.js (v14 or higher)
• MongoDB (local installation or MongoDB Atlas account)
• npm or yarn package manager


Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-notes-app.git
cd my-notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

6. Access the application at `http://localhost:4000`


Environment Variables

Create a `.env` file in the root directory with the following variables:


MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_jwt_secret_key
PORT=4000

• `MONGO_URI`: Your MongoDB connection string
• `JWT_SECRET`: Secret key for JWT token generation and verification
• `PORT`: Port number for the server (defaults to 4000 if not specified)


For production, make sure to use a strong, unique JWT secret and a secure MongoDB connection.


API Documentation

The API uses JWT for authentication. Include the token in the Authorization header as follows:

Authorization: Bearer your_jwt_token


Authentication Endpoints

Register a new user
• **URL**: `/api/auth/register`
• **Method**: `POST`
• **Auth required**: No
• **Request body**:
```json
{
  "username": "example_user",
  "password": "secure_password"
}
```
• **Success Response**: 
- **Code**: 200
- **Content**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "example_user"
    }
  }
  ```
• **Error Response**:
- **Code**: 400
- **Content**: `{ "msg": "Missing fields" }` or `{ "msg": "Username taken" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Login
• **URL**: `/api/auth/login`
• **Method**: `POST`
• **Auth required**: No
• **Request body**:
```json
{
  "username": "example_user",
  "password": "secure_password"
}
```
• **Success Response**: 
- **Code**: 200
- **Content**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "example_user"
    }
  }
  ```
• **Error Response**:
- **Code**: 400
- **Content**: `{ "msg": "Missing fields" }` or `{ "msg": "Invalid credentials" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Notes Endpoints

Get all notes for authenticated user
• **URL**: `/api/notes`
• **Method**: `GET`
• **Auth required**: Yes
• **Success Response**: 
- **Code**: 200
- **Content**:
  ```json
  [
    {
      "_id": "note_id",
      "user": "user_id",
      "title": "Note Title",
      "content": "Note content here",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```
• **Error Response**:
- **Code**: 401
- **Content**: `{ "msg": "No token provided" }` or `{ "msg": "Invalid or expired token" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Create a new note
• **URL**: `/api/notes`
• **Method**: `POST`
• **Auth required**: Yes
• **Request body**:
```json
{
  "title": "Note Title",
  "content": "Note content here"
}
```
• **Success Response**: 
- **Code**: 201
- **Content**:
  ```json
  {
    "_id": "note_id",
    "user": "user_id",
    "title": "Note Title",
    "content": "Note content here",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```
• **Error Response**:
- **Code**: 400
- **Content**: `{ "msg": "Title required" }`
- **Code**: 401
- **Content**: `{ "msg": "No token provided" }` or `{ "msg": "Invalid or expired token" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Update a note
• **URL**: `/api/notes/:id`
• **Method**: `PUT`
• **Auth required**: Yes
• **URL Parameters**: `id=[note_id]`
• **Request body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```
• **Success Response**: 
- **Code**: 200
- **Content**:
  ```json
  {
    "_id": "note_id",
    "user": "user_id",
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```
• **Error Response**:
- **Code**: 404
- **Content**: `{ "msg": "Note not found" }`
- **Code**: 401
- **Content**: `{ "msg": "No token provided" }` or `{ "msg": "Invalid or expired token" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Delete a note
• **URL**: `/api/notes/:id`
• **Method**: `DELETE`
• **Auth required**: Yes
• **URL Parameters**: `id=[note_id]`
• **Success Response**: 
- **Code**: 200
- **Content**: `{ "msg": "Deleted" }`
• **Error Response**:
- **Code**: 404
- **Content**: `{ "msg": "Note not found" }`
- **Code**: 401
- **Content**: `{ "msg": "No token provided" }` or `{ "msg": "Invalid or expired token" }`
- **Code**: 500
- **Content**: `{ "msg": "Server error" }`


Frontend

The frontend consists of three main pages:

1. **Registration Page (index.html)**: New users can create an account
2. **Login Page (login.html)**: Existing users can log in
3. **Notes Page (notes.html)**: Main application interface for managing notes


The application uses local storage for client-side data persistence and includes features like:
• Dark mode toggle
• Note search functionality
• First-time user tutorial


Project Structure

my-notes-app/
\u251c\u2500\u2500 middleware/
\u2502   \u2514\u2500\u2500 auth.js           # JWT authentication middleware
\u251c\u2500\u2500 models/
\u2502   \u251c\u2500\u2500 Note.js           # Note model schema
\u2502   \u2514\u2500\u2500 user.js           # User model schema
\u251c\u2500\u2500 public/
\u2502   \u251c\u2500\u2500 background.jpg    # Background image
\u2502   \u251c\u2500\u2500 FRF721KI.TTF      # Custom font
\u2502   \u251c\u2500\u2500 index.html        # Registration page
\u2502   \u251c\u2500\u2500 login.html        # Login page
\u2502   \u251c\u2500\u2500 notes.html        # Main notes interface
\u2502   \u251c\u2500\u2500 style.css         # Styles for all pages
\u2502   \u2514\u2500\u2500 tutorial.mp4      # Tutorial video
\u251c\u2500\u2500 routes/
\u2502   \u251c\u2500\u2500 auth.js           # Authentication routes
\u2502   \u2514\u2500\u2500 notes.js          # Notes CRUD routes
\u251c\u2500\u2500 .env                  # Environment variables
\u251c\u2500\u2500 package.json          # Project dependencies
\u251c\u2500\u2500 package-lock.json     # Dependency lock file
\u2514\u2500\u2500 server.js             # Main application entry point


Security
• Passwords are hashed using bcryptjs before storage
• JWT tokens are used for authentication with a 12-hour expiration
• MongoDB connection uses secure configuration options
• Input validation is performed on all API endpoints
• Authentication middleware protects all note operations
