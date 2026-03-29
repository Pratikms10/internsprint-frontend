import api from './axios';

export const registerAPI = (data) => api.post('/api/auth/register', data);
export const loginAPI = (data) => api.post('/api/auth/login', data);
