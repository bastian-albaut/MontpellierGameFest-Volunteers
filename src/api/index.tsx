import axios from 'axios';
import { User } from '../types/User';
import { Festival } from '../types/Festival';
import { Poste } from '../types/Poste';
import { Creneau } from '../types/Creneau';

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
export const createFestival = (data: Festival) => API.post('/festivals', data);
export const addMultiplePostes = (postes: Poste[]) => API.post('/postes/multiple', postes);
export const addCreneau = (data: Creneau) => API.post('/creneaux', data);
