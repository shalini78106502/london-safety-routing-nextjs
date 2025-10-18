const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Find nearby buddies (protected route)
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { radius = 5000, limit = 20 } = req.query; // radius in meters

    // First get current user's location
    const userResult = await pool.query(`
      SELECT ST_X(location) as longitude, ST_Y(location) as latitude
      FROM users 
      WHERE id = $1 AND location IS NOT NULL
    `, [req.user.userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User location not found. Please update your profile with location.'
      });
    }

    const userLocation = userResult.rows[0];

    // Find nearby users (excluding current user)
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email,
        ST_X(location) as longitude,
        ST_Y(location) as latitude,
        ST_Distance(
          location::geography, 
          ST_SetSRID(ST_Point($2, $1), 4326)::geography
        ) as distance_meters
      FROM users 
      WHERE id != $3
        AND location IS NOT NULL
        AND ST_DWithin(
          location::geography, 
          ST_SetSRID(ST_Point($2, $1), 4326)::geography, 
          $4
        )
      ORDER BY distance_meters ASC
      LIMIT $5
    `, [
      userLocation.latitude, 
      userLocation.longitude, 
      req.user.userId, 
      radius, 
      limit
    ]);

    const buddies = result.rows.map(buddy => ({
      id: buddy.id,
      name: buddy.name,
      email: buddy.email,
      location: {
        latitude: buddy.latitude,
        longitude: buddy.longitude
      },
      distanceMeters: Math.round(buddy.distance_meters)
    }));

    res.json({
      success: true,
      data: {
        buddies,
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        radiusMeters: parseInt(radius),
        totalFound: buddies.length
      }
    });

  } catch (error) {
    console.error('Find nearby buddies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Find buddies near a specific location (protected route)
router.get('/near/:latitude/:longitude', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 5000, limit = 20 } = req.query; // radius in meters

    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email,
        ST_X(location) as longitude,
        ST_Y(location) as latitude,
        ST_Distance(
          location::geography, 
          ST_SetSRID(ST_Point($2, $1), 4326)::geography
        ) as distance_meters
      FROM users 
      WHERE id != $3
        AND location IS NOT NULL
        AND ST_DWithin(
          location::geography, 
          ST_SetSRID(ST_Point($2, $1), 4326)::geography, 
          $4
        )
      ORDER BY distance_meters ASC
      LIMIT $5
    `, [latitude, longitude, req.user.userId, radius, limit]);

    const buddies = result.rows.map(buddy => ({
      id: buddy.id,
      name: buddy.name,
      email: buddy.email,
      location: {
        latitude: buddy.latitude,
        longitude: buddy.longitude
      },
      distanceMeters: Math.round(buddy.distance_meters)
    }));

    res.json({
      success: true,
      data: {
        buddies,
        searchLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        radiusMeters: parseInt(radius),
        totalFound: buddies.length
      }
    });

  } catch (error) {
    console.error('Find buddies near location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users with location (for admin purposes - protected route)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email,
        ST_X(location) as longitude,
        ST_Y(location) as latitude,
        created_at
      FROM users 
      WHERE id != $1 AND location IS NOT NULL
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.userId, limit, offset]);

    const buddies = result.rows.map(buddy => ({
      id: buddy.id,
      name: buddy.name,
      email: buddy.email,
      location: {
        latitude: buddy.latitude,
        longitude: buddy.longitude
      },
      createdAt: buddy.created_at
    }));

    res.json({
      success: true,
      data: {
        buddies,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: buddies.length
        }
      }
    });

  } catch (error) {
    console.error('Get all buddies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;