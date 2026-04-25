# FreelanceHub - FullStack

Lab 10 / Quiz 3 submission — FAST NUCES Islamabad  
BCS (FinTech) — Web Technologies

---

## What is this

A full-stack freelance service platform built with Express.js (backend) and vanilla HTML/CSS/JS (frontend). Users can browse services, search/filter/sort them, save or hire services, and add new ones from a dedicated Add Service page.

---

## Features

- Browse services fetched from backend API
- Search by title
- Filter by category and max price
- Sort by price or rating
- Save / Hire services (with confirm modal)
- Drag and drop a card to save
- User dashboard showing saved and hired services
- Dedicated Add Service page (`add-service.html`) for creating new listings
- Add new service API integration (bonus endpoint)

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

### Frontend Pages

- `index.html` - Home, Services, Service Detail, and Dashboard sections
- `add-service.html` - Standalone page for adding a new service

Tip: direct links like `index.html#services` and `index.html#dashboard` open those sections immediately.

---

## Project Structure

```
/FreelanceHub
│── /client
│     ├── index.html
│     ├── add-service.html
│     ├── /css/style.css
│     └── /js
│           ├── main.js
│           └── add-service.js
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
