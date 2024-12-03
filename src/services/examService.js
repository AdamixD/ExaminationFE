import api from './api';
import { getUser } from './userService';

const API_ROUTE = 'course_realizations';

export const getExams = async (token) => {
    const response = await api.get(`/${API_ROUTE}/user`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const addExam = async (token, name, shortName) => {
    // Course table.
    const response = await api.post(`/courses`,
        { title: name, shortcut: shortName },
        // { headers: { Authorization: `Bearer ${token}` } }
    );

    const user = await getUser(token);
    console.log(user.id);
    // Intersection table
    await api.post(`/${API_ROUTE}`,
        // {headers: { Authorization: `Bearer ${token}` }},
        {semester: "24Z",
        lecturer_id: user.id,
        course_id: response.data.id},
    );
    return 0;
};
