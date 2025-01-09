import api from './api';

const API_ROUTE = 'exam_students';


export const getExamStudents = async (examId, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/exam/all/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam details', error);
        throw error;
    }
};