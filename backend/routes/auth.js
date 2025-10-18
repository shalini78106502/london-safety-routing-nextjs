const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Signup endpoint
router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, latitude, longitude } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create location point if coordinates provided
    let locationQuery = 'INSERT INTO users (name, email, password';
    let locationValues = [name, email, hashedPassword];
    let placeholders = '$1, $2, $3';

    if (latitude && longitude) {
      locationQuery += ', location';
      locationValues.push(`POINT(${longitude} ${latitude})`);
      placeholders += ', ST_GeomFromText($4, 4326)';
    }

    locationQuery += `) VALUES (${placeholders}) RETURNING id, name, email, created_at`;

    const result = await pool.query(locationQuery, locationValues);
    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone,
        address,
        emergency_contact,
        preferred_transport,
        safety_priority,
        notifications,
        ST_X(location) as longitude,
        ST_Y(location) as latitude,
        created_at, 
        updated_at 
      FROM users 
      WHERE id = $1
    `, [req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          emergency_contact: user.emergency_contact,
          preferred_transport: user.preferred_transport,
          safety_priority: user.safety_priority,
          notifications: user.notifications,
          location: user.longitude && user.latitude ? {
            longitude: user.longitude,
            latitude: user.latitude
          } : null,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('emergency_contact').optional().isMobilePhone().withMessage('Invalid emergency contact number'),
  body('preferred_transport').optional().isIn(['walking', 'cycling', 'driving']).withMessage('Invalid transport preference'),
  body('safety_priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid safety priority'),
  body('notifications').optional().isBoolean().withMessage('Notifications must be true or false'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, 
      phone, 
      address, 
      emergency_contact, 
      preferred_transport, 
      safety_priority, 
      notifications,
      latitude, 
      longitude 
    } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (emergency_contact !== undefined) {
      updates.push(`emergency_contact = $${paramCount}`);
      values.push(emergency_contact);
      paramCount++;
    }

    if (preferred_transport !== undefined) {
      updates.push(`preferred_transport = $${paramCount}`);
      values.push(preferred_transport);
      paramCount++;
    }

    if (safety_priority !== undefined) {
      updates.push(`safety_priority = $${paramCount}`);
      values.push(safety_priority);
      paramCount++;
    }

    if (notifications !== undefined) {
      updates.push(`notifications = $${paramCount}`);
      values.push(notifications);
      paramCount++;
    }

    if (latitude && longitude) {
      updates.push(`location = ST_GeomFromText($${paramCount}, 4326)`);
      values.push(`POINT(${longitude} ${latitude})`);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.user.userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, address, emergency_contact, preferred_transport, safety_priority, notifications, ST_X(location) as longitude, ST_Y(location) as latitude, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          emergency_contact: user.emergency_contact,
          preferred_transport: user.preferred_transport,
          safety_priority: user.safety_priority,
          notifications: user.notifications,
          location: user.longitude && user.latitude ? {
            longitude: user.longitude,
            latitude: user.latitude
          } : null,
          updated_at: user.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;