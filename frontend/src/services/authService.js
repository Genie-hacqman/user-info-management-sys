import api from './api';
export const authService = {
  register: async payload => api.post('/auth/register', payload),
  login: async credentials => api.post('/auth/login', credentials),
  logout: async () => api.post('/auth/logout'),
  forgotPassword: async email => api.post('/auth/forgot-password', {
    email
  }),
  resetPassword: async (token, password) => api.post(`/auth/reset-password/${token}`, {
    password
  })
};
export default authService;
