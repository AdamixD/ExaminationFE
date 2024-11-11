import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/app';
const API_ROUTE = 'auth';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/${API_ROUTE}/token`, new URLSearchParams({
    username,
    password
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const fetchProtectedData = async (token, endpoint) => {
  const response = await axios.get(`${API_URL}/${API_ROUTE}/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
