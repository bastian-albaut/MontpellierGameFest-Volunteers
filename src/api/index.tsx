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
export const getCurrentUser = () => API.get('/users/current');

// a tester
export const getIdFestival = (id: string) => API.get(`/festivals/${id}`);
export const getFestivals = () => API.get('/festivals');
export const getSoirees = () => API.get('/soirees');

// a rajouter
export const getVolunteerFestivals = (idUser: string) => API.get(`/volunteers/${idUser}/festivals`);

//faire implementer a vincent
/*
app.get('/api/volunteers/:idUser/festivals', async (req, res) => {
    const idUser = req.params.idUser;
    // Logique pour récupérer les festivals de l'utilisateur
    // ...
    res.json(userFestivals);
});
*/



