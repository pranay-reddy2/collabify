Collabify - Real-time Collaborative Whiteboard
A modern, real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express, React, Node.js) featuring live drawing, text blocks, image uploads, and integrated chat functionality.

🌟 Features
Core Functionality

Real-time Collaboration: Multiple users can work on the same board simultaneously with live updates
Multi-Block Support:

Text blocks with auto-resizing
Image uploads with drag-and-drop
Freehand drawing with multiple pen colors


Board Management:

Create unlimited boards
Personal boards (owner-only)
Shared boards (with collaborators)
Board descriptions and metadata



Collaboration Features

Live Drawing: Real-time synchronized drawing across all connected users
Integrated Chat: Built-in chat system for each board with typing indicators
Collaborator Management:

Add collaborators by email or username
Remove collaborators (owner only)
View all active users on a board
Differentiate between owner and shared boards



User Interface

Modern Design: Dark theme with neon accents and smooth animations
Responsive Layout: Works seamlessly on desktop and mobile devices
Drag & Drop: Move text and image blocks anywhere on the canvas
Resizable Elements: Adjust text and image sizes dynamically
Drawing Tools:

Multiple pen colors (white, red, blue, green)
Eraser mode
Undo functionality



Authentication & Security

JWT-based Authentication: Secure token-based auth system
Protected Routes: Backend and frontend route protection
Session Persistence: User sessions maintained across page refreshes
Role-based Access: Owner vs. collaborator permissions

🚀 Tech Stack
Frontend

React 19 - UI framework
Redux Toolkit - State management
React Router v7 - Client-side routing
Framer Motion - Animations and transitions
Tailwind CSS 4 - Utility-first styling
Socket.io Client - Real-time WebSocket communication
React Sketch Canvas - Drawing functionality
Axios - HTTP client
Fabric.js - Canvas manipulation

Backend

Node.js - Runtime environment
Express 5 - Web framework
MongoDB - Database
Mongoose - ODM for MongoDB
Socket.io - Real-time bidirectional communication
JWT - Authentication tokens
bcrypt.js - Password hashing
Cookie Parser - Cookie handling

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v20.x or higher)
npm or yarn
MongoDB Atlas account (or local MongoDB instance)
Git

🛠️ Installation & Setup
1. Clone the Repository
bashgit clone https://github.com/yourusername/collabify.git
cd collabify
2. Backend Setup
bash# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
touch .env
Add the following environment variables to server/.env:
envDBURL="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_jwt_key"
NODE_ENV="development"
PORT=8000
FRONTEND_URL="http://localhost:5173"
3. Frontend Setup
bash# Navigate to client directory
cd ../client/collabify

# Install dependencies
npm install

# Create .env file
touch .env
Add the following environment variables to client/collabify/.env:
envVITE_API_URL="http://localhost:8000"
VITE_SOCKET_URL="http://localhost:8000"
4. Run the Application
Start Backend Server:
bashcd server
npm run dev
Server will run on http://localhost:8000
Start Frontend (in a new terminal):
bashcd client/collabify
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📦 Project Structure
```
collabify/
├── client/collabify/           # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/               # API service layer
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable React components
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── CollaboratorManager.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   └── Navbar.jsx
│   │   ├── hook/              # Custom React hooks
│   │   ├── pages/             # Page components
│   │   │   ├── BoardPage.jsx  # Main whiteboard interface
│   │   │   ├── CreateBoard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── redux/             # Redux store and slices
│   │   │   ├── boardSlice.js
│   │   │   ├── userslice.js
│   │   │   └── store.js
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Backend Node.js application
    ├── config/
    │   └── db.js              # Database connection
    ├── controllers/           # Route controllers
    │   ├── auth.controller.js
    │   ├── board.controller.js
    │   ├── message.controller.js
    │   └── user.controller.js
    ├── middlewares/
    │   └── authMiddleware.js  # JWT authentication
    ├── model/                 # Mongoose schemas
    │   ├── board.model.js
    │   ├── message.model.js
    │   └── user.model.js
    ├── routes/                # API routes
    │   ├── auth.route.js
    │   ├── board.route.js
    │   ├── message.route.js
    │   └── user.route.js
    ├── index.js               # Server entry point
    └── package.json
🎯 API Endpoints
Authentication

POST /api/auth/register - Register new user
POST /api/auth/login - Login user

User

GET /api/user/current - Get current user (protected)

Boards

POST /api/boards/ - Create new board (protected)
GET /api/boards/ - Get all user boards (protected)
GET /api/boards/load/:id - Load specific board (protected)
PUT /api/boards/save/:id - Save board changes (protected)
POST /api/boards/:id/collaborators - Add collaborator (owner only)
DELETE /api/boards/:id/collaborators/:collaboratorId - Remove collaborator (owner only)

Messages

GET /api/messages/:boardId - Get board messages (protected)
POST /api/messages/:boardId - Send message (protected)

🔌 Socket.io Events
Client → Server

join-board - Join a board room
draw - Send drawing data
block-update - Update/add/delete blocks
send-message - Send chat message
typing - User started typing
stop-typing - User stopped typing

Server → Client

user-joined - New user joined board
user-left - User left board
draw - Receive drawing updates
block-update - Receive block changes
new-message - New chat message
user-typing - User typing indicator
user-stop-typing - Stop typing indicator

🚀 Deployment
Backend Deployment (Render/Railway/Heroku)

Create a new web service
Connect your GitHub repository
Set environment variables:

DBURL
JWT_SECRET
NODE_ENV=production
FRONTEND_URL (your frontend URL)


Build command: npm install
Start command: node index.js

Frontend Deployment (Vercel)

Install Vercel CLI: npm i -g vercel
Navigate to client/collabify
Run vercel and follow prompts
Set environment variables in Vercel dashboard:

VITE_API_URL (your backend URL)
VITE_SOCKET_URL (your backend URL)



Database (MongoDB Atlas)

Create a MongoDB Atlas account
Create a new cluster
Add database user
Whitelist IP addresses (0.0.0.0/0 for all)
Get connection string and add to backend .env

🔐 Environment Variables
Backend (.env)
envDBURL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-url.vercel.app
Frontend (.env)
envVITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
📱 Features Walkthrough
1. Authentication

Register with name, email, and password
Login with credentials
JWT token stored in localStorage
Auto-redirect to dashboard on successful auth

2. Dashboard

View all boards (owned and shared)
Separate tabs for "My Boards" and "Shared with Me"
Board cards show:

Board name and description
Owner information
Number of collaborators
Number of blocks
Last updated timestamp



3. Board Creation

Set board name
Add optional description
Invite collaborators by email/username
Initialize with empty canvas

4. Board Workspace

Drawing Mode:

Toggle with pen icon
Select from 4 colors
Use eraser to remove strokes
Undo last action


Text Blocks:

Click text icon, then canvas
Type directly in the block
Drag to reposition
Resize using handle


Image Blocks:

Click image icon, then canvas
Upload image from device
Drag and resize freely


Save: Auto-saves all blocks and drawings
Chat: Real-time messaging with typing indicators
Collaborators: View online users

5. Collaboration

Real-time updates across all users
Live drawing synchronization
Block additions/deletions instantly reflected
Chat notifications
User presence indicators

🐛 Troubleshooting
Common Issues
CORS Errors:

Ensure FRONTEND_URL in backend .env matches your frontend URL
Check that credentials are set to true in CORS config

Socket.io Connection Failed:

Verify VITE_SOCKET_URL is correct
Check that WebSocket transports are enabled
Ensure JWT token is being sent in socket auth

Database Connection Issues:

Verify MongoDB Atlas IP whitelist includes your IP
Check connection string format
Ensure database user has proper permissions

JWT Token Errors:

Clear localStorage and login again
Verify JWT_SECRET matches on backend
Check token expiration (set to 30 days by default)

🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
