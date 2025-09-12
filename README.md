# Smart IT Service Request & Issue Tracking System

A modern, AI-powered IT service management platform built with React, Node.js, and PostgreSQL. This system provides a comprehensive solution for managing IT support tickets with intelligent categorization, Kanban workflow management, and automated notifications.

## 🚀 Features

### Phase 1: Core MVP
- **Service Request Portal**: Clean web form for submitting IT issues
- **Agile Kanban Board**: Drag-and-drop ticket management with visual workflow
- **Basic Notification System**: Automated email notifications for ticket updates
- **Foundational Database Schema**: Robust data structure for users, tickets, and comments

### Phase 2: AI & Integration (Planned)
- **AI Auto-Categorization**: ML/NLP-powered ticket classification
- **Slack/Teams Bot**: Conversational ticket creation
- **AI Solution Suggestions**: Knowledge base integration for faster resolution

### Phase 3: Proactive Operations (Planned)
- **Monitoring Integration**: Connect with Datadog, Grafana, Zabbix
- **Predictive Issue Creation**: Automated ticket generation from monitoring alerts
- **Automated Remediation**: Script-based automated fixes

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Nodemailer** for email notifications
- **OpenAI API** for AI features
- **Joi** for validation
- **Winston** for logging

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Beautiful DnD** for drag-and-drop
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-it-service-tracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE smart_it_tracker;
CREATE USER smart_it_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE smart_it_tracker TO smart_it_user;
```

#### Run Database Migration
```bash
cd server
npm run migrate
```

This will create all necessary tables and seed initial data including:
- Admin user: `admin@company.com` / `admin123`
- Sample users: `john.doe@company.com` / `password123`

### 4. Environment Configuration

#### Server Environment
Create `server/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_it_tracker
DB_USER=smart_it_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### Client Environment
Create `client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# From root directory
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

#### Manual Start
```bash
# Terminal 1 - Start Server
cd server
npm run dev

# Terminal 2 - Start Client
cd client
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔐 Default Login Credentials

- **Admin**: `admin@company.com` / `admin123`
- **User**: `john.doe@company.com` / `password123`
- **Agent**: `agent1@company.com` / `password123`

## 📱 Usage Guide

### For End Users
1. **Create Account**: Register with your email and department
2. **Submit Tickets**: Use the "Create Ticket" form to report IT issues
3. **Track Progress**: View your tickets and their status updates
4. **Receive Notifications**: Get email updates when tickets are updated

### For IT Agents
1. **Kanban Board**: Drag tickets between columns to update status
2. **Ticket Management**: Assign tickets, add comments, update priority
3. **AI Assistance**: Use AI suggestions for categorization and solutions
4. **Dashboard**: Monitor ticket statistics and workload

### For Administrators
1. **User Management**: Manage user roles and permissions
2. **System Configuration**: Configure notifications and AI settings
3. **Analytics**: View comprehensive ticket statistics and reports

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Test Coverage
The application includes comprehensive tests for:
- API endpoints
- Authentication flows
- Ticket management
- User operations
- AI categorization

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Start production server
cd ../server
NODE_ENV=production npm start
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables for Production
Ensure all production environment variables are properly configured:
- Database connection strings
- JWT secrets
- Email service credentials
- AI API keys
- File storage configuration

## 🔧 Configuration

### Email Notifications
Configure SMTP settings in `server/.env`:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

### AI Features
Add OpenAI API key for AI categorization:
```env
OPENAI_API_KEY=your-openai-api-key
```

### File Uploads
Configure file upload settings:
```env
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and roles
- **tickets**: Support tickets with status and priority
- **comments**: Ticket comments and updates
- **attachments**: File attachments for tickets
- **notifications**: User notifications

### Key Relationships
- Users can create and be assigned tickets
- Tickets can have multiple comments
- Comments belong to users and tickets
- Notifications are linked to users and tickets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints at `/api/health`

## 🔮 Roadmap

### Phase 2 Features (Next)
- [ ] AI-powered ticket categorization
- [ ] Slack/Teams bot integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 Features (Future)
- [ ] Monitoring tool integrations
- [ ] Predictive issue detection
- [ ] Automated remediation workflows
- [ ] Advanced reporting and analytics

---

**Built with ❤️ for modern IT teams**
