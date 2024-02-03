import "../../styles/components/Dashboard/sectiondashboard.module.scss" 
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getFestivals } from '../../api';
import { getSoirees } from '../../api';
import { getFestivalById } from '../../api';

import { useUser } from "../../contexts/UserContext";
import { getVolunteersByFestival } from '../../api';

import styles from "../../styles/components/Dashboard/sectiondashboard.module.scss";

interface Festival {
    idFestival: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isActive: boolean;
    dateDebut: string;
    dateFin: string;
}

interface VolunteerFestival {
    idFestival: number;
    idUser: string;
    isVege: boolean;
    sizeTeeShirt: string;
    role: string;
    jeuxIdGame?: any; 
    festival: Festival; 
}

interface Soiree {
    id: string;
    name: string;
    address: string;
    dateEvent: string;
}


const SectionDashboard: React.FC = () => {


    const { user, loading } = useUser(); 
    const [userFestivals, setUserFestivals] = useState<VolunteerFestival[]>([]); 
    const [showUserFestivals, setShowUserFestivals] = useState<boolean>(false); 


    const [festivals, setFestivals] = useState<Festival[]>([]); 
	const [showFestivals, setShowFestivals] = useState<boolean>(false); 


    const [soirees, setSoirees] = useState<Soiree[]>([]) //
    const [showSoirees, setShowSoirees] = useState<boolean>(false);


    // Récupération des festivals de l'utilisateur connecté
    const fetchUserFestivals = async (id: string) => {
        try {
            const res = await getVolunteersByFestival(id);
            if (res.data) {
                setUserFestivals(res.data);
                console.log(res.data)
            }
        } catch (error) {
            console.error('Error fetching user festivals data', error);
        }
    };

    useEffect(() => {
        if (!loading && user?.id) {
            console.log('User id:', user.id);
            fetchUserFestivals(user.id); 
        }
    }, [user, loading]);
    
    

    // Récupération des festivals depuis la base de donnée
    const fetchFestivals = async () => {
        try {
            const res = await getFestivals();
            console.log("Response from getFestivals:", res);
            if (res.data) {
                const filteredFestivals = res.data.filter((festival: Festival) => {
                    const today = new Date();
                    const startDate = new Date(festival.dateDebut);
                    return startDate > today;
                });
                setFestivals(filteredFestivals);
            }
        } catch (error) {
            console.error('Error fetching festivals data', error);
        }
    }
    

	useEffect(() => {
		fetchFestivals();
	}, []);


    // Récupération des soirées depuis la base de donnée
    const fetchSoirees = async () => {
        try {
            const res = await getSoirees();
            console.log("Response from getSoirees:", res);
            if (res.data) {
                setSoirees(res.data);
            }
        } catch (error) {
            console.error('Error fetching soirees data', error);
        }
    }

    useEffect(() => {
        fetchSoirees();
    }, []);



    const toggleUserFestivals = () => {
        setShowUserFestivals(!showUserFestivals);
    };

	const toggleFestivals = () => {
        setShowFestivals(!showFestivals);
    };

     const toggleSoirees = () => {
        setShowSoirees(!showSoirees);
    };
   

	return (
        <>


        <Box id={styles.boxSection}>

            <Typography id={styles.title} variant="h1" color="black">Tableau de bord</Typography>
        
            <Box className={styles.boxTable}>
                <Box className={styles.boxButtonTable}>
                <Button onClick={toggleUserFestivals} variant="text" endIcon={<ExpandMoreIcon style={{ fontSize: '50px', color: 'black' }} />}>
                    <Typography className={styles.titleTable} variant="h2" color="initial">
                        Liste des Festivals auxquels vous êtes inscrit
                    </Typography>
                </Button>
                </Box>
                {showUserFestivals && (
                    <List>
                        {userFestivals.length > 0 ? (
                            userFestivals.map((volunteerFestival: VolunteerFestival, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText 
                                        primary={volunteerFestival.festival.name}
                                        secondary={`Du ${new Date(volunteerFestival.festival.dateDebut).toLocaleDateString()} au ${new Date(volunteerFestival.festival.dateFin).toLocaleDateString()}`} 
                                    />
                                    <Typography variant="body2">
                                        {volunteerFestival.festival.address} 
                                    </Typography>
                                </ListItem>
                            ))
                        ) : (
                            <Typography className={styles.textTable} variant="body1" color="initial">
                                Il n'y a aucun festival auquel vous êtes inscrit pour le moment.
                            </Typography>
                        )}
                    </List>
                )}
            </Box>



            <Box className={styles.boxTable}>
                <Box className={styles.boxButtonTable}>
                <Button onClick={toggleFestivals} variant="text" endIcon={<ExpandMoreIcon style={{ fontSize: '50px', color: 'black' }} />}>
                    <Typography className={styles.titleTable} variant="h2" color="initial">
                        Liste des Festivals ouverts à l'inscription
                    </Typography>
                </Button>
                </Box>
                {showFestivals && (
                    <List>
                        {festivals.length > 0 ? (
                            festivals.map((festival, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText 
                                        primary={festival.name} 
                                        secondary={`Du ${new Date(festival.dateDebut).toLocaleDateString()} au ${new Date(festival.dateFin).toLocaleDateString()}`} 
                                    />
                                    <Button variant="contained" color="primary">
                                        S'inscrire
                                    </Button>
                                </ListItem>
                            ))                            
                        ) : (
                            <Typography className={styles.textTable} variant="body1" color="initial">
                                Il n'y a aucun festival ouvert à l'inscription pour le moment.
                            </Typography>
                        )}
                    </List>
                )}
            </Box>


            <Box className={styles.boxTable}>
                <Box className={styles.boxButtonTable}>
                <Button onClick={toggleSoirees} variant="text" endIcon={<ExpandMoreIcon style={{ fontSize: '50px', color: 'black' }} />}>
                    <Typography className={styles.titleTable} variant="h2" color="initial">
                        Liste des Soirées découvertes
                    </Typography>
                </Button>
                </Box>
                {showSoirees && (
                    <List>
                        {soirees.length > 0 ? (
                            soirees.map((soiree, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText 
                                        primary={soiree.name} 
                                        secondary={new Date(soiree.dateEvent).toLocaleDateString()}
                                    />
                                    <Typography variant="body2">
                                        {soiree.address}
                                    </Typography>
                                </ListItem>
                            ))                            
                        ) : (
                            <Typography className={styles.textTable} variant="body1" color="initial">
                                Il n'y a aucune soirée disponible pour le moment.
                            </Typography>
                        )}
                    </List>
                )}
            </Box>

        </Box>


        </>
    
    );
}

export default SectionDashboard
