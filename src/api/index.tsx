import axios from 'axios';
import { User, registerUser } from '../types/User';
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
export const register = (data: registerUser) => API.post('/register', data);
export const getCurrentUser = () => API.get('/users/current');
export const createFestival = (data: Festival) => API.post('/festivals', data);



interface UserUpdateData {
    id: string; 
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    //file: string;
    // Ajoutez d'autres champs selon votre modèle d'utilisateur
}

export const modifyUser = async ({ id, ...data }: UserUpdateData) => {
    return API.put(`/users/${id}`, data);
};
