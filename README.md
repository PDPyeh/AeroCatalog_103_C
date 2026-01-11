# AeroCatalog - API-as-a-Service Platform

Platform **API-as-a-Service** yang menyediakan database pesawat komersial untuk developer. Integrasi mudah, dokumentasi lengkap, dan live API testing langsung dari dashboard.

## 🎯 Project Overview

AeroCatalog adalah platform yang memisahkan dua role utama:

- **👥 End Users (Developers):** Mendaftar, generate API key, dan akses database pesawat via REST API
- **🔐 Admins:** Mengelola platform dan data

### Key Features

✨ **Untuk End Users:**
- Pendaftaran & login gratis
- Generate hingga 10 API keys
- Dashboard API key management
- Live API testing di browser
- Comprehensive API documentation
- Code examples (JavaScript, Python, cURL)

🛠️ **Data:**
- 63+ pesawat komersial
- 5 manufacturers (Boeing, Airbus, etc.)
- 6 kategori pesawat
- Spesifikasi lengkap (kapasitas, kecepatan, jangkauan)

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (port 3309)
- **ORM:** Sequelize
- **Auth:** JWT + API Keys

### Frontend
- **Framework:** React 18.2
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Zustand
- **HTTP:** Axios

---

## 📁 Project Structure

```
AeroCatalog_103/
├── backend/
│   ├── src/
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & error handling
│   │   ├── config/           # Database config
│   │   └── server.js         # Express entry point
│   ├── migrate-admins.js     # Seed admin accounts
│   ├── fix-apikeys.js        # Fix FK constraints
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js                 # Landing page (carousel)
│   │   │   ├── Help.js                 # Docs + API tester
│   │   │   ├── Register.js             # User signup
│   │   │   ├── UserLogin.js            # User login
│   │   │   ├── UserDashboard.js        # API key management
│   │   │   ├── AdminLogin.js           # Admin login
│   │   │   └── AdminDashboard.js       # Admin panel
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── store/
│   │   │   └── authStore.js            # Zustand auth state
│   │   ├── api/
│   │   │   └── client.js               # Axios instance
│   │   └── App.js                      # Router
│   ├── .env
│   └── package.json
│
├── ARCHITECTURE.md      # Detailed architecture docs
└── README.md           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MySQL** 5.7+ (running on port 3309)
- **npm**

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure .env (already provided)
# DB_HOST=localhost
# DB_PORT=3309
# DB_NAME=aerocatalog
# DB_USER=root
# DB_PASSWORD=Meraklangka1

# Seed admin accounts
node migrate-admins.js

# Start backend
npm start
```

✅ Backend running at `http://localhost:5000`

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (will open browser automatically)
npm start
```

✅ Frontend running at `http://localhost:6767` or `http://localhost:6768`

---

## 📱 User Flows

### Flow 1: End User Registration & API Testing

```
1. Visit http://localhost:6767 (Home page)
2. Click "🎉 Ayo Daftar Sekarang!"
3. Fill registration form (name, email, password, company, website)
4. Auto-login → UserDashboard
5. Click "Generate API Key"
6. Copy the key (save it somewhere safe!)
7. Go to Help & Docs page
8. Switch to "Test API" tab
9. Paste API key and test endpoints live
```

### Flow 2: Admin Login

```
1. Visit http://localhost:6767/admin/login
2. Enter credentials:
   - Email: admin@aerocatalog.com
   - Password: admin123
3. Access admin dashboard
```

### Flow 3: Using API with Generated Key

```bash
# Get all aircraft
curl -X GET http://localhost:5000/api/aircraft \
  -H "x-api-key: aircraft_xxxxx"

# Get specific aircraft
curl -X GET http://localhost:5000/api/aircraft/1 \
  -H "x-api-key: aircraft_xxxxx"
```

---

## 🔑 Authentication

### End User Authentication (JWT)
```
POST /api/users/register
POST /api/users/login
Response: { token, user }
```

### Admin Authentication (JWT)
```
POST /api/admin/auth/login
Response: { token, admin }
```

### API Key Authentication
```
Header: x-api-key: aircraft_xxxxx
Used for: /api/aircraft, /api/manufacturers, /api/categories
```

---

## 📡 API Endpoints

### Aircraft (Public with API Key)
```
GET  /api/aircraft          # List all aircraft
GET  /api/aircraft/:id      # Get specific aircraft
```

### Manufacturers (Public)
```
GET  /api/manufacturers     # List all manufacturers
GET  /api/manufacturers/:id # Get specific manufacturer
```

### Categories (Public)
```
GET  /api/categories        # List all categories
GET  /api/categories/:id    # Get specific category
```

### API Keys (Authenticated Users Only)
```
POST   /api/api-keys/generate  # Generate new key (max 10)
GET    /api/api-keys           # List user's keys
DELETE /api/api-keys/:keyId    # Revoke key
```

### Admin Auth
```
POST /api/admin/auth/login  # Admin login
GET  /api/admin/auth/me     # Get admin profile
```

### User Auth
```
POST /api/users/register    # Register new user
POST /api/users/login       # Login user
GET  /api/users/me          # Get user profile
PUT  /api/users/profile     # Update profile
```

---

## 💾 Database

### Tables
- **admins** - Admin user accounts
- **end_users** - End user developer accounts
- **aircraft** - 63+ aircraft data
- **manufacturers** - 5 manufacturers
- **categories** - 6 aircraft categories
- **api_keys** - User API keys (max 10 per user)
- **chat_sessions** - Chatbot history
- **chat_messages** - Chat messages

### Relationships
```
end_users (1) ──── (N) api_keys
            (1) ──── (N) chat_sessions

aircraft (N) ──── (1) manufacturers
          (N) ──── (1) categories

chat_sessions (1) ──── (N) chat_messages
```

---

## 📚 Features Breakdown

### Home Page
- **Carousel:** 5 rotating aircraft images (auto-refresh every 5 seconds)
- **Hero Section:** Full-screen interactive landing
- **Features:** Why choose AeroCatalog section
- **CTAs:** Multiple calls-to-action for user acquisition

### Help & Documentation Page
- **Docs Tab:**
  - Getting Started guide
  - API Endpoints reference
  - Authentication explanation
  - Response format
  - Code examples (JS, Python, cURL)
  
- **Test API Tab:**
  - Live API tester
  - API key input
  - Endpoint selector
  - Real-time response display
  - Copy to clipboard

### User Dashboard
- Manage API keys
- View key creation date & last used
- Generate new keys
- Delete/revoke keys
- Account information display

### Admin Dashboard
- User management
- Platform analytics
- Data management

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# If occupied, kill the process
taskkill /PID <PID> /F

# Try again
cd backend && npm start
```

### Database Connection Error
```bash
# Verify MySQL is running
# Check credentials in backend/.env
# Ensure database exists
```

### Frontend CORS Issues
- Backend CORS is already configured for localhost:3000
- If testing on different port, update `.env`

### API Key Not Working
- Ensure key is active in database
- Check `x-api-key` header is set correctly
- Generate new key and try again

---

## 📖 Documentation

For detailed architecture and technical docs, see [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🗄️ Database Reset/Maintenance

```bash
# Reset API keys table
node backend/cleanup-apikeys.js

# Fix foreign key constraints
node backend/fix-apikeys.js

# Reseed admin accounts
node backend/migrate-admins.js

# Generate new admin account SQL
node backend/generate-admin-query.js
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
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

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
PORT=6767
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

---

## 👤 Default Credentials

**Admin Account:**
```
Email:    admin@aerocatalog.com
Password: admin123
```

(Generated by `migrate-admins.js`)

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": [ /* data here */ ],
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description here",
  "status": 400
}
```

---

## 🎓 Code Examples

### JavaScript/React
```javascript
const apiKey = 'aircraft_xxxxx';

// Get all aircraft
fetch('http://localhost:5000/api/aircraft', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log(data.data));
```

### Python
```python
import requests

api_key = 'aircraft_xxxxx'
headers = {'x-api-key': api_key}

response = requests.get(
  'http://localhost:5000/api/aircraft',
  headers=headers
)

aircraft = response.json()['data']
print(aircraft)
```

### cURL
```bash
curl -X GET http://localhost:5000/api/aircraft \
  -H "x-api-key: aircraft_xxxxx"
```

---

## 🚦 Status

| Component | Status | Port |
|-----------|--------|------|
| Backend API | ✅ Running | 5000 |
| Frontend | ✅ Running | 6767/6768 |
| Database | ✅ MySQL | 3309 |
| Auth System | ✅ JWT + API Keys | - |

---

## 🤝 Contributing

This is a learning project. Feel free to extend and improve!

Suggested enhancements:
- [ ] Rate limiting
- [ ] Usage analytics
- [ ] Email verification
- [ ] OAuth integration
- [ ] Webhook support
- [ ] Mobile app
- [ ] GraphQL API

---

## 📝 License

MIT

---

**Built with ❤️ using Node.js + React**

**Last Updated:** January 11, 2026

