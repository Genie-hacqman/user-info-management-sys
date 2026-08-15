import api from './api';
export const userService = {
  getCurrentUser: async () => api.get('/users/me'),
  updateProfile: async payload => api.put('/users/me', payload),
  changePassword: async payload => api.put('/users/me/password', payload),
  getUsers: async () => api.get('/users'),
  getAllUsers: async () => api.get('/users'),
  getUserById: async id => api.get(`/users/${id}`),
  createUser: async payload => api.post('/users', payload),
  updateUser: async (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: async id => api.delete(`/users/${id}`)
};
export default userService;
