import axios from 'axios';
import { User } from '../types/User';
import { Festival } from '../types/Festival';
import { Poste } from '../types/Poste';
import { Creneau } from '../types/Creneau';
import { isVolunteer } from '../types/IsVolunteer';
import { IsPresent } from '../types/IsPresent';

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
export const modifyUser = async ({ id, ...data }: any) => { return API.put(`/users/${id}`, data); }
export const register = (data: any) => API.post('/register', data);
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
export const getFestivalsOfVolunteer = (id: string) => API.get(`/users/${id}/festivals`);
export const modifyVolunteersFestival = (idFestival: string, idUser: string, data: Partial<isVolunteer>) => API.put(`/festivals/${idFestival}/volunteers/${idUser}`, data);
export const addPresent = (data: IsPresent) => API.post('/isPresent', data);
export const getPresent = (data: IsPresent) => API.get(`/isPresent/` + data.idFestival + `/` + data.idUser+ `/`+ data.date +``);
export const modifyPresent = (idFestival: string, idUser: string, date: string) => API.put(`/isPresent/${idFestival}/${idUser}/${date}`);
export const deletePresent = (data: IsPresent) => API.delete(`/isPresent/` + data.idFestival + `/` + data.idUser+ `/`+ data.date +``);


export const getFestivals = () => API.get('/festivals');
export const getCreneauxByUserAndFestival = (idUser: string, idFestival: string) => API.get(`/creneaux/user/${idUser}/festivals/${idFestival}`);
export const getInscriptionByUserAndFestival =(idUser: string, idFestival: string) => API.get(`/inscriptions/${idUser}/festivals/${idFestival}`);
export const addEspace = (data: any) => API.post('/espaces', data);
export const addPosteEspace = (data: any) => API.post('/posteEspaces', data);
export const deleteFestival = (id: string) => API.delete('/festivals/' + id);
export const addCreneauEspace = (data: any) => API.post('/creneauEspaces', data);
export const motsDePasseOublie = (email: string) => API.post('/reset-password', { email });
export const resetPasswordApi = (password: any) => API.post('/update-password-with-token', password );
export const apiVerifyEmail = (token: string) => API.post(`/emails/verify?token=${token}`);
export const getSoirees = () => API.get('/events');
export const updateCreneauEspace = (id: string, data: any) => API.put('/creneauEspaces/' + id, data);
export const getCreneauEspaceByCreneau = (id: string) => API.get(`/creneauEspaces/creneau/${id}`);
export const addInscription = (data: any) => API.post('/inscriptions', data);
export const getEspacesByPoste = (idPoste: string) => API.get(`/posteEspaces/poste/${idPoste}`);
export const getGames = () => API.get('/games');
export const addMultipleIsPlay = (data: any) => API.post('/isPlay/multiple', data);
export const deleteIsPlay = (data: any) => API.delete(`/isPlay/${data.idGame}/${data.idFestival}/${data.idEspace}`);
export const getIsPlayByEspaceAndFestival = (idEspace: string, idFestival: string) => API.get(`/isPlay/${idEspace}/${idFestival}`);
export const getGamesByFestival = (id: string) => API.get(`/festivals/${id}/games`);

export const uploadFile = (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
  
    return API.post('/uploads/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};
