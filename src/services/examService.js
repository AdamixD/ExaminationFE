import api from './api';

const API_ROUTE = 'exams';

export const getUserExams = async (token, course_realization_id) => {
    try {
        const response = await api.get(`/${API_ROUTE}/user`, {
            headers: { Authorization: `Bearer ${token}`},
            params: { course_realization_id },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user exams', error);
        throw error;
    }
};
