import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button, InputLabel, FormControl, Input, MenuItem, ListItemText, Select } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";

import { modifyUser } from '../../api';


const UserProfilePage = () => {
    const { user } = useUser();
	const navigate = useNavigate();


	// Initialisez l'état avec des valeurs par défaut
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
    });

    // Mettez à jour l'état avec les informations de l'utilisateur après le rendu initial
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
        // Assurez-vous d'avoir l'ID de l'utilisateur comme un nombre
        // Vérifiez que userId n'est pas undefined avant de continuer
        if (typeof user.userId === 'number') {
            const userId = user.userId;
    
            try {
                // Préparez les données, en excluant les champs non nécessaires ou sensibles comme le mot de passe
                const userDataToUpdate = {
                    id: userId,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    address: userInfo.address,
                    email: userInfo.email,
                    // file: userInfo.file, 
                };
    
                // Appel à la fonction modifyUser avec l'ID de l'utilisateur et les informations à mettre à jour
                const response = await modifyUser(userDataToUpdate);
    
                // Gérez la réponse de succès ici
                console.log('Informations mises à jour avec succès.');
                navigate('/');
            } catch (error) {
                // Gérez les erreurs ici
                console.error('Erreur lors de la mise à jour des informations :', error);
            }
        } else {
            console.error('L\'ID de l\'utilisateur est indéfini.');
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

export default UserProfilePage;
