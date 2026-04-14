import api from './api';

export const getTickets = (params) => api.get('/tickets', { params });

export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const assignTicket = (id, agentId) => api.put(`/tickets/${id}/assign`, { agentId });

export const updateStatus = (id, status) => api.put(`/tickets/${id}/status`, { status });

export const updatePriority = (id, priority) => api.put(`/tickets/${id}/priority`, { priority });

export const updateCategory = (id, category) => api.put(`/tickets/${id}/category`, { category });

export const updateDeadline = (id, deadline) => api.put(`/tickets/${id}/deadline`, { deadline });

export const getAssignedTickets = (params) => api.get('/tickets/assigned', { params });

export const addNote = (ticketId, body) => api.post(`/tickets/${ticketId}/note`, { body });
export const updateTicketTags = (id, tags) => api.put(`/tickets/${id}/tags`, { tags });
export const bulkUpdateStatus = (ticketIds, status) => api.put('/tickets/bulk/status', { ticketIds, status });
export const bulkAssign = (ticketIds, agentId) => api.put('/tickets/bulk/assign', { ticketIds, agentId });
export const getActivityLog = (ticketId) => api.get(`/tickets/${ticketId}/activity`);
export const submitCsat = (id, rating, comment) => api.put(`/tickets/${id}/csat`, { rating, comment });
