import api from './api';

const API_ROUTE = 'question_items';


export const createQuestionItem = async (questionItemData, token) => {
    console.log(questionItemData);
    try {
        const response = await api.post(`/${API_ROUTE}`, questionItemData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating question item', error);
        throw error;
    }
};

export const updateQuestionItem = async (questionItemId, questionItemData, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${questionItemId}`, questionItemData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating question item', error);
        throw error;
    }
};

export const deleteQuestionItem = async (questionItemId, token) => {
    try {
        const response = await api.delete(`/${API_ROUTE}/${questionItemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting question item', error);
        throw error;
    }
};
