import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
  searchUsers: (params: any) => api.get('/users/search', { params }),
  getMapUsers: (params?: any) => api.get('/users/map', { params }),
  getUserById: (id: string) => api.get(`/users/${id}`),
};

// Forum API calls
export const forumAPI = {
  getPosts: (params?: any) => api.get('/forum/posts', { params }),
  createPost: (data: any) => api.post('/forum/posts', data),
  getPost: (id: string) => api.get(`/forum/posts/${id}`),
  updatePost: (id: string, data: any) => api.put(`/forum/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/forum/posts/${id}`),
  addComment: (postId: string, data: any) => api.post(`/forum/posts/${postId}/comments`, data),
  votePost: (postId: string, vote: 'up' | 'down') => api.post(`/forum/posts/${postId}/vote`, { vote }),
};

// Resource API calls
export const resourceAPI = {
  getResources: (params?: any) => api.get('/resources', { params }),
  createResource: (data: any) => api.post('/resources', data),
  getResource: (id: string) => api.get(`/resources/${id}`),
  rateResource: (id: string, rating: number) => api.post(`/resources/${id}/rate`, { rating }),
};

// Connection API calls
export const connectionAPI = {
  getConnections: () => api.get('/connections'),
  sendRequest: (recipientId: string, message?: string) =>
    api.post('/connections/request', { recipientId, message }),
  respondToRequest: (connectionId: string, status: 'accepted' | 'declined') =>
    api.put(`/connections/${connectionId}`, { status }),
  getRequests: () => api.get('/connections/requests'),
};

export default api;