# 🚀 London Safety Routing System - Complete Setup Guide

## 📋 Prerequisites

### 1. Install Node.js (v18 or higher)
- Download from: https://nodejs.org/
- Choose LTS version
- Install with default settings
- Verify installation: `node --version` and `npm --version`

### 2. Install PostgreSQL with PostGIS
- Download from: https://www.postgresql.org/download/
- During installation:
  - **Username:** `postgres`
  - **Password:** `postgres` (or choose your own)
  - **Port:** `5432`
  - **Install Stack Builder:** Yes (for PostGIS)
- After installation, install PostGIS extension via Stack Builder

### 3. Install Git
- Download from: https://git-scm.com/
- Install with default settings

## 📥 Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/shalini78106502/london-safety-routing-nextjs.git
cd london-safety-routing-nextjs
```

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### Step 3: Configure Environment Variables
Edit `backend/.env` file:
```properties
# Backend Environment Variables
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=london_safety_routing
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret
JWT_SECRET=london_safety_routing_super_secret_jwt_key_2024

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Step 4: Database Setup

#### 4.1 Create Database (using pgAdmin or psql)
```sql
-- Connect to PostgreSQL as superuser
-- Create database
CREATE DATABASE london_safety_routing;

-- Connect to the new database
\c london_safety_routing;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 4.2 Initialize Database Schema
```bash
# From backend directory
node scripts/optimizeHazardSchema.js
```

### Step 5: Frontend Setup
```bash
# Navigate to project root
cd ..

# Install frontend dependencies
npm install
```

## 🚀 Running the Application

### Step 1: Start Backend Server
```bash
# In backend directory
cd backend
npm start

# You should see:
# 🚀 London Safety Routing API server running on port 5000
# ✅ Database connected successfully!
```

### Step 2: Start Frontend (New Terminal)
```bash
# In project root directory
npm run dev

# You should see:
# ▲ Next.js ready on http://localhost:3000
```

### Step 3: Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🔧 Troubleshooting

### Database Connection Issues
1. **Check PostgreSQL is running:**
   - Windows: Services → PostgreSQL should be "Running"
   - Mac: `brew services list | grep postgres`

2. **Verify credentials:**
   - Try connecting: `psql -h localhost -U postgres -d london_safety_routing`
   - If password fails, reset PostgreSQL password

3. **Check database exists:**
   ```sql
   \l  -- List all databases
   ```

### Common Errors

#### "Database does not exist"
```bash
# Create database manually
createdb -h localhost -U postgres london_safety_routing
```

#### "Permission denied for database"
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE london_safety_routing TO postgres;
```

#### "Extension postgis does not exist"
```sql
-- Install PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### Port 3000/5000 already in use
```bash
# Kill processes using the ports
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

## 📊 Verify Installation

### Check Database Tables
```bash
# From backend directory
node -e "
const { pool } = require('./config/database');
pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \\'public\\' ORDER BY table_name')
  .then(r => {
    console.log('📋 Database Tables:');
    r.rows.forEach((row, i) => console.log(\`\${i+1}. \${row.table_name}\`));
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  });
"
```

### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"healthy","message":"London Safety Routing API is running","timestamp":"..."}
```

## 🎯 Features Overview

### ✅ What's Working
- **Real-time hazard alerts** via PostgreSQL LISTEN/NOTIFY
- **Sub-100ms spatial queries** with PostGIS
- **User authentication** with JWT
- **Hazard reporting** with live updates
- **Interactive maps** with real-time data
- **Find buddy system**
- **Route suggestions**

### 🚀 System Architecture
- **Frontend:** Next.js 14 (React)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 15+ with PostGIS
- **Real-time:** Server-Sent Events (SSE)
- **Authentication:** JWT tokens
- **Styling:** TailwindCSS

## 📞 Support
If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify database connection and table structure
3. Ensure all environment variables are correctly set
4. Check that all required ports (3000, 5000, 5432) are available

## 🎉 Success Indicators
- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:3000
- ✅ "Live Alerts Active" appears when logged in
- ✅ Can create user account and login
- ✅ Can report hazards successfully
- ✅ Real-time notifications work across browser tabs