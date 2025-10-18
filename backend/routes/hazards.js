const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Report a new hazard (protected route)
router.post('/', authenticateToken, [
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('hazardType').isIn(['construction', 'accident', 'crime', 'flooding', 'poor_lighting', 'other']).withMessage('Invalid hazard type'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level')
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

    const { description, latitude, longitude, hazardType, severity = 'medium' } = req.body;

    const result = await pool.query(`
      INSERT INTO hazards (user_id, description, location, hazard_type, severity)
      VALUES ($1, $2, ST_SetSRID(ST_Point($4, $3), 4326), $5, $6)
      RETURNING id, description, hazard_type, severity, created_at
    `, [req.user.userId, description, latitude, longitude, hazardType, severity]);

    const hazard = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Hazard reported successfully',
      data: {
        hazard: {
          id: hazard.id,
          description: hazard.description,
          location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          },
          hazardType: hazard.hazard_type,
          severity: hazard.severity,
          createdAt: hazard.created_at
        }
      }
    });

  } catch (error) {
    console.error('Report hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all hazards with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      hazardType, 
      severity, 
      resolved,
      limit = 50, 
      offset = 0 
    } = req.query;
    
    let query = `
      SELECT 
        h.id, 
        h.description, 
        h.hazard_type, 
        h.severity, 
        h.is_resolved,
        ST_X(h.location) as longitude,
        ST_Y(h.location) as latitude,
        h.created_at,
        u.name as reporter_name
      FROM hazards h
      LEFT JOIN users u ON h.user_id = u.id
    `;
    
    const params = [];
    const conditions = [];

    if (hazardType) {
      conditions.push(`h.hazard_type = $${params.length + 1}`);
      params.push(hazardType);
    }

    if (severity) {
      conditions.push(`h.severity = $${params.length + 1}`);
      params.push(severity);
    }

    if (resolved !== undefined) {
      conditions.push(`h.is_resolved = $${params.length + 1}`);
      params.push(resolved === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY h.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    const hazards = result.rows.map(hazard => ({
      id: hazard.id,
      description: hazard.description,
      location: {
        latitude: hazard.latitude,
        longitude: hazard.longitude
      },
      hazardType: hazard.hazard_type,
      severity: hazard.severity,
      isResolved: hazard.is_resolved,
      reporterName: hazard.reporter_name,
      createdAt: hazard.created_at
    }));

    res.json({
      success: true,
      data: {
        hazards,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: hazards.length
        }
      }
    });

  } catch (error) {
    console.error('Get hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get hazards near a location
router.get('/near/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 2000, limit = 20 } = req.query; // radius in meters

    const result = await pool.query(`
      SELECT 
        h.id, 
        h.description, 
        h.hazard_type, 
        h.severity, 
        h.is_resolved,
        ST_X(h.location) as longitude,
        ST_Y(h.location) as latitude,
        h.created_at,
        u.name as reporter_name,
        ST_Distance(
          h.location::geography, 
          ST_SetSRID(ST_Point($2, $1), 4326)::geography
        ) as distance_meters
      FROM hazards h
      LEFT JOIN users u ON h.user_id = u.id
      WHERE ST_DWithin(
        h.location::geography, 
        ST_SetSRID(ST_Point($2, $1), 4326)::geography, 
        $3
      )
      AND h.is_resolved = false
      ORDER BY distance_meters ASC, h.created_at DESC
      LIMIT $4
    `, [latitude, longitude, radius, limit]);

    const hazards = result.rows.map(hazard => ({
      id: hazard.id,
      description: hazard.description,
      location: {
        latitude: hazard.latitude,
        longitude: hazard.longitude
      },
      hazardType: hazard.hazard_type,
      severity: hazard.severity,
      isResolved: hazard.is_resolved,
      reporterName: hazard.reporter_name,
      createdAt: hazard.created_at,
      distanceMeters: Math.round(hazard.distance_meters)
    }));

    res.json({
      success: true,
      data: {
        hazards,
        searchLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        radiusMeters: parseInt(radius)
      }
    });

  } catch (error) {
    console.error('Get nearby hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update hazard status (protected route)
router.patch('/:id', authenticateToken, [
  body('isResolved').optional().isBoolean().withMessage('isResolved must be a boolean')
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

    const { id } = req.params;
    const { isResolved } = req.body;

    // Check if hazard exists and belongs to user
    const checkResult = await pool.query(
      'SELECT user_id FROM hazards WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    if (checkResult.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own hazard reports'
      });
    }

    const result = await pool.query(`
      UPDATE hazards 
      SET is_resolved = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, description, hazard_type, severity, is_resolved, updated_at
    `, [isResolved, id]);

    const hazard = result.rows[0];

    res.json({
      success: true,
      message: 'Hazard status updated successfully',
      data: {
        hazard: {
          id: hazard.id,
          description: hazard.description,
          hazardType: hazard.hazard_type,
          severity: hazard.severity,
          isResolved: hazard.is_resolved,
          updatedAt: hazard.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Update hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;