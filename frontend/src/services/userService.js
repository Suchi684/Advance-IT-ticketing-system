import api from './api';

export const getAgents = () => api.get('/users/agents');

export const getCurrentUser = () => api.get('/users/me');
