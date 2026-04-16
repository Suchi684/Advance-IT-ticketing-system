import api from './api';

export const getContacts = (params) => api.get('/contacts', { params });
export const getContactsWithSummary = (params) => api.get('/contacts/summary', { params });
export const getContactById = (id) => api.get(`/contacts/${id}`);
export const getContactCategories = (id) => api.get(`/contacts/${id}/categories`);
export const getContactTickets = (id, params) => api.get(`/contacts/${id}/tickets`, { params });
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
