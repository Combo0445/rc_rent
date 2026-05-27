# Car Rental Platform - Setup Guide

## 📋 Overview

This is a full-stack car rental application with:
- **Frontend**: React + TypeScript + Vite + React Router
- **Backend**: Node.js + Express.js
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Database**: In-memory data (can be replaced with a real database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

---

## 📦 Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd car-rental-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
The `.env` file is already set up with default values:
```
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

### Step 4: Start the Server
```bash
# Development mode (with auto-reload using nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on **http://localhost:5000**

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  { "username": "user", "password": "pass" }
  ```
- `POST /api/auth/login` - Login user
  ```json
  { "username": "user", "password": "pass" }
  ```

#### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get single car

#### Rentals (Requires Authentication)
- `POST /api/rentals` - Create new rental
  ```json
  { "carId": 1 }
  ```
- `GET /api/rentals/me` - Get user's rentals
- `DELETE /api/rentals/:id` - Cancel rental

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd ..  # Go back to root
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
The `.env.local` file is already configured to point to the backend:
```
VITE_API_URL=http://localhost:5000/api
```

**Note:** Make sure the backend is running before starting the frontend!

### Step 4: Start the Development Server
```bash
npm run dev
```

The frontend will typically run on **http://localhost:5173**

### Build for Production
```bash
npm run build
```

---

## ✨ Key Features Implemented

### ✅ Authentication
- User registration with password hashing
- User login with JWT token generation
- Token stored in localStorage
- Automatic logout with token expiration
- Protected routes (requires login)

### ✅ Car Management
- Browse all available cars
- Filter cars by type
- Search cars by brand
- Real-time availability status

### ✅ Rental System
- Rent cars (requires authentication)
- View personal rental history
- Cancel rentals
- Real-time availability updates

### ✅ User Experience
- Responsive design
- Loading states for async operations
- Error handling and messages
- Navbar with user state
- Auto-redirect to login for protected pages

---

## 🔄 How It Works

### Frontend → Backend Communication Flow

1. **User Registration**
   ```
   Register Page → API Call → Backend → Hash Password → Save User → Return Response
   ```

2. **User Login**
   ```
   Login Page → API Call → Backend → Verify Credentials → Generate JWT → Return Token
   → Store in localStorage
   ```

3. **Browsing Cars**
   ```
   Cars Page → Fetch from /api/cars → Display List → Filter/Search Locally
   ```

4. **Renting a Car**
   ```
   Rent Page → Submit Form → API Call with Auth Token → Backend verifies token
   → Decrease availability → Create rental record → Update UI
   ```

---

## 🐛 Troubleshooting

### Issue: Backend not connecting
- ✅ Ensure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env.local`
- ✅ Verify CORS is enabled in backend

### Issue: Authentication failing
- ✅ Clear browser localStorage (DevTools → Application → Storage)
- ✅ Check JWT_SECRET matches between frontend and backend
- ✅ Verify token is properly sent in Authorization header

### Issue: Cars not loading
- ✅ Check backend is running
- ✅ Verify `/api/cars` endpoint is working
- ✅ Check browser console for errors

### Issue: Port already in use
- Backend:
  ```bash
  # Change PORT in .env file, or kill process using port 5000
  ```
- Frontend:
  ```bash
  # Vite will prompt to use next available port
  ```

---

## 📝 Data Structure

### User
```javascript
{
  id: timestamp,
  username: string,
  password: hashedPassword
}
```

### Car
```javascript
{
  id: number,
  brand: string,
  type: string,
  available: number,
  pricePerDay: number
}
```

### Rental
```javascript
{
  id: timestamp,
  userId: number,
  carId: number,
  status: "active" | "pending" | "completed",
  createdAt: ISO8601
}
```

---

## 🔐 Security Notes

⚠️ **Development Only** - This is configured for development/learning purposes.

For production:
1. Replace in-memory data with a real database (MongoDB, PostgreSQL, etc.)
2. Use environment-specific secret keys
3. Implement HTTPS
4. Add rate limiting
5. Validate all inputs
6. Use refresh tokens with expiration
7. Implement CSRF protection
8. Add input sanitization

---

## 📚 Project Structure

```
car-rental-frontend/
├── src/
│   ├── Pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Cars.jsx
│   │   ├── Rent.jsx
│   │   └── MyRentals.jsx
│   ├── components/
│   │   └── Navbar.jsx
│   ├── services/
│   │   └── api.js          # API client
│   ├── App.tsx
│   └── main.tsx
├── .env.local              # API configuration
└── vite.config.ts

car-rental-backend/
├── server.js               # Main server
├── routes/
│   ├── auth.js            # Authentication endpoints
│   ├── cars.js            # Car endpoints
│   └── rentals.js         # Rental endpoints
├── middleware/
│   └── auth.js            # JWT verification
├── data/
│   ├── users.js           # User storage
│   ├── cars.js            # Car data
│   └── rentals.js         # Rental records
├── .env                    # Environment configuration
└── package.json
```

---

## 🎯 Next Steps

To extend this project:

1. **Database Integration**
   - Replace in-memory data with MongoDB or PostgreSQL
   - Add proper ORM (Mongoose, Prisma, etc.)

2. **Advanced Features**
   - Payment integration
   - Email notifications
   - Rating system
   - Advanced search/filters

3. **Deployment**
   - Deploy backend (Heroku, Railway, Render)
   - Deploy frontend (Vercel, Netlify)

4. **Testing**
   - Add unit tests (Jest)
   - Add integration tests
   - Add e2e tests (Cypress, Playwright)

---

## 📞 Support

For issues or questions, please check:
- Browser console for errors
- Network tab to see API requests
- Backend terminal for server logs

Enjoy your car rental platform! 🚗
