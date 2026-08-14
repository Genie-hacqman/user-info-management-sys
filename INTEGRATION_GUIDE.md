# Frontend-Backend Integration Guide

This guide will walk you through connecting your React frontend with the Express backend to create a fully functional user management system.

## 📋 Prerequisites

- Node.js 16+ and npm installed
- PostgreSQL database running locally or on a remote server
- Two terminal windows (one for frontend, one for backend)

## 🔧 Step 1: Backend Setup

### 1.1 Environment Configuration

Create/update the `.env` file in the `/backend` folder:

```bash
cd backend
```

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/user_management"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (change to a secure random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

**Important Notes:**

- Replace `user` and `password` with your PostgreSQL credentials
- Replace `localhost` if PostgreSQL is on a different host
- Create the database `user_management` in PostgreSQL if it doesn't exist:
  ```sql
  CREATE DATABASE user_management;
  ```

### 1.2 Install Dependencies

```bash
npm install
```

This will install:

- `express` - Web framework
- `@prisma/client` - Database ORM
- `prisma` - Database schema management
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management

### 1.3 Set Up the Database

```bash
npm run prisma:migrate
```

This will:

1. Create the database tables based on `schema.prisma`
2. Generate Prisma client code
3. Create migrations for version control

### 1.4 (Optional) Explore the Database

To visually inspect the database:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

### 1.5 Start the Backend Server

```bash
npm run dev
```

You should see output like:

```
✅ User Management API Server
🔗 Server running on http://localhost:3000
🔐 CORS enabled for: http://localhost:5173

📚 API Routes:
   POST   /auth/register    - Register new user
   POST   /auth/login       - Login user
   GET    /users           - Get all users (protected)
   GET    /users/:id       - Get user by ID (protected)
   PUT    /users/:id       - Update user (protected)
   DELETE /users/:id       - Delete user (protected)
```

**✅ Backend is now running and ready!**

---

## 🎨 Step 2: Frontend Setup

### 2.1 Environment Configuration

Create/update the `.env` file in the `/frontend` folder:

```bash
cd ../frontend
```

Edit `.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=User Management System
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Start the Frontend Development Server

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**✅ Frontend is now running!**

---

## 🔗 Step 3: Testing the Integration

### Test 1: Register a New User

1. Open http://localhost:5173 in your browser
2. Click "Create one" to go to the Register page
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+1 555 123 4567`
   - Password: `password123` (at least 6 characters)
   - Confirm Password: `password123`
4. Click "Register"
5. You should be redirected to login

**What happens behind the scenes:**

- Frontend sends POST request to `http://localhost:3000/auth/register`
- Backend hashes the password with bcrypt
- Backend stores user in PostgreSQL database
- Frontend shows success message and redirects to login

### Test 2: Login with the New User

1. Fill in Email and Password from above
2. Click "Sign In"
3. You should be redirected to the user dashboard

**What happens behind the scenes:**

- Frontend sends POST request to `http://localhost:3000/auth/login`
- Backend verifies password and generates JWT token
- Backend returns token and user data
- Frontend stores token in localStorage
- Frontend uses token for all future API requests

### Test 3: Verify Database

```bash
npm run prisma:studio
```

Navigate to Users table and you should see the registered user.

---

## 🛡️ How Authentication Works

### Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills registration form (name, email, password)    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend validates (email format, password length)      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. POST /auth/register with { name, email, password }     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend checks if email already exists                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend hashes password with bcrypt (10 rounds)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Backend saves user to PostgreSQL                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Backend returns user data (password never sent!)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Frontend redirects to login page                        │
└─────────────────────────────────────────────────────────────┘
```

### Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User enters email and password                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. POST /auth/login with { email, password }               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend finds user by email                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend compares password with bcrypt hash              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend generates JWT token (expires in 1 day)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Backend returns { token, user }                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend stores token in localStorage                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Frontend stores user in AuthContext & localStorage      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend redirects to dashboard (user or admin)         │
└─────────────────────────────────────────────────────────────┘
```

### Protected API Requests

```
┌──────────────────────────────────────┐
│ Frontend makes API request           │
│ (e.g., GET /users)                   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Axios interceptor adds:              │
│ Authorization: Bearer <jwt_token>   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Backend receives request             │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Auth middleware checks token         │
│ - Valid? Continue to route handler   │
│ - Invalid? Return 401                │
│ - Missing? Return 401                │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Handler executes with req.userId    │
│ (decoded from JWT)                   │
└──────────────────────────────────────┘
```

---

## 📁 API Endpoints Reference

### Authentication (Public)

#### Register New User

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Login User

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Management (Protected - Requires JWT Token)

#### Get All Users

```
GET /users
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  ...
]
```

#### Get User by ID

```
GET /users/:id
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update User

```
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response (200):
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Delete User

```
DELETE /users/:id
Authorization: Bearer <token>

Response (200):
{ "message": "User deleted successfully" }
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: `DATABASE_URL is not set`**

- Make sure `.env` file exists in `/backend` folder
- Make sure `DATABASE_URL` is set correctly

**Error: `connect ECONNREFUSED 127.0.0.1:5432`**

- PostgreSQL is not running
- Start PostgreSQL (Mac: `brew services start postgresql`, Linux: `sudo service postgresql start`)

**Error: `Database does not exist`**

- Create database: `createdb user_management`
- Or run: `npm run prisma:migrate`

### Frontend won't connect to backend

**Error: `CORS error` or `Failed to fetch`**

- Make sure backend is running on port 3000
- Check `.env` file in frontend has `VITE_API_URL=http://localhost:3000`
- Restart frontend: `npm run dev`

**Error: `404 Not Found`**

- Check the endpoint URL in the error message
- Verify backend routes are defined (check backend README)

### Login fails

**Error: `Invalid email or password`**

- Make sure email and password match (case-sensitive)
- Make sure user was registered first

**Error: `Email already registered`**

- The email already exists in database
- Use a different email or delete the user from database

### Token issues

**Error: `Token is invalid or expired`**

- Clear localStorage and login again
- Token expires after 1 day

**To clear localStorage in browser console:**

```javascript
localStorage.clear();
location.reload();
```

---

## 🚀 Running Both Servers (Recommended)

Open two terminal windows:

**Terminal 1 (Backend):**

```bash
cd /path/to/backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd /path/to/frontend
npm run dev
```

Both servers will now be running:

- Backend API: http://localhost:3000
- Frontend App: http://localhost:5173

---

## 📝 Next Steps

1. **Test all features:**
   - Register a new user
   - Login with email and password
   - Navigate to dashboard
   - Check user list (if admin)

2. **Customize:**
   - Update your `JWT_SECRET` in `.env`
   - Add more fields to User model in `schema.prisma`
   - Add new API routes as needed

3. **Production Setup:**
   - Use a strong `JWT_SECRET`
   - Update `FRONTEND_URL` in backend `.env`
   - Use production PostgreSQL database
   - Deploy backend (Heroku, Railway, AWS, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

---

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] Backend `.env` file is configured
- [ ] `npm run prisma:migrate` completed successfully
- [ ] Backend starts with `npm run dev`
- [ ] Frontend `.env` file is configured
- [ ] Frontend starts with `npm run dev`
- [ ] Can register a new user
- [ ] Can login with registered email/password
- [ ] JWT token is stored in localStorage
- [ ] Can see user data on dashboard
- [ ] Logout clears token and redirects to login

---

## 📞 Support

For issues:

1. Check error messages in browser console (F12)
2. Check backend server logs
3. Verify all `.env` files are configured
4. Check PostgreSQL is running
5. Restart both servers
