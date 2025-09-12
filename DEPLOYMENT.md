# Deployment Guide - Render

This guide will help you deploy the Smart IT Service Request & Issue Tracking System to Render.

## 🚀 Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- PostgreSQL database (Render PostgreSQL or external)
- SMTP email service (Gmail, SendGrid, etc.)
- OpenAI API key

## 📋 Deployment Steps

### 1. Backend Deployment (Web Service)

#### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

#### Step 2: Configure Backend Service
- **Name**: `smart-it-tracker-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Step 3: Environment Variables
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
CLIENT_URL=https://your-frontend-url.onrender.com
```

#### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Note the backend URL (e.g., `https://smart-it-tracker-backend.onrender.com`)

### 2. Frontend Deployment (Static Site)

#### Step 1: Create Static Site
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Select your repository

#### Step 2: Configure Frontend Service
- **Name**: `smart-it-tracker-frontend`
- **Environment**: `Static Site`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

#### Step 3: Environment Variables
Add these environment variables:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

#### Step 4: Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://smart-it-tracker-frontend.onrender.com`)

### 3. Database Setup

#### Option A: Render PostgreSQL (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `smart-it-tracker-db`
   - **Database**: `smart_it_tracker`
   - **User**: `smart_it_tracker_user`
   - **Region**: Same as your backend
4. Note the connection details
5. Update backend environment variables with these details

#### Option B: External PostgreSQL
- Use any PostgreSQL provider (AWS RDS, DigitalOcean, etc.)
- Update backend environment variables with connection details

### 4. Database Migration

After backend deployment, run the migration:

1. Go to your backend service in Render
2. Click **"Shell"** tab
3. Run: `npm run migrate`

Or add this to your backend build command:
```bash
npm install && npm run migrate && npm start
```

## 🔧 Configuration Files

### Frontend Configuration
The frontend is already configured with:
- `client/render.yaml` - Render configuration
- `client/public/_redirects` - Client-side routing support

### Backend Configuration
Ensure your backend has:
- `server/package.json` with proper scripts
- `server/index.js` with production settings
- Environment variables properly configured

## 🌐 Custom Domain (Optional)

### Frontend Custom Domain
1. Go to your static site service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Configure DNS records as instructed

### Backend Custom Domain
1. Go to your web service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Configure DNS records as instructed

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

#### Frontend Not Loading
- Check build logs for errors
- Verify environment variables
- Check API URL configuration
- Ensure client-side routing is working

#### Backend Not Starting
- Check environment variables
- Verify database connection
- Check port configuration
- Review startup logs

#### Database Connection Issues
- Verify database credentials
- Check network connectivity
- Ensure database is running
- Check SSL configuration

#### CORS Issues
- Verify CLIENT_URL environment variable
- Check CORS configuration in backend
- Ensure frontend URL is correct

### Debugging Steps
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connectivity
5. Review application logs

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement caching strategies

### Backend
- Enable database connection pooling
- Implement caching
- Optimize database queries
- Use compression middleware

## 🔄 Updates and Maintenance

### Updating Application
1. Push changes to GitHub
2. Render automatically redeploys
3. Monitor deployment logs
4. Test functionality

### Database Updates
1. Create migration scripts
2. Test on staging environment
3. Apply to production
4. Monitor for issues

### Security Updates
1. Regularly update dependencies
2. Monitor security advisories
3. Apply security patches
4. Review access logs

## 💰 Cost Optimization

### Free Tier Limits
- **Web Services**: 750 hours/month
- **Static Sites**: Unlimited
- **PostgreSQL**: 1GB storage

### Optimization Tips
- Use static site for frontend (free)
- Optimize database queries
- Implement caching
- Monitor resource usage

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Support](https://render.com/support)

### Application Support
- Check application logs
- Review error messages
- Test locally first
- Use debugging tools

---

**Happy Deploying! 🚀**

*Your Smart IT Service Request & Issue Tracking System is now live on Render!*
