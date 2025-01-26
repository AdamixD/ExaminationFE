import api from './api';

const API_ROUTE = 'exams';


export const getExam = async (examId, token) => {
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

export const deleteExam = async (examId, token) => {
    try {
        const response = await api.delete(`/${API_ROUTE}/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting exam', error);
        throw error;
    }
};

export const getUserExams = async (course_realization_id, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/user/${course_realization_id}`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user exams', error);
        throw error;
    }
};

export const assignExam = async (examId, token) => {
    try {
        const response = await api.post(`/${API_ROUTE}/assign/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error assigning exam', error);
        throw error;
    }
};

export const unassignExam = async (examId, token) => {
    try {
        const response = await api.post(`/${API_ROUTE}/unassign/${examId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error unassigning exam', error);
    }
}