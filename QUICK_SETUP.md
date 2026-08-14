# Quick Setup Checklist ⚡

## Backend Setup (5 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with database credentials
# (Already created - update DATABASE_URL with your PostgreSQL connection)
cat .env

# 4. Initialize database
npm run prisma:migrate

# 5. Start backend server
npm run dev
```

✅ Backend should be running on http://localhost:3000

---

## Frontend Setup (3 minutes)

```bash
# 1. Navigate to frontend (in a NEW terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. .env is already configured
cat .env

# 4. Start frontend development server
npm run dev
```

✅ Frontend should be running on http://localhost:5173

---

## Verify Integration (2 minutes)

1. Open http://localhost:5173 in browser
2. Click "Create one" to register
3. Fill registration form:
   - Full Name: `Demo User`
   - Email: `demo@example.com`
   - Phone: `+1 555 123 4567`
   - Password: `password123`
4. Click "Register"
5. You'll be redirected to login
6. Login with the same email/password
7. ✅ You should see the dashboard!

---

## Files Changed/Created

### Backend

- ✅ `package.json` - Added dev/start scripts
- ✅ `src/index.js` - Added CORS, JWT error handling, improved logging
- ✅ `.env` - Created with database config
- ✅ `.env.example` - Template for reference

### Frontend

- ✅ `src/services/api.js` - Added JWT token interceptor, auth header
- ✅ `src/pages/Home.jsx` - Updated to use backend login API
- ✅ `src/pages/Register.jsx` - Updated to use backend register API
- ✅ `.env` - Created with API URL
- ✅ `.env.example` - Template for reference

### Documentation

- ✅ `INTEGRATION_GUIDE.md` - Complete setup and integration guide

---

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/user_management
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=User Management System
```

---

## Common Commands

### Backend

```bash
npm run dev           # Start with auto-reload
npm start             # Start production
npm run prisma:migrate  # Create database tables
npm run prisma:studio # Open database UI
```

### Frontend

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Check code quality
```

---

## Troubleshooting Quick Links

| Issue                  | Solution                                  |
| ---------------------- | ----------------------------------------- |
| Backend won't start    | Check DATABASE_URL in .env                |
| Frontend can't connect | Make sure backend is running on port 3000 |
| CORS error             | Restart frontend after backend starts     |
| Login fails            | Make sure user was registered first       |
| Token expired          | Clear localStorage and login again        |

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed troubleshooting.
