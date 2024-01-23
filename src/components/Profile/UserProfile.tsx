import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button, InputLabel, FormControl, Input, MenuItem, ListItemText, Select } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from '../../components/general/Alert';


import { modifyUser } from '../../api';


const UserProfileComponent = () => {
    const { user } = useUser();
    const { alertMessage, handleShowAlertMessage } = useAlert();



	// Initialise l'état avec des valeurs par défaut
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
    });

    // Met à jour l'état avec les informations de l'utilisateur après le rendu initial
    useEffect(() => {
        if (user) {
            setUserInfo({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
            });
        }
    }, [user]);


	if (!user) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Vous devez être connecté pour voir cette page.</Typography>
            </Box>
        );
    }


	// Gère la mise à jour des champs de saisie
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    
	const handleSubmit = async () => {
        try {
            const userDataToUpdate = {
                id: user.id,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                address: userInfo.address,
                email: userInfo.email,
            };
    
            // Appel à la fonction modifyUser avec les informations à mettre à jour
            const response = await modifyUser(userDataToUpdate); // Cela retourne AxiosResponse
    
            // Accéde aux données renvoyées via response.data
            const updatedUser = response.data; // Supposons que cela contienne l'utilisateur mis à jour
    
            // Utilise updatedUser pour accéder à vos propriétés
            setUserInfo({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                address: updatedUser.address,
            });

            // Affiche un message de succès
            handleShowAlertMessage("Les modifications ont été enregistrées avec succès.", "success");
    
            console.log('Informations mises à jour avec succès.');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations :', error);
        }
    };
    
    
    
    return (

		<Box className={styles.userProfile}>
            <Typography className={styles.userProfileTitle} variant="h4" gutterBottom>
                Profil de l'Utilisateur
            </Typography>
            <TextField
                label="Prénom"
                variant="outlined"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleChange}
                className={styles.userInfo}
            />
            <TextField
                label="Nom"
                variant="outlined"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleChange}
                className={styles.userInfo}
            />
            <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                className={styles.userInfo}
            />
            <TextField
                label="Adresse"
                variant="outlined"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                className={styles.userInfo}
            />


            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}


			<Button
                variant="contained" 
                color="primary" 
                onClick={handleSubmit} 
                className={styles.submitButton}
            >
                Valider
            </Button>
        </Box>

		

    );


};
    
    

export default UserProfileComponent;
