import axios from 'axios';
import { User } from '../types/User';

const API = axios.create({ baseURL : 'https://montpellier-game-fest-volunteers-api-vincentdub2.vercel.app/' })

// Send the token at each request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if(token) {
        req.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return req;
})

export const login = (data: any) => API.post('/login', data);
export const register = (data: User) => API.post('/register', data);
export const getCurrentUser = () => API.get('/currentUser');
export const getFestivals = () => API.get('/festivals');