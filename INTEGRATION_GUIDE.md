# Frontend-Backend Integration Guide

This guide will help you integrate your deployed frontend and backend services on Render.

## 🔗 Integration Overview

After deploying both services separately, you need to connect them by updating environment variables and ensuring proper communication.

## 📋 Integration Checklist

### ✅ Step 1: Deploy Backend
- [ ] Create PostgreSQL database on Render
- [ ] Deploy backend as Web Service
- [ ] Run database migration
- [ ] Note backend URL (e.g., `https://smart-it-tracker-backend.onrender.com`)

### ✅ Step 2: Update Frontend API URL
- [ ] Go to Frontend Static Site settings
- [ ] Update `REACT_APP_API_URL` environment variable
- [ ] Set value to `https://your-backend-name.onrender.com/api`
- [ ] Redeploy frontend

### ✅ Step 3: Update Backend CORS
- [ ] Go to Backend Web Service settings
- [ ] Update `CLIENT_URL` environment variable
- [ ] Set value to `https://your-frontend-name.onrender.com`
- [ ] Redeploy backend

### ✅ Step 4: Test Integration
- [ ] Visit your frontend URL
- [ ] Try logging in
- [ ] Create a ticket
- [ ] Check if data persists

## 🔧 Detailed Integration Steps

### Step 1: Backend Deployment

#### Create PostgreSQL Database
1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "PostgreSQL"**
3. **Configure:**
   - **Name**: `smart-it-tracker-db`
   - **Database**: `smart_it_tracker`
   - **User**: `smart_it_tracker_user`
   - **Region**: Same as your frontend
4. **Note the connection details**

#### Deploy Backend Web Service
1. **Click "New +" → "Web Service"**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `smart-it-tracker-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Add Backend Environment Variables
```env
# Database (from PostgreSQL service)
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=smart_it_tracker
DB_USER=your-db-username
DB_PASSWORD=your-db-password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-name.onrender.com
```

#### Run Database Migration
1. **Go to your backend service**
2. **Click "Shell" tab**
3. **Run**: `npm run migrate`

### Step 2: Frontend Integration

#### Update Frontend API URL
1. **Go to your Frontend Static Site**
2. **Click "Environment" tab** (in the main service view)
3. **Add environment variable:**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
4. **Click "Save Changes"**
5. **Redeploy** (automatic or manual)

**Alternative locations to find Environment:**
- Look for **"Environment"** tab in the main service view
- Check **"Settings"** → **"Environment Variables"**
- Look for **"Env"** or **"Environment Variables"** section

### Step 3: Backend CORS Update

#### Update Backend CORS Settings
1. **Go to your Backend Web Service**
2. **Click "Environment" tab** (in the main service view)
3. **Add environment variable:**
   - **Key**: `CLIENT_URL`
   - **Value**: `https://your-frontend-name.onrender.com`
4. **Click "Save Changes"**
5. **Redeploy** (automatic or manual)

**Alternative locations to find Environment:**
- Look for **"Environment"** tab in the main service view
- Check **"Settings"** → **"Environment Variables"**
- Look for **"Env"** or **"Environment Variables"** section

## 🧪 Testing Integration

### Test 1: Basic Connectivity
1. **Visit your frontend URL**
2. **Open browser developer tools (F12)**
3. **Check Network tab for API calls**
4. **Verify requests go to your backend URL**

### Test 2: Authentication
1. **Try logging in with default credentials:**
   - **Email**: `admin@company.com`
   - **Password**: `admin123`
2. **Check if login is successful**
3. **Verify you're redirected to dashboard**

### Test 3: Data Operations
1. **Create a new ticket**
2. **Check if it appears in the Kanban board**
3. **Try drag and drop functionality**
4. **Verify data persists after refresh**

### Test 4: API Endpoints
Test these endpoints directly:
- **Health Check**: `https://your-backend-name.onrender.com/api/health`
- **Login**: `POST https://your-backend-name.onrender.com/api/auth/login`
- **Tickets**: `GET https://your-backend-name.onrender.com/api/tickets`

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. **Verify `CLIENT_URL`** in backend environment variables
2. **Check backend CORS configuration**
3. **Ensure frontend URL is correct**

#### API Connection Failed
**Error**: `Failed to load resource: net::ERR_FAILED`

**Solution**:
1. **Verify `REACT_APP_API_URL`** in frontend environment variables
2. **Check if backend is running**
3. **Test backend URL directly**

#### Database Connection Issues
**Error**: `Database connection failed`

**Solution**:
1. **Verify database credentials**
2. **Check if PostgreSQL service is running**
3. **Run database migration**

#### Authentication Issues
**Error**: `Login failed` or `Unauthorized`

**Solution**:
1. **Check JWT_SECRET** is set correctly
2. **Verify database migration ran successfully**
3. **Check backend logs for errors**

### Debugging Steps

1. **Check Render service logs**
2. **Verify environment variables**
3. **Test API endpoints manually**
4. **Check browser console for errors**
5. **Verify database connectivity**

## 🔄 Redeployment Process

### When to Redeploy
- **After updating environment variables**
- **After code changes**
- **After configuration changes**

### How to Redeploy
1. **Frontend**: Automatic after environment variable changes
2. **Backend**: Automatic after environment variable changes
3. **Manual**: Click "Manual Deploy" in Render dashboard

## 📊 Monitoring Integration

### Frontend Monitoring
- **Check browser console** for errors
- **Monitor network requests** in developer tools
- **Test user workflows** regularly

### Backend Monitoring
- **Check Render service logs**
- **Monitor API response times**
- **Check database performance**

## 🎯 Success Indicators

### ✅ Integration is Working When:
- [ ] Frontend loads without errors
- [ ] Login works with default credentials
- [ ] Tickets can be created and viewed
- [ ] Drag and drop works in Kanban board
- [ ] Data persists after page refresh
- [ ] No CORS errors in browser console
- [ ] API calls return successful responses

## 📞 Support

### If Integration Fails:
1. **Check this troubleshooting guide**
2. **Review Render service logs**
3. **Verify environment variables**
4. **Test API endpoints manually**
5. **Check browser console for errors**

---

## 🎉 Final Result

After successful integration:
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`
- **Database**: Managed PostgreSQL on Render
- **Full Stack**: Fully functional IT Service Tracker!

**Your Smart IT Service Request & Issue Tracking System is now live and integrated! 🚀**
