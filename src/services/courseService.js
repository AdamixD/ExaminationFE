import api from './api';

const API_ROUTE = 'course_realizations';


export const getUserCourses = async (token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/user`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user courses', error);
        throw error;
    }
};
