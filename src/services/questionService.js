import api from './api';

const API_ROUTE = 'questions';

export const getExamQuestions = async (token, exam_id) => {
    try {
        const response = await api.get(`/${API_ROUTE}/exam/${exam_id}`, {
            headers: { Authorization: `Bearer ${token}`},
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam questions', error);
        throw error;
    }
};

export const createQuestion = async (questionData, token) => {
    try {
        const response = await api.post(`/${API_ROUTE}`, questionData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating question', error);
        throw error;
    }
};

export const updateQuestion = async (questionId, questionData, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${questionId}`, questionData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating question', error);
        throw error;
    }
};

export const getQuestionById = async (questionId, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching question details', error);
        throw error;
    }
};

export const deleteQuestion = async (questionId, token) => {
    try {
        const response = await api.delete(`/${API_ROUTE}/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting question', error);
        throw error;
    }
};

