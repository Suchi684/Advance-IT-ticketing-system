import api from './api';

export const getStats = () => api.get('/dashboard/stats');
export const getAgentWorkload = () => api.get('/dashboard/agent-workload');
export const getAgentPerformance = () => api.get('/dashboard/agent-performance');
export const getAgentPerformanceById = (agentId) => api.get(`/dashboard/agent-performance/${agentId}`);
export const getAgentContacts = (agentId) => api.get(`/dashboard/agent-performance/${agentId}/contacts`);
export const getMyPerformance = () => api.get('/dashboard/my-performance');
