import api from './api';
// import { getUser } from './userService';

const API_ROUTE = 'course_realizations';

export const getUserCourses = async (token) => {
    const response = await api.get(`/${API_ROUTE}/user`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};
