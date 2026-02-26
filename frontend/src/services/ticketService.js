import api from './api';

export const getTickets = (params) => api.get('/tickets', { params });

export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const assignTicket = (id, agentId) => api.put(`/tickets/${id}/assign`, { agentId });

export const updateStatus = (id, status) => api.put(`/tickets/${id}/status`, { status });

export const updatePriority = (id, priority) => api.put(`/tickets/${id}/priority`, { priority });

export const updateCategory = (id, category) => api.put(`/tickets/${id}/category`, { category });
