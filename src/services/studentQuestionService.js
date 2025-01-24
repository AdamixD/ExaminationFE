import api from './api';

const API_ROUTE = 'question_results';

export const createAnswer = async (answerData, token) => {
    try {
        const response = await api.post(`/${API_ROUTE}`, answerData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.id;
    } catch (error) {
        console.error('Error creating question result', error);
        throw error;
    }
};

export const updateAnswer = async (answerId, answerData, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${answerId}`, answerData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating question result', error);
        throw error;
    }
};

export const updateResult = async (question_result_id, data, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${question_result_id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating question result', error);
        throw error;
    }
};
