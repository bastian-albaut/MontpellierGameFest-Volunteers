import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";

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

	// Gère la mise à jour des champs de saisie
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

	// Gère la soumission du formulaire
	const handleSubmit = async () => {
        // Implémentez la logique de mise à jour des informations de l'utilisateur ici
        console.log('Mise à jour des informations :', userInfo);

        // Redirigez l'utilisateur vers la page d'accueil après la mise à jour
        navigate('/');
    };

	if (!user) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Vous devez être connecté pour voir cette page.</Typography>
            </Box>
        );
    }

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
