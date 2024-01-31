import { Box, Typography, Button } from '@mui/material';
import { Grid, Paper } from '@mui/material';

import Appbar from "../../components/general/Appbar"
import { useUser } from "../../contexts/UserContext";
import Loading from "../../components/general/Loading";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import AlertComponent from "../../components/general/Alert";
import useAlert from "../../hooks/useAlerts";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    // Display alert message from location state
    const location = useLocation();
    const { alertMessage, handleShowAlertMessage } = useAlert();
    
    const navigate = useNavigate();

    const dashboard = '/dashboard.jpeg';
    const faq = '/faq.jpeg';
    const contactus = '/aboutus.jpeg';


    // Styles pour le Paper avec une fonction pour injecter l'image de fond
    const paperStyle = (bgImage: string, height: string = '68vh') => ({
        height: height,
        display: 'flex',
        justifyContent: 'space-between', // Pour espacer verticalement
        alignItems: 'center',
        padding: '20px',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxSizing: 'border-box',
        width: '100%', // Assurer la largeur complète du conteneur de grille
        minWidth: '250px'
    });


    useEffect(() => {
        if (location?.state?.message !== undefined) {
            handleShowAlertMessage(location.state.message, location.state.severity);
        }
    }, [location, handleShowAlertMessage]);

    // Display alert message from UserContext
    const { user, loading, message, severity } = useUser();
    useEffect(() => {
        if (message) {
            handleShowAlertMessage(message, severity);
        }
    }, [message, severity, handleShowAlertMessage]);

    if (loading) {
        return <Loading />;
    }

	return(
        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            
            <Box
                sx={{
                    backgroundImage: 'url(/festival.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: '64px',
                    paddingBottom: '64px',
                }}
            >

                <Box sx={{ width: '100%', maxWidth: 1200, maxHeight: '100vh', overflow: 'auto' }}>
                    <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 1200 }}>
                        {/* Dashboard */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={paperStyle(dashboard)}>
                                <Box sx={{ mt: 'auto', width: '100%', textAlign: 'center' }}>
                                    <Button variant="contained" color="primary" sx={{ m: 1, width: 150, height: 50 }}>Connexion</Button>
                                    <Button variant="outlined" color="primary" sx={{ m: 1, width: 150, height: 50 }}>Inscription</Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Conteneur pour FAQ et Contact Us à droite de Dashboard */}
                        <Grid item xs={12} md={6}>
                            <Grid container direction="column" spacing={2}>
                                {/* FAQ */}
                                <Grid item xs={12}>
                                    <Paper sx={paperStyle(faq, '33vh')}></Paper>
                                </Grid>

                                {/* Contact Us */}
                                <Grid item xs={12}>
                                    <Paper sx={paperStyle(contactus, '33vh')}></Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                
            </Box>

        </>
	)
}

export default HomePage
