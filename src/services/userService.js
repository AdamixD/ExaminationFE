import api from './api';

const API_ROUTE = 'users';

export const getUser = async (token) => {
    const response = await api.get(`/${API_ROUTE}/me`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};
