# AeroCatalog - New Architecture Documentation

## 📋 Overview

AeroCatalog telah di-refactor dengan arsitektur baru yang memisahkan **Admin** dan **End Users** untuk menyediakan layanan API Aircraft Database kepada developers.

## 🔄 Major Changes

### 1. Database Schema Changes

#### Tabel Baru:
- **`admins`** - Administrator yang mengelola sistem
  - Migrated dari tabel `users` lama
  - Fields: id, name, email, password, role, isActive
  
- **`end_users`** - User biasa yang menggunakan API service
  - Fields: id, name, email, password, company, website, isActive
  - User ini yang bisa generate API keys untuk akses aircraft database

#### Relasi:
- `end_users` → `api_keys` (1:many)
- `end_users` → `chat_sessions` (1:many)
- API Keys sekarang milik **end users**, bukan admin

### 2. Authentication Flow

#### User Login (Default - Halaman Utama `/`)
- Registration tersedia untuk siapa saja
- Login menggunakan `/api/users/login`
- Setelah login → redirect ke `/user/dashboard`
- Di halaman login ada link: **"Anda admin? Masuk sini!"** → `/admin/login`

#### Admin Login (`/admin/login`)
- **NO REGISTRATION** - Admin dibuat secara manual via migration
- Login menggunakan `/api/admin/auth/login`
- Setelah login → redirect ke `/admin/dashboard`
- Di halaman login ada link: **"← Back to User Login"** → `/`

### 3. Backend Routes

```javascript
// Admin Routes
POST /api/admin/auth/login     - Admin login (no registration)
GET  /api/admin/auth/me        - Get current admin profile

// User Routes
POST /api/users/register       - User registration
POST /api/users/login          - User login
GET  /api/users/me             - Get current user profile
PUT  /api/users/profile        - Update user profile

// API Keys (untuk end users)
GET    /api/api-keys           - Get all API keys (user's own)
POST   /api/api-keys           - Generate new API key
DELETE /api/api-keys/:id       - Delete API key

// Aircraft (Public/API)
GET /api/aircraft              - List all aircraft
GET /api/aircraft/:id          - Get aircraft detail
GET /api/manufacturers         - List manufacturers
GET /api/categories            - List categories
```

### 4. Frontend Routes

```javascript
// User Routes
/                              - User Login/Register
/user/dashboard                - User Dashboard (API key management)

// Admin Routes
/admin/login                   - Admin Login (no registration)
/admin/dashboard               - Admin Dashboard

// Public/Shared Routes
/catalog                       - Aircraft Catalog
/aircraft/:id                  - Aircraft Detail
/chatbot                       - AI Chatbot
```

### 5. User Dashboard Features

User Dashboard (`/user/dashboard`) adalah tempat users:
1. **Generate API Keys** untuk akses database aircraft
2. **Manage API Keys** (view, copy, delete)
3. **View API Documentation** dan contoh code
4. **Limit**: Max 10 API keys per user

#### API Documentation di Dashboard:
- Base URL endpoint
- Available endpoints (aircraft, manufacturers, categories)
- Authentication header format: `x-api-key: YOUR_API_KEY`
- Example code (JavaScript fetch)

### 6. Migration Script

File: `backend/migrate-admins.js`

```bash
node backend/migrate-admins.js
```

Script ini:
- Membaca data admin dari tabel `users` lama
- Migrate ke tabel `admins` baru
- Jika tidak ada data, create default admin:
  - Email: `admin@aerocatalog.com`
  - Password: `admin123`

## 🚀 How to Run

### 1. Backend Setup

```bash
cd backend
npm install

# Run migration
node migrate-admins.js

# Start server
npm start
# Server running on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
# App running on http://localhost:6767
```

## 👥 User Types & Access

### End Users (Developers)
- **Purpose**: Integrate aircraft database ke website mereka
- **Access**: User Dashboard untuk generate API keys
- **Registration**: Self-service via halaman utama
- **Dashboard**: `/user/dashboard`
- **Features**:
  - Generate up to 10 API keys
  - View API documentation
  - Copy API keys to clipboard
  - Delete unused API keys

### Admins (System Managers)
- **Purpose**: Mengelola sistem, data aircraft, categories, manufacturers
- **Access**: Admin Dashboard untuk CRUD operations
- **Registration**: Manual via migration script (NO self-registration)
- **Dashboard**: `/admin/dashboard`
- **Features**:
  - Manage aircraft data
  - Manage manufacturers
  - Manage categories
  - View system stats

## 🔐 Default Credentials

### Admin (created by migration)
```
Email: admin@aerocatalog.com
Password: admin123
```

### Additional Admins (migrated from old users table)
```
Email: admin@example.com
Password: (existing password from migration)

Email: walawe@mail.com
Password: (existing password from migration)
```

## 📊 Database Summary

After seeding:
- **63 Aircraft** models
- **5 Manufacturers**: Boeing, Airbus, Bombardier, Embraer, Airbus Helicopters
- **6 Categories**: Narrow Body, Wide Body, Regional, Business Jet, Cargo, etc.

## 🔑 API Key Usage Example

```javascript
// For developers using the API service
fetch('http://localhost:5000/api/aircraft', {
  headers: {
    'x-api-key': 'YOUR_API_KEY_FROM_DASHBOARD'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🎨 UI/UX Flow

1. **User lands on `/`** → User Login/Register page
   - Big call-to-action for registration
   - Small link at bottom: "Anda admin? Masuk sini!"

2. **User registers** → Auto-login → `/user/dashboard`
   - Dashboard shows: "Generate Your First API Key"
   - API documentation visible
   - Account info sidebar

3. **User generates API key** → Key displayed with copy button
   - Can create up to 10 keys
   - Each key shows creation date & last used
   - Delete button available

4. **Admin clicks "Masuk sini"** → `/admin/login`
   - Simple login form (no registration option)
   - After login → `/admin/dashboard`
   - Manage system resources

## ✅ Vision Implementation Complete

Semua requirement dari vision baru sudah terimplementasi:
- ✅ Tabel `users` renamed ke `admins`
- ✅ Tabel `end_users` baru untuk user biasa
- ✅ Dashboard terpisah untuk users (API key generation)
- ✅ Login terpisah admin dan users
- ✅ Halaman utama = User login dengan link ke admin login
- ✅ Service model: Kumpulan pesawat via API untuk developers

## 🔧 Technical Notes

### JWT Token Types
- Admin tokens: `{ id, type: 'admin' }`
- User tokens: `{ id, type: 'user' }`

### Password Hashing
- Menggunakan `bcrypt` with salt rounds 10
- Hash dilakukan via Sequelize hooks `beforeCreate`

### API Key Format
- Random 32-character string
- Checked for uniqueness before creation
- Tracked: createdAt, lastUsed, isActive

## 📝 Next Steps (Optional Enhancements)

1. Add API rate limiting per key
2. Add usage analytics (request count, endpoints used)
3. Add API key expiration dates
4. Add webhook notifications
5. Add pricing tiers (free, pro, enterprise)
6. Add OAuth integration for user login
7. Add API key scopes/permissions
