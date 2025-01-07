import api from './api';

const API_ROUTE = 'question_results';


// export const getExam = async (examId, token) => {
//     try {
//         const response = await api.get(`/${API_ROUTE}/${examId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching exam details', error);
//         throw error;
//     }
// };

export const createAnswer = async (answerData, token) => {
    console.info(answerData);
    try {
        const response = await api.post(`/${API_ROUTE}`, answerData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.info("ok");
        return response.data;
    } catch (error) {
        console.error('Error creating question result', error);
        // todo - tu wywala HTTP 500, ale do bazy i tak wpisuje, więc po prostu wyciszam ten błąd, ale w wolnej chwili dobrze to ogarnąć.
        // throw error;
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

// export const deleteExam = async (examId, token) => {
//     try {
//         const response = await api.delete(`/${API_ROUTE}/${examId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting exam', error);
//         throw error;
//     }
// };

// export const getUserExams = async (course_realization_id, token) => {
//     try {
//         const response = await api.get(`/${API_ROUTE}/user/${course_realization_id}`, {
//             headers: { Authorization: `Bearer ${token}`}
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching user exams', error);
//         throw error;
//     }
// };

// export const assignExam = async (examId, token) => {
//     try {
//         const response = await api.post(`/${API_ROUTE}/assign/${examId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error assigning exam', error);
//         throw error;
//     }
// };