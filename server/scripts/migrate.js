const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agent')),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tickets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'resolved', 'closed')),
        priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        category VARCHAR(100),
        reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        ai_suggested_category VARCHAR(100),
        ai_suggested_priority VARCHAR(50)
      )
    `);

    // Create comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tickets_reporter ON tickets(reporter_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_comments_ticket ON comments(ticket_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)');

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@company.com']);
    
    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, department)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['admin@company.com', hashedPassword, 'Admin', 'User', 'admin', 'IT']);
      
      console.log('Admin user created: admin@company.com / admin123');
    }

    // Create sample users
    const sampleUsers = [
      { email: 'john.doe@company.com', first_name: 'John', last_name: 'Doe', department: 'Engineering' },
      { email: 'jane.smith@company.com', first_name: 'Jane', last_name: 'Smith', department: 'Marketing' },
      { email: 'agent1@company.com', first_name: 'Agent', last_name: 'One', role: 'agent', department: 'IT' }
    ];

    for (const user of sampleUsers) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);
      if (exists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await pool.query(`
          INSERT INTO users (email, password_hash, first_name, last_name, role, department)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [user.email, hashedPassword, user.first_name, user.last_name, user.role || 'user', user.department]);
      }
    }

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

const runMigration = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runMigration();
}

module.exports = { createTables, seedData };
