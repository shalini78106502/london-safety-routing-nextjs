import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  // Sign up
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.success && response.data.data.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 1 }); // 1 day
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Log in
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 1 }); // 1 day
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Log out
  logout() {
    Cookies.remove('auth_token');
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!Cookies.get('auth_token');
  },

  // Get auth token
  getToken() {
    return Cookies.get('auth_token');
  }
};

export const routesService = {
  // Get all routes
  async getRoutes(params = {}) {
    try {
      const response = await api.get('/routes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get single route
  async getRoute(id) {
    try {
      const response = await api.get(`/routes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get routes near location
  async getNearbyRoutes(latitude, longitude, params = {}) {
    try {
      const response = await api.get(`/routes/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Find routes between two points
  async findRoutes(fromLat, fromLon, toLat, toLon, mode = 'walking') {
    try {
      const response = await api.post('/routes/find', {
        fromLat,
        fromLon,
        toLat,
        toLon,
        mode
      });
      return response.data;
    } catch (error) {
      console.error('Route finding error:', error);
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};

export const hazardsService = {
  // Report hazard
  async reportHazard(hazardData) {
    try {
      const response = await api.post('/hazards', hazardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get all hazards
  async getHazards(params = {}) {
    try {
      const response = await api.get('/hazards', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get recent hazards (optimized for initial load)
  async getRecentHazards(latitude, longitude, params = {}) {
    try {
      const queryParams = {
        latitude,
        longitude,
        radius: params.radius || 10000,
        limit: params.limit || 20,
        ...params
      };
      const response = await api.get('/hazards/recent', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get hazards near location
  async getNearbyHazards(latitude, longitude, params = {}) {
    try {
      const response = await api.get(`/hazards/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Update hazard status
  async updateHazard(id, updateData) {
    try {
      const response = await api.patch(`/hazards/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Connect to real-time hazard stream
  connectToHazardStream(latitude, longitude, onMessage, onError) {
    const token = authService.getToken();
    if (!token) {
      onError('Authentication required');
      return null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: '5000', // 5km radius
      token: token // Include token in URL since EventSource doesn't support headers
    });
    
    const eventSource = new EventSource(`${baseUrl}/api/hazards/stream?${params}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        onError('Data parsing error');
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError('Connection error');
    };

    return eventSource;
  }
};

export const buddiesService = {
  // Find nearby buddies
  async getNearbyBuddies(params = {}) {
    try {
      const response = await api.get('/buddies/nearby', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Find buddies near specific location
  async getBuddiesNearLocation(latitude, longitude, params = {}) {
    try {
      const response = await api.get(`/buddies/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get all buddies
  async getAllBuddies(params = {}) {
    try {
      const response = await api.get('/buddies/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};