import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/app',
  headers: { 'Content-Type': 'application/json' },
});

export default api;


// export const fetchProtectedData = async (token, endpoint) => {
//   const response = await axios.get(`${API_URL}/${API_ROUTE}/${endpoint}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// };
