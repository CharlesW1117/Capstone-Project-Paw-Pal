# PawPal Frontend

PawPal is a pet sitting and dog walking marketplace that connects pet owners with local sitters.

This repository contains the React frontend only. The Express and PostgreSQL backend is maintained in a separate repository.

## Repositories

- Frontend: [Capstone-Project-Paw-Pal](https://github.com/CharlesW1117/Capstone-Project-Paw-Pal)
- Backend: [Capstone-Project-Paw-Pal-Back](https://github.com/AntoniRom17/Capstone-Project-Paw-Pal-Back)

## Features

- Owner and sitter registration
- JWT-based login and logout
- Protected application routes
- Pet profile management
- Sitter browsing and booking
- Availability calendar
- Booking management
- Owner and sitter messaging
- Completed-booking reviews
- Responsive navigation and reusable interface components
- Configurable connection to the standalone backend API

## Tech Stack

- React
- React Router
- Vite
- JavaScript
- CSS
- React Big Calendar
- date-fns
- jwt-decode
- Flaticon UI icons
- ESLint

## Requirements

Install the following before running the frontend:

- Node.js
- npm
- The PawPal backend, running locally or deployed remotely

## Installation

Clone the frontend repository:

```powershell
git clone https://github.com/CharlesW1117/Capstone-Project-Paw-Pal.git
cd Capstone-Project-Paw-Pal\pawpal-frontend
```

Install dependencies:

```powershell
npm install
```

## Environment Configuration

The frontend reads the backend API address from `VITE_API_URL`.

Create a local environment file inside the `pawpal-frontend` folder:

```powershell
New-Item -ItemType File -Path .env.local
```

Add the local backend URL:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

For a deployed frontend, replace this value with the deployed backend API URL:

```dotenv
VITE_API_URL=https://your-backend-domain.example/api
```

Do not commit `.env.local`.

If `VITE_API_URL` is not provided, the frontend defaults to:

```text
http://localhost:3000/api
```

## Running Locally

Start the standalone backend from its own repository and folder.

Then start the frontend:

```powershell
cd pawpal-frontend
npm run dev
```

Vite will display the local frontend URL in the terminal. The default is typically:

```text
http://localhost:5173
```

The backend `CLIENT_URL` environment variable must allow the frontend URL.

## Available Scripts

Run these commands from the `pawpal-frontend` folder.

Start the development server:

```powershell
npm run dev
```

Create a production build:

```powershell
npm run build
```

Check the frontend with ESLint:

```powershell
npm run lint
```

Preview the production build locally:

```powershell
npm run preview
```

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/homepage` | Public | Browse the PawPal home experience |
| `/login` | Public | Sign in to an existing account |
| `/register` | Public | Create an owner or sitter account |
| `/dashboard` | Authenticated | View account activity |
| `/pets` | Authenticated | Manage pet profiles |
| `/book` | Authenticated | Browse sitters and create bookings |
| `/calendar` | Authenticated | View booking and availability dates |
| `/messages` | Authenticated | Exchange booking-related messages |
| `/reviews` | Authenticated | View and submit reviews |

Unknown routes redirect to `/homepage`.

## Project Structure

```text
pawpal/
├── pawpal-frontend/
│   ├── src/
│   │   ├── assets/          # Static frontend assets
│   │   ├── components/      # Reusable interface components
│   │   ├── context/         # Shared React context
│   │   ├── hooks/           # Reusable React hooks
│   │   ├── layout/          # Shared page layouts
│   │   ├── pages/           # Route-level pages
│   │   ├── services/        # Backend API service modules
│   │   ├── styles/          # Shared styles
│   │   ├── utils/           # Frontend utility functions
│   │   ├── App.jsx          # Application routes
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js
├── docs/                    # Frontend API contracts and project notes
├── README.md
└── .gitignore
```

## Backend API

All HTTP requests use the shared API client located at:

```text
pawpal-frontend/src/services/api.js
```

The API client:

- Reads the base URL from `VITE_API_URL`.
- Defaults to `http://localhost:3000/api`.
- Adds the stored JWT to authenticated requests.
- Sends JSON request bodies.
- Parses JSON responses.
- Throws a shared `ApiError` for unsuccessful responses.

The expected API contract is documented in:

```text
docs/API_CONTRACT.md
```

Backend setup, database commands, migrations, API tests, and environment configuration belong in the standalone backend repository.

## Repository Separation

The frontend and backend must be cloned, configured, run, and deployed independently.

The frontend repository must not contain:

- Express server source code
- PostgreSQL schema or migration files
- Backend test files
- Backend environment secrets
- Backend `node_modules`

The frontend connects to the backend only through the configured HTTP API URL.