const request = require('supertest');
const app = require('../index');
const pool = require('../config/database');

describe('Tickets API', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@company.com',
        password: 'admin123'
      });
    
    authToken = response.body.token;
    testUserId = response.body.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM tickets WHERE title LIKE $1', ['Test Ticket%']);
    await pool.end();
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const ticketData = {
        title: 'Test Ticket - Network Issue',
        description: 'Unable to connect to the internet from my workstation',
        priority: 'high',
        category: 'Network'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData)
        .expect(201);

      expect(response.body.message).toBe('Ticket created successfully');
      expect(response.body.ticket.title).toBe(ticketData.title);
      expect(response.body.ticket.priority).toBe(ticketData.priority);
      expect(response.body.ticket.reporter_id).toBe(testUserId);
    });

    it('should require authentication', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'Test description'
      };

      await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const ticketData = {
        title: 'Test'
      };

      await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData)
        .expect(400);
    });
  });

  describe('GET /api/tickets', () => {
    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tickets).toBeDefined();
      expect(Array.isArray(response.body.tickets)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter tickets by status', async () => {
      const response = await request(app)
        .get('/api/tickets?status=todo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tickets).toBeDefined();
      response.body.tickets.forEach(ticket => {
        expect(ticket.status).toBe('todo');
      });
    });
  });

  describe('GET /api/tickets/:id', () => {
    let testTicketId;

    beforeAll(async () => {
      // Create a test ticket
      const ticketData = {
        title: 'Test Ticket for Detail',
        description: 'Test description for detail view',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData);

      testTicketId = response.body.ticket.id;
    });

    it('should get a specific ticket', async () => {
      const response = await request(app)
        .get(`/api/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ticket).toBeDefined();
      expect(response.body.ticket.id).toBe(testTicketId);
      expect(response.body.comments).toBeDefined();
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it('should return 404 for non-existent ticket', async () => {
      await request(app)
        .get('/api/tickets/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/tickets/:id', () => {
    let testTicketId;

    beforeAll(async () => {
      // Create a test ticket
      const ticketData = {
        title: 'Test Ticket for Update',
        description: 'Test description for update',
        priority: 'low'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData);

      testTicketId = response.body.ticket.id;
    });

    it('should update a ticket', async () => {
      const updateData = {
        status: 'in_progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Ticket updated successfully');
      expect(response.body.ticket.status).toBe('in_progress');
      expect(response.body.ticket.priority).toBe('high');
    });
  });

  describe('POST /api/tickets/:id/comments', () => {
    let testTicketId;

    beforeAll(async () => {
      // Create a test ticket
      const ticketData = {
        title: 'Test Ticket for Comments',
        description: 'Test description for comments',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData);

      testTicketId = response.body.ticket.id;
    });

    it('should add a comment to a ticket', async () => {
      const commentData = {
        content: 'This is a test comment'
      };

      const response = await request(app)
        .post(`/api/tickets/${testTicketId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body.message).toBe('Comment added successfully');
      expect(response.body.comment.content).toBe(commentData.content);
    });
  });
});
