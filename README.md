# PawPal

PawPal is a full-stack pet sitting and dog walking marketplace built for our capstone project. The application connects pet owners with local sitters and dog walkers, allowing owners to search for care, view sitter profiles, manage pet information, request bookings, and leave reviews after completed services.

The project is built with a React frontend, an Express backend, and a PostgreSQL database.

## Project Overview

PawPal is designed as a two-sided marketplace:

- Pet owners can create accounts, add pet profiles, search for sitters, request bookings, and review completed services.
- Sitters can create accounts, list services, set pricing, publish availability, manage booking requests, and build reputation through reviews and trust-based profile metrics.

The core goal is to create a clean, practical MVP that demonstrates authentication, role-based user flows, CRUD functionality, database relationships, search/filtering, booking logic, and review-based reputation tracking.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- PostgreSQL
- JWT authentication
- bcrypt password hashing

### Project Management

- GitHub
- GitHub Projects Kanban board
- Feature branches
- Pull requests

## Project Structure

```text
pawpal/
├── client/                 # React frontend
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/          # Backend route files
│   │   ├── middleware/      # Auth and error middleware
│   │   └── index.js         # Express server entry point
│   ├── .env.example         # Example environment variables
│   ├── package.json
│   └── package-lock.json
├── docs/                   # API contracts, schema notes, planning docs
├── README.md
└── .gitignore