import api from './api';

export const getStats = () => api.get('/dashboard/stats');

export const getAgentWorkload = () => api.get('/dashboard/agent-workload');
