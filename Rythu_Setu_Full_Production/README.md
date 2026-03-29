# Rythu Setu — Full Production Starter

A farmer-to-customer organic marketplace with:
- Farmer / Customer / Admin roles
- Voice support in forms
- Product image upload
- Organic / pesticide-free filters
- Trust score
- Demand insights
- UPI QR / debit / credit / cash payment modes
- Delivery tracking with live socket updates
- MongoDB-backed backend
- Responsive React frontend

## Demo credentials seeded automatically on first run
- Admin: `admin@rythusetu.com` / `Admin@123`
- Farmer: `farmer@rythusetu.com` / `Farmer@123`
- Customer: `customer@rythusetu.com` / `Customer@123`

## Run locally
### 1. Start MongoDB
```bash
mongod
```

### 2. Start backend
```bash
cd server
npm install
npm start
```

### 3. Start frontend
```bash
cd ../client
npm install
npm start
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:3000`

## Notes
- If you already have an old database, delete the `rythusetu` database in MongoDB Compass for a clean seed.
- The backend automatically seeds demo data when the database is empty.
