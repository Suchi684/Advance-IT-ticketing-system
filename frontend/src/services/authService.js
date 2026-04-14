import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });

export const signup = (name, email, password) => api.post('/auth/signup', { name, email, password });

export const resetPassword = (email, newPassword) => api.post('/auth/reset-password', { email, newPassword });
