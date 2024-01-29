import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button, InputLabel, FormControl, Input, MenuItem, ListItemText, Select, Paper, Avatar } from '@mui/material';
import styles from "../../styles/components/Profile/userprofile.module.scss";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from '../general/Alert';



const ViewUserProfileComponent = () => {
    const { user } = useUser();
    const { alertMessage, handleShowAlertMessage } = useAlert();
    const navigate = useNavigate();


	// Initialise l'état avec des valeurs par défaut
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        picture: '',
    });

    // Met à jour l'état avec les informations de l'utilisateur après le rendu initial
    useEffect(() => {
        console.log(user);
        if (user) {
            setUserInfo({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                picture: user.picture,
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

    const handleProfileEdit = () => {
        navigate('/modifyprofil'); 
    };

    
    return (

		<Box className={styles.userProfile}>
            <Typography className={styles.userProfileTitle} variant="h4" gutterBottom>
                Mon profil
            </Typography>

            {/* Affiche la photo de l'utilisateur */}
            {userInfo.picture && (
                <img
                    src={userInfo.picture}
                    alt="User"
                    style={{ width: '150px', height: '150px' }} 
                />
            )}


            <TextField
                label="Prénom"
                variant="outlined"
                name="firstName"
                value={userInfo.firstName}
                className={styles.userInfo}
                disabled
            />
            <TextField
                label="Nom"
                variant="outlined"
                name="lastName"
                value={userInfo.lastName}
                className={styles.userInfo}
                disabled
            />
            <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={userInfo.email}
                className={styles.userInfo}
                disabled
            />
            <TextField
                label="Adresse"
                variant="outlined"
                name="address"
                value={userInfo.address}
                className={styles.userInfo}
                disabled
            />


            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}


			<Button
                variant="contained" 
                color="primary" 
                onClick={handleProfileEdit}
                className={styles.submitButton}
            >
                Modifier son profil
            </Button>
        </Box>

		

    );


};
    
    

export default ViewUserProfileComponent;
