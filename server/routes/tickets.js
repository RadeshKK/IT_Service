const express = require('express');
const Joi = require('joi');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { sendNotification } = require('../services/notificationService');

const router = express.Router();

// Validation schemas
const createTicketSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  category: Joi.string().max(100).optional()
});

const updateTicketSchema = Joi.object({
  title: Joi.string().min(5).max(255).optional(),
  description: Joi.string().min(10).optional(),
  status: Joi.string().valid('todo', 'in_progress', 'resolved', 'closed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  category: Joi.string().max(100).optional(),
  assigneeId: Joi.number().integer().positive().optional()
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).required(),
  isInternal: Joi.boolean().default(false)
});

// Get all tickets with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      assignee, 
      reporter, 
      category, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let query = `
      SELECT 
        t.*,
        r.first_name as reporter_first_name,
        r.last_name as reporter_last_name,
        r.email as reporter_email,
        a.first_name as assignee_first_name,
        a.last_name as assignee_last_name,
        a.email as assignee_email
      FROM tickets t
      LEFT JOIN users r ON t.reporter_id = r.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;

    // Apply filters
    if (status) {
      query += ` AND t.status = $${++paramCount}`;
      queryParams.push(status);
    }
    
    if (priority) {
      query += ` AND t.priority = $${++paramCount}`;
      queryParams.push(priority);
    }
    
    if (assignee) {
      query += ` AND t.assignee_id = $${++paramCount}`;
      queryParams.push(assignee);
    }
    
    if (reporter) {
      query += ` AND t.reporter_id = $${++paramCount}`;
      queryParams.push(reporter);
    }
    
    if (category) {
      query += ` AND t.category = $${++paramCount}`;
      queryParams.push(category);
    }

    if (search) {
      query += ` AND (t.title ILIKE $${++paramCount} OR t.description ILIKE $${++paramCount})`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add ordering and pagination
    query += ` ORDER BY t.created_at DESC`;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM tickets t WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (status) {
      countQuery += ` AND t.status = $${++countParamCount}`;
      countParams.push(status);
    }
    if (priority) {
      countQuery += ` AND t.priority = $${++countParamCount}`;
      countParams.push(priority);
    }
    if (assignee) {
      countQuery += ` AND t.assignee_id = $${++countParamCount}`;
      countParams.push(assignee);
    }
    if (reporter) {
      countQuery += ` AND t.reporter_id = $${++countParamCount}`;
      countParams.push(reporter);
    }
    if (category) {
      countQuery += ` AND t.category = $${++countParamCount}`;
      countParams.push(category);
    }
    if (search) {
      countQuery += ` AND (t.title ILIKE $${++countParamCount} OR t.description ILIKE $${++countParamCount})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalTickets = parseInt(countResult.rows[0].count);

    res.json({
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalTickets,
        pages: Math.ceil(totalTickets / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single ticket with comments
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Get ticket details
    const ticketResult = await pool.query(`
      SELECT 
        t.*,
        r.first_name as reporter_first_name,
        r.last_name as reporter_last_name,
        r.email as reporter_email,
        a.first_name as assignee_first_name,
        a.last_name as assignee_last_name,
        a.email as assignee_email
      FROM tickets t
      LEFT JOIN users r ON t.reporter_id = r.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE t.id = $1
    `, [ticketId]);

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Get comments
    const commentsResult = await pool.query(`
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = $1
      ORDER BY c.created_at ASC
    `, [ticketId]);

    // Get attachments
    const attachmentsResult = await pool.query(`
      SELECT 
        a.*,
        u.first_name as uploaded_by_first_name,
        u.last_name as uploaded_by_last_name
      FROM attachments a
      JOIN users u ON a.uploaded_by = u.id
      WHERE a.ticket_id = $1
      ORDER BY a.created_at ASC
    `, [ticketId]);

    res.json({
      ticket: ticketResult.rows[0],
      comments: commentsResult.rows,
      attachments: attachmentsResult.rows
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createTicketSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, priority, category } = value;

    const result = await pool.query(`
      INSERT INTO tickets (title, description, priority, category, reporter_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, description, priority, category, req.user.id]);

    const ticket = result.rows[0];

    // Send notification to agents
    await sendNotification({
      type: 'ticket_created',
      title: 'New Ticket Created',
      message: `New ticket #${ticket.id}: ${ticket.title}`,
      ticketId: ticket.id,
      targetRole: 'agent'
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update ticket
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { error, value } = updateTicketSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if ticket exists
    const existingTicket = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (existingTicket.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        if (key === 'assigneeId') {
          updateFields.push(`assignee_id = $${++paramCount}`);
        } else {
          updateFields.push(`${key} = $${++paramCount}`);
        }
        updateValues.push(value[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(ticketId);

    const query = `
      UPDATE tickets 
      SET ${updateFields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, updateValues);
    const updatedTicket = result.rows[0];

    // Send notifications for status changes
    if (value.status && value.status !== existingTicket.rows[0].status) {
      await sendNotification({
        type: 'status_changed',
        title: 'Ticket Status Updated',
        message: `Ticket #${ticketId} status changed to ${value.status}`,
        ticketId: ticketId,
        userId: updatedTicket.reporter_id
      });
    }

    res.json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add comment to ticket
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { error, value } = commentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { content, isInternal } = value;

    // Check if ticket exists
    const ticket = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (ticket.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const result = await pool.query(`
      INSERT INTO comments (ticket_id, user_id, content, is_internal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [ticketId, req.user.id, content, isInternal]);

    const comment = result.rows[0];

    // Send notification
    await sendNotification({
      type: 'comment_added',
      title: 'New Comment Added',
      message: `New comment added to ticket #${ticketId}`,
      ticketId: ticketId,
      userId: ticket.rows[0].reporter_id
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get ticket statistics
router.get('/stats/overview', authenticateToken, requireRole(['admin', 'agent']), async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tickets
      GROUP BY status
    `);

    const priorityStats = await pool.query(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM tickets
      GROUP BY priority
    `);

    const categoryStats = await pool.query(`
      SELECT 
        COALESCE(category, 'Uncategorized') as category,
        COUNT(*) as count
      FROM tickets
      GROUP BY category
    `);

    res.json({
      statusStats: stats.rows,
      priorityStats: priorityStats.rows,
      categoryStats: categoryStats.rows
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
