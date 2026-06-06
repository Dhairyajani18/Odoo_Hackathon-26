# VendorBridge Frontend-Backend Connection Setup

## ✅ What's Been Connected

Your frontend and backend are now fully integrated! Here's what was set up:

### Backend API Endpoints
- **Vendors**: `http://localhost:5000/api/vendors`
- **RFQs**: `http://localhost:5000/api/rfqs`
- **Quotations**: `http://localhost:5000/api/quotations`
- **Purchase Orders**: `http://localhost:5000/api/pos`
- **Invoices**: `http://localhost:5000/api/invoices`

### Frontend API Configuration
- Created centralized API service (`src/api/api.js`)
- Updated AppContext to fetch data from backend on mount
- All CRUD operations now use backend API
- Real-time notifications and state management

## 🚀 Quick Start

### 1. Start PostgreSQL Database
Make sure your PostgreSQL database `vendorbridge` is running with the correct configuration from `.env`

### 2. Install Backend Dependencies
```bash
cd VendorBridge/backend
npm install
```

### 3. Start Backend Server
```bash
npm start
# or use nodemon for development
npm install -D nodemon
npx nodemon server.js
```
The backend will run on `http://localhost:5000`

### 4. Start Frontend (in a new terminal)
```bash
cd VendorBridge/client
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

## 📁 Key Files Changed

**Frontend:**
- `src/api/api.js` - Centralized API service
- `src/api/vendor.js` - Updated to use new API service
- `src/context/AppContext.jsx` - Connected to backend, removed mock data
- `package.json` - No new dependencies added (axios already included)

**Backend:**
- `config/db.js` - Updated to use environment variables
- `server.js` - Added CORS configuration for frontend
- `.env` - New configuration file

## 🔄 How Data Flows

1. **Frontend loads** → AppContext fetches all data from backend APIs
2. **User adds vendor** → Frontend sends POST request → Backend saves to PostgreSQL → Frontend updates local state
3. **User approves quotation** → Creates PO + Invoice in backend → Frontend updates state
4. **Notifications** → Real-time updates when actions occur

## ⚙️ Configuration

Backend expects these environment variables in `.env`:
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=vendorbridge
DB_PASSWORD=@1157Dipikass
DB_PORT=5432
```

Frontend expects backend at:
```
http://localhost:5000/api
```

## 🐛 Troubleshooting

**Backend not connecting?**
- Check PostgreSQL is running
- Verify database exists: `vendorbridge`
- Check credentials in `.env`

**Frontend showing blank data?**
- Open browser DevTools → Network tab
- Check if API calls are failing
- Verify backend is running on port 5000

**CORS errors?**
- Backend CORS is configured for `http://localhost:5173`
- If frontend runs on different port, update `server.js`

## 📝 Next Steps

1. Test the connection by adding a vendor through UI
2. Create test data in your PostgreSQL database
3. Set up authentication (login/signup currently mock)
4. Add error handling for failed API calls
5. Implement data persistence for offline support

---

**Backend is now the single source of truth for all data!** 🎉
