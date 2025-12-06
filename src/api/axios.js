import axios from 'axios';

// Yeh line sabse important — production mein Vercel pe chalega
const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'https://primaryorder.up.railway.app';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,        // ← Yeh add karo (CSRF cookie ke liye zaroori hai Railway pe)
});

// Request interceptor (token attach)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (token refresh)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 aur retry nahi kiya ho to refresh try karo
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_URL}/auth/refresh/`,   // ← hardcode nahi, dynamic URL
                        { refresh: refreshToken }
                    );

                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token expired or invalid", refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;