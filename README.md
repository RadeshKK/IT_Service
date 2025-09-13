live link: https://it-services-rq34.onrender.com

# Smart IT Service Request & Issue Tracking System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)

A comprehensive, AI-powered IT service management platform that streamlines issue tracking, automates categorization, and provides intelligent solutions. Built with modern web technologies and designed for scalability.

## 🚀 Features

### Phase 1: Core MVP ✅
- **Web-Based Service Request Portal** - Clean, intuitive interface for submitting IT issues
- **Agile Kanban Board** - Drag-and-drop ticket management with real-time status updates
- **Basic Notification System** - Automated email notifications for ticket updates
- **Foundational Database Schema** - Robust data structure for users, tickets, and comments

### Phase 2: Intelligence & Integration ✅
- **AI Auto-Categorization** - Machine learning-powered issue classification
- **AI-Powered Solution Suggestions** - Intelligent recommendations based on historical data
- **Priority Assignment** - Automated priority level suggestions
- **Advanced Search & Filtering** - Powerful query capabilities

### Phase 3: Proactive & Automated Operations 🚧
- **Monitoring Tool Integration** - Connect with Datadog, Grafana, Zabbix
- **Predictive Issue Creation** - Proactive ticket generation based on system metrics
- **Automated Remediation Workflows** - Self-healing capabilities for common issues

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Accessible drag-and-drop functionality
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - User notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications
- **OpenAI GPT** - AI integration for categorization

### DevOps & Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Joi** - Data validation
- **Winston** - Logging

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 13+
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-it-tracker.git
cd smart-it-tracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb smart_it_tracker

# Or using psql
psql -U postgres
CREATE DATABASE smart_it_tracker;
```

### 4. Environment Configuration
```bash
# Copy environment templates
cp server/env.example server/.env
cp client/env.example client/.env
```

**Server Environment Variables** (`server/.env`):
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_it_tracker
DB_USER=your_database_username
DB_PASSWORD=your_database_password

# JWT Secret (generate a strong secret)
JWT_SECRET=your_jwt_secret_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_password

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Client Environment Variables** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Database Migration
```bash
cd server
npm run migrate
```

### 6. Start Development Servers
```bash
# Start both servers concurrently
npm run dev

# Or start individually
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Agent | agent@company.com | agent123 |
| User | user@company.com | user123 |

## 📖 API Documentation

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123"
}
```

### Tickets
```http
# Get all tickets
GET /api/tickets

# Create ticket
POST /api/tickets
{
  "title": "Network Issue",
  "description": "Unable to connect to internet",
  "priority": "high"
}

# Update ticket
PUT /api/tickets/:id
{
  "status": "in_progress",
  "assigneeId": 2
}
```

### Users
```http
# Get all users
GET /api/users

# Get agents
GET /api/users/agents
```

## 🏗️ Project Structure

```
smart-it-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── scripts/          # Database scripts
│   └── package.json
├── docs/                 # Documentation
├── tests/               # Test files
├── setup.sh            # Linux/Mac setup script
├── setup.bat           # Windows setup script
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
cd server && npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Render Deployment (Frontend Only)

#### Static Site Deployment
1. **Connect your GitHub repository** to Render
2. **Create a new Static Site** service
3. **Configure the service:**
   - **Root Directory**: Leave empty (or set to `.`)
   - **Build Command**: `cd client && npm install && chmod +x node_modules/.bin/react-scripts && CI=false npx react-scripts build`
   - **Publish Directory**: `client/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com/api`
4. **Deploy** - Render will automatically build and deploy your frontend

**Your frontend will be available at**: `https://your-app-name.onrender.com`

> **Note**: This deploys only the frontend. You'll need a separate backend API running elsewhere.

### Render Deployment (Backend Only)

#### Web Service Deployment
1. **Create a PostgreSQL database** on Render first
2. **Create a new Web Service** on Render
3. **Configure the service:**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `DB_HOST`: Your PostgreSQL database host
     - `DB_PORT`: `5432`
     - `DB_NAME`: `smart_it_tracker`
     - `DB_USER`: Your database username
     - `DB_PASSWORD`: Your database password
     - `JWT_SECRET`: Your JWT secret key
     - `SMTP_HOST`: `smtp.gmail.com`
     - `SMTP_PORT`: `587`
     - `SMTP_USER`: Your email
     - `SMTP_PASS`: Your email password
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: `production`
     - `CLIENT_URL`: `https://your-frontend-url.onrender.com`
4. **Deploy** - Render will automatically build and deploy your backend
5. **Run database migration** using Render Shell: `npm run migrate`

**Your backend will be available at**: `https://your-backend-name.onrender.com`

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production database
- Set up proper SMTP credentials
- Configure OpenAI API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI categorization capabilities
- **React Team** for the amazing frontend framework
- **PostgreSQL** for robust database functionality
- **Tailwind CSS** for beautiful, responsive design
- **@dnd-kit** for accessible drag-and-drop functionality

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-it-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/smart-it-tracker/discussions)

## 🔮 Roadmap

- [ ] **Q1 2024**: Slack/Teams bot integration
- [ ] **Q2 2024**: Mobile app development
- [ ] **Q3 2024**: Advanced analytics dashboard
- [ ] **Q4 2024**: Multi-tenant architecture
- [ ] **Q1 2025**: Machine learning model training
- [ ] **Q2 2025**: Advanced automation workflows

---

**Built with ❤️ for modern IT teams**

*Streamline your IT operations with intelligent automation and seamless user experience.*
