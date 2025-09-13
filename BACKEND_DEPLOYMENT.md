# Backend Deployment Guide - Render (Web Service)

This guide will help you deploy the backend of the Smart IT Service Request & Issue Tracking System to Render as a Web Service.

## 🚀 Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- PostgreSQL database (Render PostgreSQL or external)
- SMTP email service (Gmail, SendGrid, etc.)
- OpenAI API key

## 📋 Backend Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub**
2. **Verify the backend works locally:**
   ```bash
   cd server
   npm install
   npm start
   ```

### Step 2: Create Web Service on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Select your repository**

### Step 3: Configure Backend Service

**Basic Configuration:**
- **Name**: `smart-it-tracker-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add these environment variables in Render dashboard:

```env
# Database Configuration
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=smart_it_tracker
DB_USER=your-db-username
DB_PASSWORD=your-db-password

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.onrender.com
```

### Step 4: Database Setup

#### Option A: Render PostgreSQL (Recommended)
1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "PostgreSQL"**
3. **Configure:**
   - **Name**: `smart-it-tracker-db`
   - **Database**: `smart_it_tracker`
   - **User**: `smart_it_tracker_user`
   - **Region**: Same as your backend
4. **Note the connection details**
5. **Update backend environment variables** with these details

#### Option B: External PostgreSQL
- Use any PostgreSQL provider (AWS RDS, DigitalOcean, etc.)
- Update backend environment variables with connection details

### Step 5: Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment to complete** (usually 3-5 minutes)
3. **Your backend will be available at**: `https://your-backend-name.onrender.com`

### Step 6: Database Migration

After backend deployment, run the migration:

1. **Go to your backend service in Render**
2. **Click "Shell" tab**
3. **Run**: `npm run migrate`

Or add this to your backend build command:
```bash
npm install && npm run migrate && npm start
```

## 🔧 Configuration Files

### Backend Configuration
The backend is already configured with:
- `server/package.json` with proper scripts
- `server/index.js` with production settings
- Environment variables properly configured

### Environment Variables Required:
```env
# Database
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=smart_it_tracker
DB_USER=your-db-username
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-jwt-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenAI
OPENAI_API_KEY=your-openai-key

# Server
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.onrender.com
```

## 🌐 Custom Domain (Optional)

1. **Go to your web service**
2. **Click "Settings" → "Custom Domains"**
3. **Add your domain**
4. **Configure DNS records as instructed**

## 🔒 Security Considerations

### Production Environment
- Use strong, unique JWT secrets
- Enable HTTPS (automatic on Render)
- Use environment variables for all secrets
- Regularly update dependencies
- Monitor logs for security issues

### Database Security
- Use strong database passwords
- Enable SSL connections
- Regular backups
- Monitor database access

### API Security
- Rate limiting enabled
- CORS properly configured
- Input validation
- Error handling without sensitive data

## 📊 Monitoring

### Render Dashboard
- Monitor service health
- View logs
- Check resource usage
- Set up alerts

### Application Monitoring
- Monitor API response times
- Track error rates
- Monitor database performance
- Set up uptime monitoring

## 🚨 Troubleshooting

### Common Issues

#### Backend Not Starting
- **Check environment variables**
- **Verify database connection**
- **Check port configuration**
- **Review startup logs**

#### Database Connection Issues
- **Verify database credentials**
- **Check network connectivity**
- **Ensure database is running**
- **Check SSL configuration**

#### CORS Issues
- **Verify CLIENT_URL environment variable**
- **Check CORS configuration in backend**
- **Ensure frontend URL is correct**

### Debugging Steps
1. **Check Render service logs**
2. **Verify environment variables**
3. **Test API endpoints manually**
4. **Check database connectivity**
5. **Review application logs**

## 📈 Performance Optimization

### Backend
- Enable database connection pooling
- Implement caching
- Optimize database queries
- Use compression middleware

## 🔄 Updates and Maintenance

### Updating Application
1. **Push changes to GitHub**
2. **Render automatically redeploys**
3. **Monitor deployment logs**
4. **Test functionality**

### Database Updates
1. **Create migration scripts**
2. **Test on staging environment**
3. **Apply to production**
4. **Monitor for issues**

## 💰 Cost Optimization

### Free Tier Limits
- **Web Services**: 750 hours/month
- **PostgreSQL**: 1GB storage

### Optimization Tips
- Monitor resource usage
- Optimize database queries
- Implement caching
- Use efficient algorithms

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Support](https://render.com/support)

### Application Support
- Check application logs
- Test locally first
- Verify configuration
- Use debugging tools

---

## 🎯 Quick Summary

**For Backend Deployment:**

1. **Create PostgreSQL database** on Render
2. **Create Web Service** on Render
3. **Set Root Directory to `server`**
4. **Set Build Command to `npm install`**
5. **Set Start Command to `npm start`**
6. **Add all environment variables**
7. **Deploy!**
8. **Run database migration**

**Your backend will be live at: `https://your-backend-name.onrender.com`**

---

**Happy Deploying! 🚀**

*Your backend is now live on Render as a web service!*
