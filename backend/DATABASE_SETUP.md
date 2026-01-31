# Database Setup Instructions

## Prerequisites
You need PostgreSQL installed and running. Download from: https://www.postgresql.org/download/windows/

## Steps to Initialize Database

### Option A: Using pgAdmin (GUI - Recommended for Windows)
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name it: `vibecraft`
5. Click Save

### Option B: Using Command Line
If you have PostgreSQL in your PATH:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE vibecraft;"

# Initialize schema
cd backend
node src/init-db.js
```

### Option C: Using SQL Shell (psql)
1. Open "SQL Shell (psql)" from Start Menu
2. Press Enter for default values until you reach password
3. Enter your PostgreSQL password
4. Run: `CREATE DATABASE vibecraft;`
5. Exit: `\q`
6. Then run: `node src/init-db.js` from backend folder

## Update .env File
Make sure the password in `backend/.env` matches your PostgreSQL password.
Default is set to `password`, change if needed.

## After Setup
Restart the backend server (Ctrl+C then `npm start`)
