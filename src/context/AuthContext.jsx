import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const userRes = await api.get('/auth/me/');
                    setUser(userRes.data);
                    toast.success(`Welcome back, ${userRes.data.name}!`, {
                        position: "top-right",
                        autoClose: 3000,
                        theme: "colored",
                    });
                } catch (e) {
                    console.error('Auth initialization error:', e);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                    setAuthError('Session expired. Please login again.');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setAuthError(null);
        try {
            const res = await api.post('/auth/login/', { email, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            
            const userRes = await api.get('/auth/me/');
            setUser(userRes.data);
            
            toast.success(`Welcome, ${userRes.data.name}!`, {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            setAuthError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setAuthError(null);
        try {
            await api.post('/auth/register/', userData);
            toast.success('Registration successful! Please login.', {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
            setAuthError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        toast.info('You have been logged out.', {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
        });
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            loading, 
            authError,
            clearError: () => setAuthError(null)
        }}>
            {children}
        </AuthContext.Provider>
    );
};