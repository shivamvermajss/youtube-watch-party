# 🎬 YouTube Watch Party

### Real-Time Multi-User YouTube Synchronization Platform

Watch YouTube videos together with friends in real-time using synchronized playback, role-based permissions, and WebSocket communication.

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</p>

---

## 🌐 Live Demo

### 🚀 Frontend

https://youtube-watch-party-omega.vercel.app

### ⚙️ Backend

https://youtube-watch-party-rf6i.onrender.com

---

## 📖 Project Overview

YouTube Watch Party is a full-stack real-time web application that allows multiple users to watch YouTube videos together in perfect synchronization.

Users can create private rooms, invite participants using a unique room code, synchronize video playback in real-time, assign moderator roles, transfer host permissions, remove participants, and interact using emoji reactions.

The application is built using **React**, **Node.js**, **Express**, **Socket.IO**, and **MongoDB Atlas**, with the frontend deployed on **Vercel** and the backend deployed on **Render**.

---

## ✨ Features

### 🎥 Real-Time Synchronization

- 🔄 Real-time YouTube video synchronization using **Socket.IO**
- ▶️ Synchronized Play, Pause, and Seek controls
- ⏱️ Late joiners automatically sync to the current playback state
- 📺 Supports standard YouTube URLs, short URLs, and video IDs

---

### 👥 Room Management

- 🏠 Create private watch rooms with a unique room code
- 🚪 Join rooms instantly using the room code
- 📋 One-click room code copy
- 👥 Live participant list with real-time updates
- 🟢 Connection status indicator

---

### 👑 Role-Based Permissions

- 👑 Host controls video playback
- 🛡️ Assign and remove Moderator role
- 🔄 Transfer Host privileges to another participant
- ❌ Remove participants from the room
- 🔒 Role-based access control for room management

---

### 😊 Interactive Experience

- ❤️ Emoji reactions during playback
- 🔔 Beautiful toast notifications for important actions
- 📱 Fully responsive design for Desktop, Tablet, and Mobile
- 🎨 Modern dark-themed user interface
- ✨ Smooth animations and hover effects

---

### ⚡ Backend & Infrastructure

- 🌐 RESTful API built with Express.js
- ⚡ Real-time communication using Socket.IO
- 🍃 MongoDB Atlas for database management
- ☁️ Frontend deployed on Vercel
- 🚀 Backend deployed on Render
- 🔐 Environment variable configuration
- 📂 Clean and scalable project architecture

---

# 📸 Application Screenshots

## 🏠 Home Page

<p align="center">
  <img src="./screenshots/home.png" width="100%" alt="Home Page"/>
</p>

The landing page allows users to create a new watch room or join an existing room using a unique room code.

---

## ➕ Create Room

<p align="center">
  <img src="./screenshots/create-room.png" width="100%" alt="Create Room"/>
</p>

Hosts can instantly create a private watch party room and invite others using the generated room code.

---

## 🎬 Watch Room

<p align="center">
  <img src="./screenshots/watch-room.png" width="100%" alt="Watch Room"/>
</p>

The synchronized watch room includes the YouTube player, participant management, reactions, room controls, and real-time synchronization powered by Socket.IO.

---

## 👥 Participants Panel

<p align="center">
  <img src="./screenshots/participants.png" width="100%" alt="Participants"/>
</p>

Participants are updated in real time. Hosts can assign moderators, transfer host privileges, or remove users directly from the participant panel.

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, Vite, React Router DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Real-Time Communication** | Socket.IO |
| **Database** | MongoDB Atlas, Mongoose |
| **UI & Styling** | Tailwind CSS, Lucide React, React Hot Toast, Sonner |
| **YouTube Integration** | React YouTube, YouTube IFrame API |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Version Control** | Git, GitHub |
| **Development Tools** | VS Code, Postman, MongoDB Compass |

---

## 📦 Project Dependencies

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Socket.IO Client
- React YouTube
- Lucide React
- React Hot Toast
- Sonner

### Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB Atlas
- Mongoose
- CORS
- dotenv

---

# 📂 Project Structure

```text
youtube-watch-party
│
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── socket
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   ├── utils
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── screenshots
│
├── README.md
│
└── LICENSE
```

---

## 📁 Folder Description

| Folder | Description |
|---------|-------------|
| **client/** | React frontend built with Vite |
| **server/** | Express backend with Socket.IO |
| **controllers/** | Business logic for room operations |
| **routes/** | REST API endpoints |
| **models/** | MongoDB database models |
| **socket/** | WebSocket event handlers and synchronization logic |
| **middleware/** | Logger, error handling, request validation |
| **config/** | Database connection and CORS configuration |
| **screenshots/** | Project screenshots and demo GIF used in README |

---

# 🏗️ System Architecture

```text
                    +------------------------+
                    |       Browser          |
                    |     React + Vite       |
                    +-----------+------------+
                                |
                                |
               REST API          |      Socket.IO
                                |
                                ▼
                    +------------------------+
                    |   Express.js Server    |
                    |  Room Controller/API   |
                    +-----------+------------+
                                |
              +-----------------+-----------------+
              |                                   |
              ▼                                   ▼
     Socket.IO Server                    MongoDB Atlas
(Room Management & Sync)             Room Metadata & Users
```

The application follows a client-server architecture where the React frontend communicates with the Express backend using REST APIs for room management and Socket.IO for real-time synchronization. MongoDB Atlas stores room metadata and participant information.

# 🔄 Application Flow

```text
User Opens Website
        │
        ▼
Create / Join Room
        │
        ▼
Backend Creates / Finds Room
        │
        ▼
Socket.IO Connection Established
        │
        ▼
User Joins Room
        │
        ▼
Participants Receive Update
        │
        ▼
Host Loads YouTube Video
        │
        ▼
Video Broadcast to Everyone
        │
        ▼
Play / Pause / Seek Events
        │
        ▼
Real-Time Synchronization
```

# ⚡ Socket.IO Event Flow

```text
Host
 │
 │ change_video
 ▼
Socket.IO Server
 │
 ├────────────► Participant 1
 │
 ├────────────► Participant 2
 │
 ├────────────► Participant 3
 │
 └────────────► Moderator
```

All playback actions are first validated on the backend before being broadcast to every connected participant in the room.

# 👥 Role-Based Permission Flow

```text
                 HOST
      ┌──────────┼──────────┐
      │          │          │
      ▼          ▼          ▼

 Load Video   Assign Role  Remove User
 Play/Pause   Transfer Host Change Video
 Seek

                │
                ▼

            MODERATOR
      ┌──────────┼─────────┐
      ▼          ▼         ▼

 Play/Pause     Seek     Change Video

                │
                ▼

           PARTICIPANT

        Watch Only
        Emoji Reactions
```

# 🗄️ Database Schema

```text
Room
│
├── roomId
├── hostId
├── videoId
├── currentTime
├── isPlaying
├── participants[]
└── createdAt


Participant

├── socketId
├── username
├── role
└── joinedAt
```
# 🎯 Design Decisions

### Why Socket.IO?

Socket.IO was selected to provide low-latency, bidirectional communication between the client and server, enabling real-time synchronization of video playback across all connected participants.

### Why MongoDB?

MongoDB Atlas stores room information, participant metadata, playback state, and room configuration. Its flexible document model makes it suitable for rapidly evolving real-time applications.

### Why React?

React provides a component-based architecture, making the UI modular, reusable, and easy to maintain.

### Why Express?

Express provides a lightweight backend for REST APIs, room management, and seamless integration with Socket.IO.

# 🚧 Challenges Solved

During development, several real-world challenges were encountered and resolved:

- Fixed synchronization issues caused by delayed YouTube player initialization.
- Implemented state recovery for users refreshing the page without breaking the room.
- Prevented unauthorized playback by enforcing backend role validation.
- Resolved Socket.IO reconnection issues after browser refresh.
- Fixed deployment issues on Render related to MongoDB Atlas DNS resolution.
- Configured Vercel routing to support React Router deep links.
- Ensured newly joined participants automatically synchronize with the current playback state.

# 🏗️ System Architecture

The YouTube Watch Party application follows a real-time client-server architecture. The React frontend communicates with the Express backend using REST APIs for room management and Socket.IO for instant synchronization of video playback, reactions, and participant updates. MongoDB Atlas stores room metadata and playback state, while the application is deployed using Vercel and Render.

<p align="center">
  <img src="./screenshots/architecture-overview.png" alt="YouTube Watch Party Architecture" width="100%">
</p>

### Architecture Highlights

- ⚛️ React + Vite frontend hosted on **Vercel**
- 🟢 Express.js backend hosted on **Render**
- ⚡ Socket.IO for real-time synchronization
- 🍃 MongoDB Atlas for persistent room data
- 🎥 YouTube IFrame API for synchronized playback
- 🔄 REST APIs for room creation and management

# 📡 REST API Documentation

The backend exposes RESTful APIs for room creation, participant management, and video synchronization.

## Base URL

### Local

```text
http://localhost:5000/api
```

### Production

```text
https://youtube-watch-party-rf6i.onrender.com/api
```

---

# 📡 REST API Documentation

The backend exposes RESTful APIs for room creation, participant management, and video synchronization.

## 🌐 Base URL

### Local Development

```text
http://localhost:5000/api
```

### Production

```text
https://youtube-watch-party-rf6i.onrender.com/api
```

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| **POST** | `/rooms/create` | Create a new watch party room |
| **POST** | `/rooms/join` | Join an existing room |
| **GET** | `/rooms/:roomId` | Retrieve room information |
| **GET** | `/rooms/:roomId/participants` | Get all participants in a room |
| **PATCH** | `/rooms/:roomId/video` | Update the current YouTube video |

---

# 🎬 Create Room

### Endpoint

```http
POST /api/rooms/create
```

### Request Body

```json
{
  "username": "shivam"
}
```

### Success Response

```json
{
  "success": true,
  "roomId": "ABC123",
  "role": "host"
}
```

---

# 👥 Join Room

### Endpoint

```http
POST /api/rooms/join
```

### Request Body

```json
{
  "roomId": "ABC123",
  "username": "rahul"
}
```

### Success Response

```json
{
  "success": true,
  "role": "participant"
}
```

---

# 📺 Get Room Details

### Endpoint

```http
GET /api/rooms/:roomId
```

### Success Response

```json
{
  "success": true,
  "room": {
    "roomId": "ABC123",
    "videoId": "dQw4w9WgXcQ",
    "isPlaying": true,
    "currentTime": 132
  }
}
```

---

# 👤 Get Participants

### Endpoint

```http
GET /api/rooms/:roomId/participants
```

### Success Response

```json
{
  "success": true,
  "participants": [
    {
      "username": "shivam",
      "role": "host"
    },
    {
      "username": "rahul",
      "role": "participant"
    }
  ]
}
```

---

# 🎥 Update Current Video

### Endpoint

```http
PATCH /api/rooms/:roomId/video
```

### Request Body

```json
{
  "videoId": "dQw4w9WgXcQ"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Video updated successfully"
}
```

---

# ❌ Error Response

```json
{
  "success": false,
  "message": "Room not found"
}
```

---

# ✨ API Features

- RESTful API architecture
- JSON-based request and response format
- Express.js routing and middleware
- Centralized error handling
- MongoDB Atlas integration
- Mongoose ODM for database operations
- Socket.IO integration for real-time synchronization
- Modular controller-based architecture
- Scalable endpoint design
- Production-ready deployment on Render

---

## 🧪 Test the APIs

You can test all REST APIs using:

- **Postman**
- **Thunder Client (VS Code)**
- **Insomnia**
- **cURL**

Example:

```bash
curl -X POST https://youtube-watch-party-rf6i.onrender.com/api/rooms/create \
-H "Content-Type: application/json" \
-d "{\"username\":\"shivam\"}"
```

---

## 📌 HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| **200 OK** | Request completed successfully |
| **201 Created** | Resource created successfully |
| **400 Bad Request** | Invalid request data |
| **404 Not Found** | Room or resource not found |
| **500 Internal Server Error** | Unexpected server error |

---

The REST API is responsible for room management, participant management, and persistence, while real-time events such as video playback synchronization, reactions, and role updates are handled through **Socket.IO**.

# ⚡ Socket.IO Events Documentation

Real-time communication is powered by **Socket.IO**, enabling instant synchronization between all participants in a watch party. Every playback action, participant update, and role change is broadcast to connected users with minimal latency.

---

## 🔄 Event Flow Overview

```text
Host / Moderator
        │
        ▼
 Socket.IO Client
        │
        ▼
 Express + Socket.IO Server
        │
 Permission Validation
        │
        ▼
 Broadcast to Room
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Host  Moderator   Participants
```

---

## 📡 Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_room` | `{ roomId, username }` | Join an existing watch room |
| `leave_room` | `{ roomId }` | Leave the current room |
| `play` | `{}` | Play the current video |
| `pause` | `{}` | Pause the current video |
| `seek` | `{ currentTime }` | Synchronize video timestamp |
| `change_video` | `{ videoId }` | Load a new YouTube video |
| `assign_role` | `{ userId, role }` | Promote participant to Moderator |
| `remove_participant` | `{ userId }` | Remove participant from room |
| `transfer_host` | `{ userId }` | Transfer Host privileges |
| `emoji_reaction` | `{ emoji }` | Broadcast emoji reaction |

---

## 📡 Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `room_joined` | Room Information | User successfully joined room |
| `sync_state` | Playback State | Synchronize current playback state |
| `video_changed` | Video Information | Broadcast new YouTube video |
| `playback_updated` | Current Time | Synchronize play/pause/seek |
| `participant_joined` | Participant Data | Notify room of new participant |
| `participant_left` | Participant Data | Notify room when someone leaves |
| `role_updated` | Updated Role | Broadcast role changes |
| `participant_removed` | User ID | Remove participant from room |
| `host_transferred` | Host Information | Notify all users of new Host |
| `reaction_received` | Emoji | Display emoji reaction |

---

# 🔐 Permission Validation

Every incoming Socket.IO event is validated on the backend before it is processed.

| Action | Host | Moderator | Participant |
|--------|:----:|:----------:|:-----------:|
| Join Room | ✅ | ✅ | ✅ |
| Leave Room | ✅ | ✅ | ✅ |
| Play Video | ✅ | ✅ | ❌ |
| Pause Video | ✅ | ✅ | ❌ |
| Seek Video | ✅ | ✅ | ❌ |
| Change Video | ✅ | ✅ | ❌ |
| Assign Moderator | ✅ | ❌ | ❌ |
| Remove Participant | ✅ | ❌ | ❌ |
| Transfer Host | ✅ | ❌ | ❌ |
| Send Emoji Reaction | ✅ | ✅ | ✅ |

---

# 🎥 Video Synchronization Workflow

```text
Host loads YouTube Video
            │
            ▼
Socket.IO Event (change_video)
            │
            ▼
Backend Permission Validation
            │
            ▼
Update Room State
            │
            ▼
Broadcast to All Connected Clients
            │
     ┌──────┼────────┐
     ▼      ▼        ▼
 Host  Moderator  Participant
            │
            ▼
 YouTube Player Updates Instantly
```

---

# 👥 Participant Synchronization Workflow

```text
User Joins Room
        │
        ▼
Socket.IO Connection Established
        │
        ▼
Room Lookup
        │
        ▼
Participant Added
        │
        ▼
Current Playback State Retrieved
        │
        ▼
Broadcast Updated Participant List
        │
        ▼
Late Joiner Automatically Receives

• Current Video
• Current Playback Time
• Play / Pause State
• Participant List
• User Roles
```

---

# ⚡ Real-Time Features Powered by Socket.IO

- 🎬 Instant YouTube video synchronization
- ▶️ Real-time Play/Pause synchronization
- ⏩ Live Seek synchronization
- 🔄 Automatic synchronization for late joiners
- 👥 Live participant updates
- 👑 Host transfer without page refresh
- 🛡️ Real-time Moderator assignment
- ❌ Instant participant removal
- 😊 Emoji reaction broadcasting
- 🔐 Backend role validation for every privileged action

---

## 📈 Why Socket.IO?

Socket.IO was chosen because it provides reliable, low-latency, bidirectional communication between clients and the server. It enables seamless real-time synchronization of playback events, participant management, and role updates while automatically handling reconnection and event delivery across connected users.

# 🚀 Local Setup & Installation

Follow the steps below to run the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/shivamvermajss/youtube-watch-party.git
```

```bash
cd youtube-watch-party
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 4️⃣ Configure Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
NODE_ENV=development

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

CLIENT_URL=http://localhost:5173
```

---

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

---

## 5️⃣ Start Backend

```bash
cd server
npm run dev
```

---

## 6️⃣ Start Frontend

```bash
cd client
npm run dev
```

---

## 7️⃣ Open Application

```
http://localhost:5173
```

---

## Development Workflow

```
React (5173)

↓

REST API

↓

Express (5000)

↓

Socket.IO

↓

MongoDB Atlas
```

# 🔐 Environment Variables

## Backend

| Variable | Description |
|----------|-------------|
| PORT | Express server port |
| NODE_ENV | Application environment |
| MONGO_URI | MongoDB Atlas connection string |
| CLIENT_URL | Frontend URL |

---

## Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend REST API URL |
| VITE_SOCKET_URL | Backend Socket.IO URL |

# 🚀 Future Improvements

The current implementation focuses on a production-ready MVP. Future enhancements include:

- 🔐 User Authentication
- 💾 Persistent Room Recovery
- 💬 Real-Time Text Chat
- 📃 Playlist Support
- 🎵 Shared Queue Management
- 📺 Video History
- 🎙️ Voice Chat
- 📹 WebRTC Video Calling
- 📺 Screen Sharing
- 📊 Analytics Dashboard
- 📱 Progressive Web App (PWA)
- 🔔 Push Notifications
- 🌍 Internationalization (i18n)
- ⚡ Redis Adapter for Horizontal Scaling
- ☁️ Kubernetes-based Deployment

# 👨‍💻 Author

**Shivam Verma**

Final Year B.Tech Computer Science Student

Full Stack MERN Developer

### GitHub

https://github.com/shivamvermajss

### LinkedIn

https://www.linkedin.com/in/shivam-verma-227b37384/

---

# 📄 License

This project is licensed under the MIT License.

See the LICENSE file for more details.