import api from './api';

export const getReplies = (ticketId) => api.get(`/tickets/${ticketId}/replies`);

export const sendReply = (ticketId, data) => api.post(`/tickets/${ticketId}/reply`, data);

export const forwardEmail = (ticketId, data) => api.post(`/tickets/${ticketId}/forward`, data);

export const forwardAll = (ticketId, data) => api.post(`/tickets/${ticketId}/forward-all`, data);
