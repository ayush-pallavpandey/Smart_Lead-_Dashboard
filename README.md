# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| DevOps | Docker + docker-compose |

## Features

- **JWT Authentication** — register, login, protected routes
- **Leads CRUD** — create, view, edit, delete leads
- **Advanced Filtering** — filter by status + source + search (combined), sort by latest/oldest
- **Backend Pagination** — skip/limit with metadata (10 records/page)
- **Debounced Search** — 350ms debounce on search input
- **CSV Export** — export filtered leads as CSV download
- **Role-Based Access Control** — Admin (full access) vs Sales (own leads only, no delete)
- **Dark Mode** — toggle with localStorage persistence
- **Responsive Design** — mobile-friendly layout

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/         # DB connection
│       ├── controllers/    # authController, leadController
│       ├── middleware/     # auth, RBAC, errorHandler
│       ├── models/         # User, Lead (Mongoose)
│       ├── routes/         # authRoutes, leadRoutes
│       ├── types/          # TypeScript interfaces
│       └── utils/          # CSV export
├── frontend/
│   └── src/
│       ├── api/            # axios instance + typed API calls
│       ├── components/     # Badge, Button, FilterBar, LeadTable, Modal, etc.
│       ├── context/        # AuthContext (JWT + user role)
│       ├── hooks/          # useLeads, useDebounce, useDarkMode
│       ├── pages/          # LoginPage, RegisterPage, DashboardPage
│       └── types/          # shared TypeScript interfaces
└── docker-compose.yml
```

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/register` | Public | Register user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Auth | Get current user |

### Leads — `/api/leads`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/` | Auth | List leads with filters & pagination |
| POST | `/` | Auth | Create lead |
| GET | `/:id` | Auth | Get single lead |
| PUT | `/:id` | Auth | Update lead |
| DELETE | `/:id` | Admin | Delete lead |
| GET | `/export/csv` | Auth | Export leads as CSV |

### Query Parameters (GET /api/leads)
```
?page=1&limit=10&status=Qualified&source=Instagram&search=Rahul&sort=latest
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Demo Credentials

Seed the database first (`npm run seed` from the backend directory), then use:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `demo1234` |
| Sales | `sales@demo.com` | `demo1234` |

> Admin can view all leads and delete them. Sales users can only see and edit their own leads.

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker & docker-compose (optional)

### Local Development

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd smart-leads-dashboard
   ```

2. **Backend setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env — set MONGODB_URI and JWT_SECRET
   npm install
   npm run dev
   ```
   Backend runs at `http://localhost:5000`

   Optionally seed demo data (25 leads + 2 users):
   ```bash
   npm run seed
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

### Docker Setup

```bash
# From project root
cp backend/.env.example .env
# Set JWT_SECRET in .env
docker-compose up --build
```

App available at `http://localhost`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:5173` |

## RBAC

| Action | Admin | Sales User |
|--------|-------|------------|
| View leads | All leads | Own leads only |
| Create lead | Yes | Yes |
| Update lead | All leads | Own leads only |
| Delete lead | Yes | No |
| Export CSV | Yes | Yes |
