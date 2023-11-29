import axios from 'axios';

const API = axios.create({ baseURL : 'https://localhost:8000' })

// Executé à chaque requête
API.interceptors.request.use((req) => {
  if(localStorage.getItem('token')) {
    req.headers.Authorization = `${JSON.parse(localStorage.getItem('token')!)}`
  }
  return req;
});

export const login = (data: any) => API.post('/user/login', data);
export const register = (data: any) => API.post('/user/register', data);