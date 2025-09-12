const nodemailer = require('nodemailer');
const pool = require('../config/database');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send notification to database
const createNotification = async (notificationData) => {
  try {
    const { userId, ticketId, type, title, message } = notificationData;

    const result = await pool.query(`
      INSERT INTO notifications (user_id, ticket_id, type, title, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, ticketId, type, title, message]);

    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send notification to all users with specific role
const sendNotificationToRole = async (notificationData) => {
  try {
    const { targetRole, ticketId, type, title, message } = notificationData;

    // Get all users with the target role
    const users = await pool.query('SELECT id FROM users WHERE role = $1', [targetRole]);

    // Create notifications for each user
    const notifications = [];
    for (const user of users.rows) {
      const notification = await createNotification({
        userId: user.id,
        ticketId,
        type,
        title,
        message
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error sending notification to role:', error);
    throw error;
  }
};

// Send email notification
const sendEmailNotification = async (emailData) => {
  try {
    const { to, subject, html, text } = emailData;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Main notification function
const sendNotification = async (notificationData) => {
  try {
    const { type, title, message, ticketId, userId, targetRole } = notificationData;

    // Create database notification
    if (userId) {
      await createNotification({ userId, ticketId, type, title, message });
    } else if (targetRole) {
      await sendNotificationToRole({ targetRole, ticketId, type, title, message });
    }

    // Send email notification if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      let recipientEmail = null;

      if (userId) {
        const user = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
        recipientEmail = user.rows[0]?.email;
      } else if (targetRole) {
        // For role-based notifications, send to first admin user
        const admin = await pool.query('SELECT email FROM users WHERE role = $1 LIMIT 1', ['admin']);
        recipientEmail = admin.rows[0]?.email;
      }

      if (recipientEmail) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${title}</h2>
            <p>${message}</p>
            ${ticketId ? `<p><a href="${process.env.CLIENT_URL}/tickets/${ticketId}" style="color: #007bff;">View Ticket #${ticketId}</a></p>` : ''}
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated notification from Smart IT Service Tracker.</p>
          </div>
        `;

        await sendEmailNotification({
          to: recipientEmail,
          subject: title,
          html: emailHtml,
          text: message
        });
      }
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    // Don't throw error to prevent breaking the main flow
  }
};

module.exports = {
  sendNotification,
  createNotification,
  sendNotificationToRole,
  sendEmailNotification
};
