import axios from 'axios';
import { User } from '../types/User';
import { Festival } from '../types/Festival';

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
export const getCurrentUser = () => API.get('/users/current');
export const createFestival = (data: any) => API.post('/festivals', data);
export const getPosteById = (idPoste: string) => API.get(`/postes/${idPoste}`);
export const getFestivalById = (id: string) => API.get(`/festivals/${id}`);
export const getPostesByFestival = (id: string) => API.get(`/festivals/${id}/postes`);
export const getCreneauxByFestival = (id: string) => API.get(`/festivals/${id}/creneaux`);
export const getVolunteersByFestival = (id: string) => API.get(`/festivals/${id}/volunteers`);
export const getFestivals = () => API.get('/festivals');
export const getCreneauxByUserAndFestival = (idUser: string, idFestival: string) => API.get(`/creneaux/user/${idUser}/festival/${idFestival}`);