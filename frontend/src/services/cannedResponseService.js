import api from './api';

export const getCannedResponses = (category) => api.get('/canned-responses', { params: category ? { category } : {} });
export const createCannedResponse = (data) => api.post('/canned-responses', data);
export const updateCannedResponse = (id, data) => api.put(`/canned-responses/${id}`, data);
export const deleteCannedResponse = (id) => api.delete(`/canned-responses/${id}`);
