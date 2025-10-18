# London Safety Routing - Full Stack Application

A comprehensive safety-focused navigation and community platform for London travelers, built with Next.js, Node.js, PostgreSQL, and interactive maps.

## 🌟 Features

### Frontend (Next.js 14)
- **Modern UI/UX**: Responsive design with Tailwind CSS and glass morphism effects
- **Interactive Maps**: Leaflet.js integration showing routes, hazards, and buddy locations
- **User Authentication**: JWT-based authentication with protected routes
- **Real-time Data**: Dynamic loading of routes, hazards, and travel buddies
- **Responsive Design**: Mobile-first approach with modern styling

### Backend (Node.js/Express)
- **RESTful APIs**: Complete API endpoints for all features
- **Authentication System**: JWT tokens with secure password hashing
- **Spatial Queries**: PostGIS integration for location-based features
- **Database Management**: PostgreSQL with spatial indexing
- **Security**: CORS, Helmet, input validation, and rate limiting

### Database (PostgreSQL + PostGIS)
- **Users Table**: User profiles with location data
- **Routes Table**: Safe route recommendations with GeoJSON paths
- **Hazards Table**: Community-reported safety hazards
- **Spatial Indexing**: Optimized for distance-based queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- PostGIS extension

### 1. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
node scripts/initDatabase.js

# Start backend server
npm start
```

### 3. Database Configuration
```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Database connection details (add to backend/.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=london_safety_routing
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## 📁 Project Structure

```
london-safety-routing/
├── app/                          # Next.js app router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.jsx        # Login form with validation
│   │   └── signup/page.jsx       # Registration with geolocation
│   ├── suggested-routes/page.jsx # Route discovery with map
│   ├── hazard-reporting/page.jsx # Hazard reporting system
│   ├── find-buddy/page.jsx       # Travel buddy finder
│   ├── layout.jsx                # Root layout with providers
│   └── page.jsx                  # Homepage
├── components/                   # Reusable React components
│   ├── auth/
│   │   └── ProtectedRoute.jsx    # Authentication middleware
│   ├── Navbar.jsx                # Navigation with auth state
│   ├── Footer.jsx                # Site footer
│   └── Map.jsx                   # Leaflet map component
├── lib/
│   └── services.js               # API service layer
├── backend/                      # Express.js backend
│   ├── config/
│   │   └── database.js           # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── routes/                   # API endpoints
│   │   ├── auth.js               # User authentication
│   │   ├── routes.js             # Route management
│   │   ├── hazards.js            # Hazard reporting
│   │   └── buddies.js            # Buddy finding
│   ├── scripts/
│   │   └── initDatabase.js       # Database initialization
│   ├── server.js                 # Express server setup
│   └── package.json              # Backend dependencies
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/nearby` - Get nearby routes
- `POST /api/routes` - Create new route

### Hazards
- `GET /api/hazards` - Get all hazards
- `GET /api/hazards/nearby` - Get nearby hazards
- `POST /api/hazards` - Report new hazard

### Buddies
- `GET /api/buddies` - Get all available buddies
- `GET /api/buddies/nearby` - Get nearby buddies
- `POST /api/buddies/connect` - Connect with a buddy

## 🗺️ Map Integration

The application uses Leaflet.js for interactive maps with the following features:

- **Route Visualization**: Color-coded routes based on safety ratings
- **Hazard Markers**: Real-time hazard locations with severity indicators
- **Buddy Locations**: Available travel companions with distance info
- **User Location**: GPS-based location detection
- **Click Interactions**: Map clicking for hazard reporting

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Express-validator for API inputs
- **CORS Protection**: Configured for frontend domain
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: API request throttling

## 🎨 UI/UX Features

- **Glass Morphism**: Modern frosted glass effects
- **Responsive Design**: Mobile-first approach
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark/Light Themes**: Consistent color scheme

## 📱 Mobile Responsiveness

- Responsive navigation with mobile hamburger menu
- Touch-friendly map interactions
- Optimized forms for mobile input
- Collapsible sections for better mobile UX

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy to cloud platform
```

### Database (PostgreSQL Cloud)
- Use managed PostgreSQL service with PostGIS support
- Configure connection strings in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **Design System**: Built with Tailwind CSS

## 📞 Support

For support, email support@londonsafetyrouting.com or open an issue on GitHub.

---

Built with ❤️ for safer London travel experiences.