import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// On 401 (expired / invalid token) — clear session and redirect to login
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            ['token', 'userID', 'name', 'role'].forEach(k => localStorage.removeItem(k));
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
