import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";

const UserProfilePage = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Vous devez être connecté pour voir cette page.</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.userProfile} sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Profil de l'Utilisateur</Typography>
            <Typography variant="body1"><strong>Prénom:</strong> {user.firstName}</Typography>
            <Typography variant="body1"><strong>Nom:</strong> {user.lastName}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1"><strong>Adresse:</strong> {user.address}</Typography>
            {/* Afficher d'autres informations de l'utilisateur si nécessaire */}
        </Box>
    );
};

export default UserProfilePage;
