# Aircraft Catalog Application

Aplikasi katalog pesawat Boeing dan Airbus dengan fitur:
- **Public**: Browse katalog pesawat tanpa login
- **Admin**: Generate API key untuk CRUD operations
- **Database**: MySQL dengan Sequelize ORM

## Architecture

```
AeroCatalog_103/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & error handling
│   │   ├── config/       # Database config
│   │   └── server.js     # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/             # React + Tailwind UI
    ├── src/
    │   ├── pages/        # Page components
    │   ├── components/   # Reusable components
    │   ├── api/          # API client
    │   ├── store/        # Zustand stores
    │   └── App.js
    ├── package.json
    └── README.md
```

## Quick Start

### Prerequisites
- Node.js 14+
- MySQL 5.7+
- npm atau yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup .env file
cp .env.example .env
# Edit .env dan konfigurasi:
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=aerocatalog
# DB_USER=root
# DB_PASSWORD=

# Create database
mysql -u root -p
CREATE DATABASE aerocatalog;

# Run server
npm run dev
```

Server running di `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

App akan buka di `http://localhost:3000`

## API Key Flow

1. **Admin Login**
   - POST `/api/auth/register` atau `/api/auth/login`
   - Dapatkan JWT token

2. **Generate API Key**
   - POST `/api/admin/api-keys/generate` dengan JWT token
   - Dapatkan API key (simpan, tidak bisa dilihat lagi!)

3. **Use API Key untuk CRUD**
   - Kirim API key di header `X-API-Key`
   - Contoh:
   ```bash
   curl -X POST http://localhost:5000/api/aircraft \
     -H "X-API-Key: aircraft_xxxxx" \
     -H "Content-Type: application/json" \
     -d '{
       "manufacturerId": 1,
       "categoryId": 1,
       "modelName": "Boeing 737",
       ...
     }'
   ```

## Database Schema

### Users
- Admin accounts untuk manage data

### ApiKeys
- API keys untuk CRUD dengan expiry & tracking

### Manufacturers
- Boeing, Airbus, dll.

### Categories
- Narrow-body, Wide-body, Regional, Cargo, Military

### Aircraft
- Semua pesawat dengan spesifikasi lengkap

Relasi:
- Manufacturer → Aircraft (1:many)
- Category → Aircraft (1:many)
- User → ApiKey (1:many)

## Available Routes

### Public Routes (No Auth)
- `GET /api/aircraft` - List aircraft dengan filter
- `GET /api/aircraft/:id` - Detail pesawat
- `GET /api/manufacturers` - List manufacturers
- `GET /api/categories` - List categories

### Admin Routes (JWT Token)
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `POST /api/admin/api-keys/generate` - Generate API key
- `GET /api/admin/api-keys` - List API keys
- `DELETE /api/admin/api-keys/:id` - Revoke API key

### CRUD Routes (API Key Required)
- `POST /api/aircraft` - Create aircraft
- `PUT /api/aircraft/:id` - Update aircraft
- `DELETE /api/aircraft/:id` - Delete aircraft
- `POST /api/manufacturers` - Create manufacturer
- `PUT /api/manufacturers/:id` - Update manufacturer
- `DELETE /api/manufacturers/:id` - Delete manufacturer
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Demo Admin Account

```
Email: admin@example.com
Password: password123
```

(Ganti dengan credensial di database setelah setup)

## Tech Stack

### Backend
- Node.js + Express.js
- Sequelize ORM
- MySQL
- JWT + API Keys
- bcryptjs untuk password hashing

### Frontend
- React 18
- React Router v6
- Axios
- Zustand
- Tailwind CSS
- React Icons

## Features

✅ **Public**
- Browse aircraft catalog
- Search & filter aircraft
- View aircraft specifications

✅ **Admin**
- User registration & login
- API key generation & management
- CRUD aircraft
- CRUD manufacturers
- CRUD categories

## Project Structure Notes

- **Backend**: REST API dengan Sequelize models
- **Frontend**: React SPA dengan client-side routing
- **Database**: Normalized relational schema
- **Auth**: JWT untuk admin, API Keys untuk CRUD

## File Highlights

**Backend Key Files:**
- `src/server.js` - Express app setup
- `src/models/` - Sequelize models
- `src/routes/` - API endpoints
- `src/middleware/` - Auth & error handling

**Frontend Key Files:**
- `src/App.js` - Router setup
- `src/pages/` - Page components
- `src/api/client.js` - API client
- `src/store/authStore.js` - Auth state

## Troubleshooting

**Database Connection Error**
- Check MySQL running
- Verify credentials di `.env`
- Buat database: `CREATE DATABASE aerocatalog;`

**CORS Error**
- Backend CORS di `src/server.js` harus allow frontend origin
- Development: `http://localhost:3000`

**API Key Not Working**
- Pastikan key active di database
- Check header: `X-API-Key: <key>`
- Verify key exists di `api_keys` table

## Next Steps

1. Install & run backend
2. Create demo admin account
3. Generate API key via dashboard
4. Test CRUD dengan API key
5. Customize data sesuai kebutuhan

## Support

Refer ke:
- `backend/README.md` untuk API documentation
- `frontend/README.md` untuk frontend setup details

---

**Happy Coding! ✈️**
