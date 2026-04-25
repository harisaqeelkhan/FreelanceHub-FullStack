# FreelanceHub - FullStack

Lab 10 / Quiz 3 submission — FAST NUCES Islamabad  
BCS (FinTech) — Web Technologies

---

## What is this

A full-stack freelance service platform built with Express.js (backend) and vanilla HTML/CSS/JS (frontend). Users can browse services, search/filter/sort them, save or hire services, and add new ones.

---

## Features

- Browse services fetched from backend API
- Search by title
- Filter by category and max price
- Sort by price or rating
- Save / Hire services (with confirm modal)
- Drag and drop a card to save
- User dashboard showing saved and hired services
- Add new service (bonus endpoint)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | Get all services |
| GET | /api/services/:id | Get one service |
| POST | /api/services | Add new service |
| POST | /api/save | Save a service |
| POST | /api/hire | Hire a service |
| GET | /api/saved | Get saved list |
| GET | /api/hired | Get hired list |

---

## Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/FreelanceHub-FullStack

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open browser
http://localhost:3000
```

---

## Project Structure

```
/FreelanceHub
│── /client
│     ├── index.html
│     ├── /css/style.css
│     └── /js/main.js
│── /server
│     ├── server.js
│     ├── /routes/services.js
│     ├── /controllers/servicesController.js
│     └── /data/services.json
│── package.json
└── README.md
```

---

## Notes

- Data is stored in-memory (resets on server restart)
- No database used — just JSON arrays
- Built for learning purposes, not production use
