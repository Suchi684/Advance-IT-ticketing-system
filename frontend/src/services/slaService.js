import api from './api';

export const getSlaPolices = () => api.get('/sla');
export const updateSlaPolicy = (id, data) => api.put(`/sla/${id}`, data);
