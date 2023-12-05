import axios from 'axios';

const API = axios.create({ baseURL : 'https://montpellier-game-fest-volunteers-api-vincentdub2.vercel.app/' })

// Executé à chaque requête
API.interceptors.request.use((req) => {
  if(localStorage.getItem('token')) {
    req.headers.Authorization = `${JSON.parse(localStorage.getItem('token')!)}`
  }
  return req;
});

export const login = (data: any) => API.post('/user/login', data);
export const register = (data: any) => API.post('/user/register', data);
export const getCurrentUser = () => API.get('/currentUser');