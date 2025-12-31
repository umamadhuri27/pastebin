# Pastebin Lite

Pastebin Lite is a simple Pastebin-like application that allows users to create text pastes and share a link to view them.  
Each paste can optionally expire based on time (TTL) or number of views.

This project was built as a take-home assignment with a focus on API correctness, persistence, and constraint handling.

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

**Frontend**
- React (Vite)

---

## Persistence Layer

The application uses **MongoDB Atlas (cloud-hosted MongoDB)** to persist pastes.  
This ensures data survives server restarts and works reliably in deployed environments.

---

## Running the App Locally

### Backend
```bash
cd backend
npm install
npm start

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
TEST_MODE=0


Backend runs on:

http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

Design Decisions

A paste becomes unavailable as soon as either TTL or view limit is reached

Both API and HTML page views count as views

Unavailable or expired pastes consistently return HTTP 404

Paste content is rendered safely to prevent script execution

UI is kept minimal, as design is not a grading factor


