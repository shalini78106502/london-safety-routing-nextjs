# Enhanced Hazard Reporting API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Report New Hazard
**POST** `/hazards`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "type": "construction|accident|crime|flooding|poor_lighting|road_damage|pothole|unsafe_crossing|broken_glass|suspicious_activity|vandalism|other",
  "severity": "low|medium|high|critical",
  "description": "Detailed description (min 10 chars)",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "affectsTraffic": false,
  "weatherRelated": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hazard reported successfully",
  "data": {
    "hazard": {
      "id": 123,
      "description": "Large pothole causing traffic delays",
      "location": {
        "latitude": 51.5074,
        "longitude": -0.1278
      },
      "hazardType": "pothole",
      "severity": "high",
      "priorityLevel": 3,
      "affectsTraffic": true,
      "weatherRelated": false,
      "createdAt": "2025-10-30T15:30:00Z"
    }
  }
}
```

### 2. Get Recent Hazards
**GET** `/hazards/recent`

**Query Parameters:**
- `latitude` (required): User latitude
- `longitude` (required): User longitude  
- `radius` (optional): Search radius in meters (default: 10000)
- `limit` (optional): Max results (default: 10)
- `severity` (optional): Filter by severity
- `hazardType` (optional): Filter by hazard type

**Example:**
```
GET /hazards/recent?latitude=51.5074&longitude=-0.1278&radius=5000&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hazards": [
      {
        "id": 123,
        "description": "Major roadworks causing delays",
        "location": {
          "latitude": 51.5074,
          "longitude": -0.1278
        },
        "hazardType": "construction",
        "severity": "high",
        "priorityLevel": 4,
        "affectsTraffic": true,
        "weatherRelated": false,
        "isResolved": false,
        "reporterName": "John Doe",
        "createdAt": "2025-10-30T15:30:00Z",
        "hoursAgo": 2.5,
        "distanceMeters": 450
      }
    ],
    "searchLocation": {
      "latitude": 51.5074,
      "longitude": -0.1278
    },
    "radiusMeters": 5000,
    "totalFound": 15
  }
}
```

### 3. Real-time Hazard Stream (SSE)
**GET** `/hazards/stream`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `latitude` (required): User latitude for proximity alerts
- `longitude` (required): User longitude for proximity alerts
- `radius` (optional): Alert radius in meters (default: 5000)

**Example:**
```
GET /hazards/stream?latitude=51.5074&longitude=-0.1278&radius=5000
```

**Server-Sent Events Response:**
```
Content-Type: text/event-stream

data: {"type":"connected","message":"Real-time hazard alerts activated","timestamp":"2025-10-30T15:30:00Z"}

data: {"type":"new_hazard","hazard":{"id":124,"description":"Traffic accident blocking lane","hazardType":"accident","severity":"high","location":{"latitude":51.5080,"longitude":-0.1285}},"message":"🚗💥 🔴 New high risk accident reported nearby","distanceMeters":320,"timestamp":"2025-10-30T15:35:00Z"}
```

### 4. Get Hazards Near Location
**GET** `/hazards/near/:latitude/:longitude`

**Parameters:**
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate

**Query Parameters:**
- `radius` (optional): Search radius in meters (default: 2000)
- `limit` (optional): Max results (default: 20)

**Example:**
```
GET /hazards/near/51.5074/-0.1278?radius=1000&limit=10
```

### 5. Update Hazard Status
**PATCH** `/hazards/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "isResolved": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hazard status updated successfully",
  "data": {
    "hazard": {
      "id": 123,
      "description": "Large pothole on cycle path",
      "hazardType": "pothole",
      "severity": "medium",
      "isResolved": true,
      "updatedAt": "2025-10-30T16:00:00Z"
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "latitude",
      "message": "Valid latitude required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You can only update your own hazard reports"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Hazard not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Real-time Event Types

### Connection Events
- `connected`: Successfully connected to real-time stream
- `error`: Connection or data error

### Hazard Events
- `new_hazard`: New hazard reported within user's radius
- `hazard_resolved`: Hazard marked as resolved
- `hazard_updated`: Hazard information updated

## Database Schema

### Hazards Table
```sql
CREATE TABLE hazards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  description TEXT NOT NULL,
  location GEOMETRY(POINT, 4326) NOT NULL,
  hazard_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) DEFAULT 'medium',
  priority_level INTEGER DEFAULT 1,
  affects_traffic BOOLEAN DEFAULT FALSE,
  weather_related BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  incident_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Spatial Indexes
```sql
CREATE INDEX idx_hazards_location ON hazards USING GIST(location);
CREATE INDEX idx_hazards_priority ON hazards(priority_level DESC, created_at DESC);
CREATE INDEX idx_hazards_severity ON hazards(severity);
CREATE INDEX idx_hazards_resolved ON hazards(is_resolved, created_at DESC);
```

## Frontend Integration

### JavaScript Service Example
```javascript
import { hazardsService } from './services'

// Report a hazard
const reportHazard = async (hazardData) => {
  try {
    const response = await hazardsService.reportHazard(hazardData)
    console.log('Hazard reported:', response.data.hazard)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Connect to real-time stream
const eventSource = hazardsService.connectToHazardStream(
  latitude, 
  longitude,
  (data) => {
    if (data.type === 'new_hazard') {
      showHazardAlert(data)
    }
  },
  (error) => {
    console.error('Stream error:', error)
  }
)

// Clean up
eventSource.close()
```

## Testing with curl

### Report a hazard
```bash
curl -X POST http://localhost:5000/api/hazards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "pothole",
    "severity": "medium", 
    "description": "Large pothole causing vehicle damage",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "affectsTraffic": true
  }'
```

### Get recent hazards
```bash
curl "http://localhost:5000/api/hazards/recent?latitude=51.5074&longitude=-0.1278&radius=5000"
```

### Connect to real-time stream
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/hazards/stream?latitude=51.5074&longitude=-0.1278"
```