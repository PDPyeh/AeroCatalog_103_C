# Aircraft Catalog - Frontend

Frontend React untuk aplikasi katalog pesawat Boeing dan Airbus.

## Features

- ✈️ **Public Catalog**: Lihat semua pesawat tanpa perlu login
- 🔍 **Search & Filter**: Cari pesawat berdasarkan nama, manufaktur, atau kategori
- 📋 **Aircraft Details**: Lihat spesifikasi lengkap setiap pesawat
- 👨‍💼 **Admin Dashboard**: Dashboard untuk admin dengan API key management
- 🔐 **API Key Authentication**: Generate dan manage API keys untuk CRUD operations
- 📱 **Responsive Design**: Mobile-friendly interface dengan Tailwind CSS

## Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Configuration** (optional)
```bash
# Create .env file untuk production
echo "REACT_APP_API_URL=http://your-backend-api.com" > .env
```

3. **Start Development Server**
```bash
npm start
```

Aplikasi akan buka di `http://localhost:3000`

## Pages

### Public Pages

**Home (`/`)**
- Landing page dengan penjelasan aplikasi
- CTA untuk browse catalog atau admin login

**Aircraft Catalog (`/catalog`)**
- Grid tampilan semua pesawat
- Filter berdasarkan manufacturer dan category
- Search functionality
- Click untuk lihat detail

**Aircraft Detail (`/aircraft/:id`)**
- Spesifikasi lengkap pesawat
- Informasi tentang manufacturer

### Admin Pages

**Admin Login (`/admin/login`)**
- Form login untuk admin
- Redirect ke dashboard setelah login sukses

**Admin Dashboard (`/admin/dashboard`)**
- **API Keys Tab**: Generate, view, dan revoke API keys
- **Aircraft Tab**: View semua aircraft dalam database
- **Manufacturers Tab**: View semua manufacturers
- **Categories Tab**: View semua categories

## Tech Stack

- **React 18**: UI library
- **React Router v6**: Routing
- **Axios**: HTTP client
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **React Icons**: Icon library

## Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── client.js          # API configuration & endpoints
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── AircraftCatalog.js
│   │   ├── AircraftDetail.js
│   │   ├── AdminLogin.js
│   │   └── AdminDashboard.js
│   ├── store/
│   │   └── authStore.js       # Zustand auth store
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## API Integration

Frontend terhubung ke backend API pada:
- Development: `http://localhost:5000/api`
- Production: Configure via `REACT_APP_API_URL` env variable

### Authentication

Token JWT disimpan di localStorage setelah login. Setiap request ke protected endpoints otomatis include token di header `Authorization: Bearer <token>`.

API Keys untuk CRUD operations dikirim via header `X-API-Key`.

## State Management

**useAuthStore** (Zustand)
- `user`: Current admin user
- `token`: JWT token
- `isAuthenticated`: Login status
- `login()`: Set user & token
- `logout()`: Clear user & token
- `setUser()`: Update user data

## Development

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Notes

- Aplikasi memerlukan backend API berjalan di port 5000
- API Configuration di `src/api/client.js`
- Tailwind CSS configuration di `tailwind.config.js`
- Responsive breakpoints menggunakan Tailwind defaults

## Future Enhancements

- Add aircraft management UI untuk admin
- Add manufacturer & category management
- Add image upload untuk aircraft
- Add user feedback/ratings
- Add export/print aircraft specifications
