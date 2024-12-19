import api from './api';
// import { getUser } from './userService';

const API_ROUTE = 'exams';

export const getExams = async (token, id) => {
    const response = await api.get(`/${API_ROUTE}/all/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const addExam = async (token, startDate, endDate, duration, randomization, course_id) => {
    // Course table.
    const response = await api.post(`${API_ROUTE}/`,
        { start_date:startDate, end_date: endDate, duration_limit: duration, status: String(randomization), course_realization_id: course_id },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
};
