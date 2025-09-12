const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT id, email, first_name, last_name, role, department, created_at
      FROM users
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (role) {
      query += ` AND role = $${++paramCount}`;
      queryParams.push(role);
    }
    
    if (department) {
      query += ` AND department = $${++paramCount}`;
      queryParams.push(department);
    }

    if (search) {
      query += ` AND (first_name ILIKE $${++paramCount} OR last_name ILIKE $${++paramCount} OR email ILIKE $${++paramCount})`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (role) {
      countQuery += ` AND role = $${++countParamCount}`;
      countParams.push(role);
    }
    if (department) {
      countQuery += ` AND department = $${++countParamCount}`;
      countParams.push(department);
    }
    if (search) {
      countQuery += ` AND (first_name ILIKE $${++countParamCount} OR last_name ILIKE $${++countParamCount} OR email ILIKE $${++countParamCount})`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalUsers = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalUsers,
        pages: Math.ceil(totalUsers / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get agents for assignment dropdown
router.get('/agents', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, email, department
      FROM users
      WHERE role IN ('agent', 'admin')
      ORDER BY first_name, last_name
    `);

    res.json({ agents: result.rows });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT id, email, first_name, last_name, role, department, created_at
      FROM users
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, department } = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const result = await pool.query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, department = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, first_name, last_name, role, department
    `, [firstName, lastName, department, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }

    const result = await pool.query(`
      UPDATE users 
      SET role = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, department
    `, [role, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Users can only view their own stats unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get tickets created by user
    const createdTickets = await pool.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE reporter_id = $1
    `, [userId]);

    // Get tickets assigned to user
    const assignedTickets = await pool.query(`
      SELECT COUNT(*) as count
      FROM tickets
      WHERE assignee_id = $1
    `, [userId]);

    // Get tickets by status for assigned tickets
    const assignedByStatus = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM tickets
      WHERE assignee_id = $1
      GROUP BY status
    `, [userId]);

    res.json({
      createdTickets: parseInt(createdTickets.rows[0].count),
      assignedTickets: parseInt(assignedTickets.rows[0].count),
      assignedByStatus: assignedByStatus.rows
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
