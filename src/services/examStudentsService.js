import api from './api';

const API_ROUTE = 'exam_students';


export const updateExamStudent = async (examStudentId, examStudentData, token) => {
    try {
        const response = await api.put(`/${API_ROUTE}/${examStudentId}`, examStudentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating examStudent', error);
        throw error;
    }
};


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


export const getExamStudent = async (examId, studentId, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/ids/${examId}/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam details', error);
        throw error;
    }
};


export const getExamStudentByID = async (examStudentId, token) => {
    try {
        const response = await api.get(`/${API_ROUTE}/${examStudentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching exam details', error);
        throw error;
    }
};
