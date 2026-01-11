# AeroCatalog Architecture Documentation

## Project Overview

AeroCatalog adalah platform **API-as-a-Service** yang menyediakan database pesawat komersial untuk developer. Platform ini didesain dengan pemisahan antara Admin (pengelola platform) dan End Users (developer yang menggunakan API).

**Visi:** Menjadi penyedia API database pesawat terlengkap dengan developer experience yang excellence.

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API)
- **Database:** MySQL (port 3309)
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs (password hashing)

### Frontend
- **Framework:** React 18.2
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** react-icons

### Development Tools
- **Build Tool:** Create React App
- **Package Manager:** npm
- **Environment:** Node.js v18+

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                   │
│          Port 6767/6768 (Dev Server)                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   HTTP/REST (Axios)          │
        │   Header: x-api-key or JWT   │
        └──────────────────┬───────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                Backend (Express.js)                      │
│              Port 5000                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes Layer                                     │   │
│  │ ├─ /api/admin/auth     (Admin auth)             │   │
│  │ ├─ /api/users          (End user auth)          │   │
│  │ ├─ /api/aircraft       (Aircraft data)          │   │
│  │ ├─ /api/manufacturers  (Manufacturer data)      │   │
│  │ ├─ /api/categories     (Category data)          │   │
│  │ ├─ /api/api-keys       (API key management)     │   │
│  │ └─ /api/chatbot        (AI chatbot)             │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ Middleware Layer                                 │   │
│  │ ├─ CORS                                          │   │
│  │ ├─ JWT Verification                             │   │
│  │ ├─ API Key Authentication                       │   │
│  │ └─ Error Handler                                │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ Business Logic Layer                             │   │
│  │ ├─ Admin Service                                 │   │
│  │ ├─ User Service                                  │   │
│  │ ├─ Aircraft Service                              │   │
│  │ └─ API Key Service                               │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ Data Layer (Sequelize ORM)                       │   │
│  │ ├─ Admin Model                                   │   │
│  │ ├─ User Model                                    │   │
│  │ ├─ Aircraft Model                                │   │
│  │ ├─ ApiKey Model                                  │   │
│  │ └─ Association Layer                             │   │
│  └──────────────────┬───────────────────────────────┘   │
└──────────────────────▼───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│         MySQL Database                                   │
│         (aerocatalog database)                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Tables:                                          │   │
│  │ ├─ admins              (Admin users)             │   │
│  │ ├─ end_users           (End user developers)    │   │
│  │ ├─ aircraft            (Aircraft data)           │   │
│  │ ├─ manufacturers       (Manufacturer info)       │   │
│  │ ├─ categories          (Aircraft categories)     │   │
│  │ ├─ api_keys            (User API keys)           │   │
│  │ ├─ chat_sessions       (Chat history)            │   │
│  │ └─ chat_messages       (Chat messages)           │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Admin Table (admins)
```sql
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255), -- bcrypt hashed
  role ENUM('admin') DEFAULT 'admin',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### End User Table (end_users)
```sql
CREATE TABLE end_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255), -- bcrypt hashed
  company VARCHAR(255),  -- optional
  website VARCHAR(255),  -- optional
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Aircraft Table (aircraft)
```sql
CREATE TABLE aircraft (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  manufacturerId INT,
  categoryId INT,
  capacity INT,
  speed INT, -- km/h
  range INT, -- km
  description TEXT,
  specifications JSON,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (manufacturerId) REFERENCES manufacturers(id),
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);
```

### API Keys Table (api_keys)
```sql
CREATE TABLE api_keys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  key VARCHAR(255) UNIQUE,
  name VARCHAR(100),
  lastUsed TIMESTAMP,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES end_users(id) ON DELETE CASCADE
);
```

### Relationships
```
admins (1) ──── (N) [No direct relations - Independent entity]

end_users (1) ──── (N) api_keys
            (1) ──── (N) chat_sessions

aircraft (N) ──── (1) manufacturers
          (N) ──── (1) categories

manufacturers (1) ──── (N) aircraft
categories (1) ──── (N) aircraft

chat_sessions (1) ──── (N) chat_messages
              (N) ──── (1) end_users

chat_messages (N) ──── (1) chat_sessions
```

---

## Authentication Flow

### 1. Admin Authentication
```
POST /api/admin/auth/login
├─ Input: { email, password }
├─ Process:
│  ├─ Find admin by email
│  ├─ Verify password with bcrypt
│  └─ Generate JWT token with { id, type: 'admin' }
└─ Output: { success, token, admin }

JWT Structure:
{
  "id": 1,
  "type": "admin",
  "iat": 1234567890,
  "exp": 1241174690
}
```

### 2. End User Authentication
```
POST /api/users/register
├─ Input: { name, email, password, company?, website? }
├─ Process:
│  ├─ Validate email not exists
│  ├─ Hash password with bcrypt
│  ├─ Create user in end_users table
│  └─ Generate JWT token
└─ Output: { success, token, user }

POST /api/users/login
├─ Input: { email, password }
├─ Process:
│  ├─ Find user by email
│  ├─ Verify password with bcrypt
│  └─ Generate JWT token
└─ Output: { success, token, user }
```

### 3. API Key Authentication (For Aircraft Data)
```
GET /api/aircraft
├─ Header: x-api-key: aircraft_xxxxx
├─ Process:
│  ├─ Verify API key exists in api_keys table
│  ├─ Check if key is active
│  ├─ Update lastUsed timestamp
│  └─ Return aircraft data
└─ Output: { success, data: [...] }
```

---

## API Endpoints

### Admin Routes (/api/admin/auth)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/login` | None | Admin login |

### User Routes (/api/users)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | None | Register new user |
| POST | `/login` | None | User login |

### API Keys Routes (/api/api-keys)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/generate` | JWT | Generate new API key (max 10) |
| GET | `/` | JWT | Get all API keys |
| DELETE | `/:keyId` | JWT | Revoke/delete API key |

### Aircraft Routes (/api/aircraft)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | API Key | Get all aircraft |
| GET | `/:id` | API Key | Get specific aircraft |

### Manufacturer Routes (/api/manufacturers)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | None | Get all manufacturers |
| GET | `/:id` | None | Get specific manufacturer |

### Category Routes (/api/categories)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | None | Get all categories |
| GET | `/:id` | None | Get specific category |

### Chatbot Routes (/api/chatbot)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/chat` | JWT | Send chat message |
| GET | `/sessions` | JWT | Get chat history |

---

## Frontend Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js        (Global navigation)
│   │   └── Footer.js        (Global footer)
│   │
│   ├── pages/
│   │   ├── Home.js                    (Landing page with carousel)
│   │   ├── Help.js                    (API docs + tester)
│   │   ├── Register.js                (End user registration)
│   │   ├── UserLogin.js               (End user login)
│   │   ├── UserDashboard.js           (API key management)
│   │   ├── AircraftCatalog.js         (Browse aircraft)
│   │   ├── AircraftDetail.js          (Aircraft details)
│   │   ├── AdminLogin.js              (Admin login)
│   │   ├── AdminDashboard.js          (Admin panel)
│   │   └── Chatbot.js                 (AI assistant)
│   │
│   ├── store/
│   │   └── authStore.js     (Zustand auth state)
│   │
│   ├── api/
│   │   └── client.js        (Axios instance)
│   │
│   ├── App.js               (Main router)
│   ├── App.css
│   └── index.js
│
├── .env                     (Config: API_URL, PORT)
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### Route Structure
```
/                          → Home (Landing page)
/help                      → Help & Documentation + API Tester
/register                  → End user registration
/login                     → End user login
/user/dashboard            → API key management
/catalog                   → Aircraft browsing
/aircraft/:id              → Aircraft details
/admin/login               → Admin login
/admin/dashboard           → Admin panel
/chatbot                   → AI chatbot
```

---

## Backend Structure

```
backend/
├── src/
│   ├── server.js           (Main entry point)
│   │
│   ├── config/
│   │   └── database.js     (MySQL connection)
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Aircraft.js
│   │   ├── ApiKey.js
│   │   ├── Manufacturer.js
│   │   ├── Category.js
│   │   ├── ChatSession.js
│   │   ├── ChatMessage.js
│   │   └── index.js        (Associations)
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── user.routes.js
│   │   ├── aircraft.routes.js
│   │   ├── apikey.routes.js
│   │   ├── manufacturer.routes.js
│   │   ├── category.routes.js
│   │   └── chatbot.routes.js
│   │
│   └── middleware/
│       ├── auth.js         (JWT verification)
│       ├── apiKeyAuth.js   (API key verification)
│       └── errorHandler.js (Error handling)
│
├── migrate-admins.js       (Seed admin accounts)
├── fix-apikeys.js          (Fix foreign key constraints)
├── cleanup-apikeys.js      (Clean api_keys table)
├── generate-admin-query.js (Generate SQL for admin)
├── .env                    (Config: DB, JWT, PORT)
└── package.json
```

---

## Data Flow Examples

### Example 1: End User Registration → Generate API Key → Test API

```
1. User lands on Home page
   ↓
2. Clicks "Ayo Daftar Sekarang!"
   ↓
3. Fills registration form (name, email, password, company, website)
   ↓
4. POST /api/users/register
   Backend: Create user, hash password, return JWT token
   Frontend: Store token in localStorage, redirect to /user/dashboard
   ↓
5. User at /user/dashboard
   ↓
6. Clicks "Generate API Key"
   ↓
7. POST /api/api-keys/generate
   Backend: Check user has < 10 keys, generate 32-char key, save to DB
   Frontend: Display new key with copy button
   ↓
8. User goes to /help → Test API tab
   ↓
9. Pastes API key and selects endpoint
   ↓
10. Clicks "Test"
    ↓
11. Frontend sends: GET /api/aircraft with header x-api-key
    Backend: Verify API key, return aircraft data
    Frontend: Display JSON response
```

### Example 2: Admin Login → View Dashboard

```
1. Admin goes to /admin/login
   ↓
2. Enters email & password
   ↓
3. POST /api/admin/auth/login
   Backend: Find admin, verify password, return JWT token
   Frontend: Store token, redirect to /admin/dashboard
   ↓
4. Admin dashboard loads
   (API key management interface)
```

---

## Security Considerations

1. **Password Hashing:** bcryptjs with salt rounds 10
2. **JWT Token:** Signed with JWT_SECRET, expires in 7 days
3. **API Keys:** 32-character random strings via crypto module
4. **CORS:** Enabled for frontend origin
5. **API Key Scope:** Only authenticated users can generate
6. **Rate Limiting:** TODO (future enhancement)
7. **HTTPS:** TODO (production requirement)

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
PORT=6767
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3309
DB_NAME=aerocatalog
DB_USER=root
DB_PASSWORD=Meraklangka1

JWT_SECRET=reallysecretkey
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

---

## Database Configuration

- **Host:** localhost
- **Port:** 3309
- **Database:** aerocatalog
- **User:** root
- **Password:** Meraklangka1
- **Driver:** MySQL

### Initial Data (Seeded)
- **63+ Aircraft** from 5 manufacturers across 6 categories
- **1-2 Admin accounts** (auto-created by migrate-admins.js)

---

## Development Workflow

### Setup
```bash
# Clone & install
git clone <repo>
cd AeroCatalog_103

# Backend
cd backend
npm install
npm start  # Runs on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm start  # Runs on port 6767/6768
```

### Database Reset
```bash
# Clear API keys table
node backend/cleanup-apikeys.js

# Fix foreign key constraints
node backend/fix-apikeys.js

# Reseed admin accounts
node backend/migrate-admins.js
```

### Generate Admin Account
```bash
# Generate hashed password query
node backend/generate-admin-query.js
# Copy the SQL and execute in database
```

---

## Future Enhancements

- [ ] Rate limiting per API key
- [ ] Usage analytics dashboard
- [ ] API key expiration dates
- [ ] Email verification for users
- [ ] OAuth integration
- [ ] Webhook support
- [ ] GraphQL API
- [ ] Mobile app
- [ ] Video tutorials
- [ ] Community forum

---

## Support & Documentation

- **API Tester:** Available at `/help` page
- **Code Examples:** JavaScript, Python, cURL
- **Live Testing:** No setup required
- **Documentation:** Embedded in Help page

---

**Last Updated:** January 11, 2026
**Maintained By:** Development Team
