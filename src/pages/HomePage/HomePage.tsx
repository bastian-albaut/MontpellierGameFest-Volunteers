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
    const paperStyle = (bgImage: string, height: string = '66vh') => ({
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
                <Grid container spacing={2} justifyContent="center" style={{ maxWidth: 1200 }}>
                    {/* Dashboard */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={paperStyle(dashboard)}>
                            <Box sx={{ mt: 'auto', width: '100%', textAlign: 'center' }}>
                                <Button variant="contained" color="primary" sx={{ m: 1, width: 150, height: 50 }}>Connexion</Button>
                                <Button variant="outlined" color="primary" sx={{ m: 1, width: 150, height: 50 }}>Inscription</Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* FAQ et Contact Us, ajustés pour correspondre à la hauteur de Dashboard */}
                    <Grid item xs={12} md={6} container spacing={2} direction="column">
                        <Grid item xs={6}>
                            <Paper sx={paperStyle(faq, '30vh')}>
                                <Typography variant="h5">FAQ</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={paperStyle(contactus, '30vh')}>
                                <Typography variant="h5">Contact Us</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                
            </Box>

        </>
	)
}

export default HomePage
