import api from './api';

const API_ROUTE = 'auth';

export const login = async (email, password) => {
   try {
       const response = await api.post(
           `/${API_ROUTE}/token`,
           new URLSearchParams({ username: email, password }),
           { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
       );
       return response.data;
   } catch (error) {
       console.error('Login error:', error);
       throw error;
   }
};

export const register = async (email, password) => {
    await api.post('/users', { email, password });
};
