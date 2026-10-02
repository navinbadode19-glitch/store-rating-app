# StoreRate — Store Rating Platform

A full-stack store rating platform with role-based access control for **admins**, **normal users**, and **store owners**.

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React (Vite), Redux Toolkit, React Router, Axios |
| Backend    | Node.js, Express.js (REST API)                |
| Database   | MySQL 8 with Sequelize ORM                    |
| Auth       | JWT + bcrypt                                  |
| Validation | Joi (backend), matching rules in React forms  |

## Prerequisites

- **Node.js** v20+
- **MySQL** 8.0+
- **npm** v10+

## Quick Start

### 1. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd store-rating-app/backend

# Configure environment
cp .env.example .env
# Edit .env and set your DB_PASS and JWT_SECRET

# Install dependencies
npm install

# Seed the database (creates tables + sample data)
npm run seed

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd store-rating-app/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Default Credentials (after seeding)

| Role  | Email                      | Password    |
|-------|----------------------------|-------------|
| Admin | admin@storerating.com      | Admin@1234  |
| Owner | owner@storerating.com      | Owner@1234  |
| Owner | owner2@storerating.com     | Owner@1234  |
| Owner | owner3@storerating.com     | Owner@1234  |
| Owner | owner4@storerating.com     | Owner@1234  |
| Owner | owner5@storerating.com     | Owner@1234  |
| Owner | owner6@storerating.com     | Owner@1234  |
| User  | user1@storerating.com to user6@storerating.com | User@12345 |

## API Endpoints

| Method | Endpoint             | Role      | Description                                  |
|--------|----------------------|-----------|----------------------------------------------|
| POST   | /api/auth/register   | public    | Normal user signup                           |
| POST   | /api/auth/login      | public    | Returns JWT token and role                   |
| PUT    | /api/auth/password   | user, owner | Change password                            |
| GET    | /api/admin/dashboard | admin     | Platform statistics                          |
| POST   | /api/admin/users     | admin     | Create user/admin/owner                      |
| GET    | /api/admin/users     | admin     | List users (filter + sort)                   |
| GET    | /api/admin/users/:id | admin     | User details + store avg if owner            |
| POST   | /api/admin/stores    | admin     | Create store                                 |
| GET    | /api/admin/stores    | admin     | List stores (filter + sort + avg rating)     |
| GET    | /api/stores          | user      | Browse stores with overall + personal rating |
| POST   | /api/stores/:id/rating | user   | Submit rating (1-5)                          |
| PUT    | /api/stores/:id/rating | user   | Update own rating                            |
| GET    | /api/owner/store     | owner     | Store dashboard with raters list             |

## Validation Rules

| Field    | Rule                                                                  |
|----------|-----------------------------------------------------------------------|
| Name     | 20–60 characters (users and stores)                                  |
| Email    | Valid email format                                                    |
| Password | 8–16 chars, at least one uppercase letter and one special character   |
| Address  | Maximum 400 characters                                                |
| Rating   | Integer 1–5                                                           |

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── models/         # Sequelize models (User, Store, Rating)
│   │   ├── routes/         # Express route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # verifyToken, allowRoles, validate, errorHandler
│   │   ├── validators/    # Joi schemas
│   │   ├── utils/         # Rating rounding helper
│   │   └── app.js         # Express app setup
│   ├── seed.js            # Database seeder
│   ├── server.js          # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance with JWT interceptor
│   │   ├── store/         # Redux store + auth slice
│   │   ├── components/    # Navbar, DataTable, StarRating, ProtectedRoute
│   │   ├── pages/         # Role-based page components
│   │   ├── utils/         # Validation rules, role home routes
│   │   └── App.jsx        # Routes + Redux Provider
│   └── .env.example
└── README.md
```
