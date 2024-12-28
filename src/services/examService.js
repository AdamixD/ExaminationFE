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

export const createExam = async (examData, token) => {
    try {
        const response = await api.post(`/${API_ROUTE}`, examData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exam', error);
        throw error;
    }
};

export const updateExam = async (examId, examData, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${examId}`, examData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating exam', error);
        throw error;
    }
};

export const getExamById = async (examId, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam details', error);
        throw error;
    }
};
