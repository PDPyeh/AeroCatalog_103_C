# 🤖 Chatbot Feature Setup Guide

## Overview
Sistem chatbot telah diintegrasikan dengan aplikasi AeroCatalog. Fitur ini memungkinkan pengguna yang sudah login untuk mengakses chatbot dengan API key.

## Architecture

### Backend Changes
1. **New Models:**
   - `ChatSession` - Menyimpan session chat per user
   - `ChatMessage` - Menyimpan messages dalam setiap session

2. **New Routes:**
   - `POST /api/chatbot/sessions` - Create new chat session
   - `GET /api/chatbot/sessions` - Get user's chat sessions
   - `GET /api/chatbot/sessions/:sessionId/messages` - Get messages in a session
   - `POST /api/chatbot/chat` - Send message to chatbot
   - `DELETE /api/chatbot/sessions/:sessionId` - Delete a session

3. **Authentication:**
   - Menggunakan API Key authentication (header `x-api-key`)
   - Existing `apiKeyAuth` middleware digunakan untuk validasi

4. **LM Studio Integration:**
   - Service: `ChatbotService.js`
   - Connects to: `http://localhost:1234/v1/chat/completions`
   - Model: Local model yang di-load di LM Studio (Qwen 3 4B)

### Frontend Changes
1. **New Page:**
   - `/pages/Chatbot.js` - UI untuk chatbot interface

2. **Features:**
   - API Key input screen (blur protection)
   - Chat session management (sidebar)
   - Message history
   - Modern UI dengan Tailwind CSS

3. **Navigation:**
   - Link "Chatbot" di Navbar (hanya untuk authenticated users)
   - Route protection: Redirect ke login jika belum authenticated

## Setup Steps

### 1. LM Studio Setup (Local)
```bash
# 1. Download LM Studio dari https://lmstudio.ai
# 2. Install dan buka aplikasi
# 3. Download model: Qwen 3 4B (atau model apapun yang sesuai)
# 4. Load model di LM Studio
# 5. Jalankan local server (default port: 1234)
```

### 2. Database Setup
```bash
cd backend
node check-create-db.js
```
Tables baru akan dibuat otomatis:
- `chat_sessions`
- `chat_messages`

### 3. Start Backend
```bash
cd backend
npm install axios  # Jika belum install
npm start
```
Server akan berjalan di `http://localhost:5000`

### 4. Start Frontend
```bash
cd frontend
npm start
```
Frontend akan berjalan di `http://localhost:6767`

### 5. Generate API Key
- Login ke Admin Dashboard
- Go to "API Keys" section
- Generate new API key
- Copy key tersebut

## How to Use

### User Flow
1. **Login** → Go to `/admin/login`
2. **Klik "Chatbot"** di navbar
3. **Input API Key** di form awal
4. **Create/Select Chat Session**
5. **Send Message** → Chatbot akan respond via LM Studio

### Admin
- Generate API keys di Dashboard untuk users
- Monitor chat activity di database

## File Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── ChatSession.js (NEW)
│   │   ├── ChatMessage.js (NEW)
│   │   └── index.js (UPDATED)
│   ├── routes/
│   │   └── chatbot.routes.js (NEW)
│   ├── services/
│   │   └── ChatbotService.js (NEW)
│   └── server.js (UPDATED)
│
frontend/
├── src/
│   ├── pages/
│   │   └── Chatbot.js (NEW)
│   ├── App.js (UPDATED)
│   └── components/
│       └── Navbar.js (UPDATED)
```

## Environment Variables
Backend `.env` sudah memiliki semua config yang diperlukan:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3309
DB_NAME=aerocatalog
DB_USER=root
DB_PASSWORD=Meraklangka1
JWT_SECRET=reallysecretkey
JWT_EXPIRE=7d
```

## Troubleshooting

### "Failed to get response from chatbot"
- Pastikan **LM Studio sudah running** di port 1234
- Check bahwa model sudah di-load

### "Invalid API key"
- Generate API key dari Admin Dashboard
- Pastikan API key masih active

### Database Errors
- Run `node check-create-db.js` lagi
- Check MySQL connection (port, credentials)

## Security Notes
- API Key disimpan di localStorage (untuk demo only)
- Production: Gunakan secure storage (httpOnly cookies)
- Implement rate limiting untuk chat endpoint
- Add validation untuk message content

## Future Enhancements
- [ ] Chat export (PDF/TXT)
- [ ] Message search
- [ ] Chat sharing
- [ ] Custom system prompts
- [ ] Token usage tracking
- [ ] Rate limiting
- [ ] Chat categories/tags

---
**Created:** January 5, 2026
**Status:** Ready to Test
