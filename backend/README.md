# Aircraft Catalog - Backend

API untuk aplikasi katalog pesawat Boeing dan Airbus dengan fitur:
- **Public API**: Lihat daftar pesawat, filter berdasarkan manufaktur dan kategori
- **Admin Authentication**: Login dan generate API key untuk CRUD
- **MySQL Database**: Semua data disimpan di database

## Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure MySQL**
```bash
# Create database
mysql -u root -p
CREATE DATABASE aerocatalog;
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env dan sesuaikan database credentials:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=aerocatalog
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key_here
```

4. **Run Server**
```bash
npm run dev
```

Server akan jalan di `http://localhost:5000`

## API Endpoints

### Public Endpoints (Tidak perlu login)

**GET /api/aircraft**
- Get all aircraft
- Query params: `manufacturerId`, `categoryId`, `search`

**GET /api/aircraft/:id**
- Get single aircraft detail

**GET /api/manufacturers**
- Get all manufacturers

**GET /api/categories**
- Get all categories

### Admin Endpoints (Perlu login + API Key)

**POST /api/auth/register**
- Register admin account
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

**POST /api/auth/login**
- Login dan dapatkan JWT token
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**POST /api/admin/api-keys/generate**
- Generate API key (Header: `Authorization: Bearer <JWT_TOKEN>`)
```json
{
  "name": "My App"
}
```

**GET /api/admin/api-keys**
- Get all API keys (Header: `Authorization: Bearer <JWT_TOKEN>`)

**DELETE /api/admin/api-keys/:keyId**
- Revoke API key (Header: `Authorization: Bearer <JWT_TOKEN>`)

### Aircraft CRUD (Perlu API Key)

**POST /api/aircraft**
- Create aircraft (Header: `X-API-Key: <YOUR_API_KEY>`)
```json
{
  "manufacturerId": 1,
  "categoryId": 1,
  "modelName": "Boeing 737",
  "description": "...",
  "yearIntroduced": 2015,
  "maxPassengers": 180,
  "cruiseSpeed": 900,
  "maxAltitude": 35000,
  "wingspan": 35.8,
  "length": 39.5,
  "maxTakeoffWeight": 82000,
  "engines": 2,
  "engineType": "CFM56-7B",
  "range": 3500
}
```

**PUT /api/aircraft/:id**
- Update aircraft (Header: `X-API-Key: <YOUR_API_KEY>`)

**DELETE /api/aircraft/:id**
- Delete aircraft (Header: `X-API-Key: <YOUR_API_KEY>`)

### Manufacturer & Category CRUD

Sama seperti aircraft, gunakan API key di header `X-API-Key`

**POST/PUT/DELETE /api/manufacturers**
**POST/PUT/DELETE /api/categories**

## Database Models

### Users
- id (PK)
- name
- email (unique)
- password (hashed)
- role (admin)
- isActive
- createdAt, updatedAt

### ApiKeys
- id (PK)
- userId (FK)
- key (unique)
- name
- lastUsed
- isActive
- createdAt, updatedAt

### Manufacturers
- id (PK)
- name (unique)
- country
- description
- image
- isActive
- createdAt, updatedAt

### Categories
- id (PK)
- name (unique)
- description
- isActive
- createdAt, updatedAt

### Aircraft
- id (PK)
- manufacturerId (FK)
- categoryId (FK)
- modelName
- description
- yearIntroduced
- maxPassengers
- cruiseSpeed
- maxAltitude
- wingspan
- length
- maxTakeoffWeight
- engines
- engineType
- range
- image
- specifications (JSON)
- isActive
- createdAt, updatedAt

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT + API Keys
- **Validation**: Sequelize validators

## Security

- Password di-hash menggunakan bcryptjs
- API key untuk CRUD operations
- JWT token untuk admin authentication
- CORS enabled

## Development

```bash
# Install dependencies
npm install

# Run development server dengan nodemon
npm run dev

# Run production server
npm start
```
