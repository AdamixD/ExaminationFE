import api from './api';

const API_ROUTE = 'users';

export const getUser = async (token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/user`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user', error);
        throw error;
    }
};
