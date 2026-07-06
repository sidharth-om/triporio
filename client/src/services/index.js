import api from './api';

export const authService = {
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const destinationService = {
  getAll: (params) => api.get('/destinations', { params }),
  getStats: () => api.get('/destinations/stats'),
  getById: (id) => api.get(`/destinations/${id}`),
  create: (data) => api.post('/destinations', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/destinations/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/destinations/${id}`),
  getReviews: (id) => api.get(`/destinations/${id}/reviews`),
  addReview: (id, data) => api.post(`/destinations/${id}/reviews`, data),
};

export const wishlistService = {
  get: () => api.get('/wishlist'),
  toggle: (destId) => api.post(`/wishlist/toggle/${destId}`),
};

export const tripService = {
  create: (data) => api.post('/trips', data),
  getMy: () => api.get('/trips/my'),
  getAll: () => api.get('/trips'),
  updateStatus: (id, data) => api.put(`/trips/${id}/status`, data),
};

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/events/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  seedData: () => api.post('/admin/seed'),
};
