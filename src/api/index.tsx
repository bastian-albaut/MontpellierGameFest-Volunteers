import axios from 'axios';
import { User } from '../types/User';
import { Festival } from '../types/Festival';
import { Poste } from '../types/Poste';
import { Creneau } from '../types/Creneau';
import { isVolunteer } from '../types/IsVolunteer';

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
export const getUserById = (id: string) => API.get('/users/' + id);
export const addMultiplePostes = (postes: Poste[]) => API.post('/postes/multiple', postes);
export const addMultipleCreneau = (creneaux: Creneau[]) => API.post('/creneaux/multiple', creneaux);
export const getFestival = (id: string) => API.get('/festivals/' + id);
export const addVolunteer = (data: isVolunteer) => API.post('/festivals/' + data.idFestival + '/volunteers', data);
export const createFestival = (data: any) => API.post('/festivals', data);
export const getPosteById = (idPoste: string) => API.get(`/postes/${idPoste}`);
export const getFestivalById = (id: string) => API.get(`/festivals/${id}`);
export const getPostesByFestival = (id: string) => API.get(`/festivals/${id}/postes`);
export const getCreneauxByFestival = (id: string) => API.get(`/festivals/${id}/creneaux`);
export const getVolunteersByFestival = (id: string) => API.get(`/festivals/${id}/volunteers`);
export const getFestivals = () => API.get('/festivals');
export const addEspace = (data: any) => API.post('/espaces', data);
export const addPosteEspace = (data: any) => API.post('/posteEspaces', data);
export const deleteFestival = (id: string) => API.delete('/festivals/' + id);
export const addCreneauEspace = (data: any) => API.post('/creneauEspaces', data);
export const updateCreneauEspace = (id: string, data: any) => API.put('/creneauEspaces/' + id, data);
export const getCreneauEspaceByCreneau = (id: string) => API.get(`/creneauEspaces/creneau/${id}`);
export const addInscription = (data: any) => API.post('/inscriptions', data);
export const getEspacesByPoste = (idPoste: string) => API.get(`/posteEspaces/poste/${idPoste}`);
export const getGames = () => API.get('/games');
export const addMultipleIsPlay = (data: any) => API.post('/isPlay/multiple', data);
export const deleteIsPlay = (data: any) => API.delete(`/isPlay/${data.idGame}/${data.idFestival}/${data.idEspace}`);
export const getIsPlayByEspaceAndFestival = (idEspace: string, idFestival: string) => API.get(`/isPlay/${idEspace}/${idFestival}`);