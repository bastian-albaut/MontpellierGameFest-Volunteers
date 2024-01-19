import "../../styles/components/Dashboard/sectiondashboard.module.scss" 
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { getFestivals } from '../../api';
import { getSoirees } from '../../api';
import { getIdFestival } from '../../api';

import { useUser } from "../../contexts/UserContext";
import { getVolunteerFestivals } from '../../api';

import styles from "../../styles/components/Dashboard/sectiondashboard.module.scss";

interface Festival {
	id: string;
    name: string;
	lieu: string;
    dateDebut: string;
	dateFin: string;
}

interface Soiree {
    id: string;
    nom: string;
    lieu: string;
    date: string;
}

const SectionDashboard: React.FC = () => {


    // Exemple de données de festivals pour le test
    const exampleUserFestivals: Festival[] = [
        {
            id: '1',
            name: 'Festival de Jazz',
            lieu: 'Paris',
            dateDebut: '2024-06-10',
            dateFin: '2024-06-15'
        },
        {
            id: '2',
            name: 'Festival Rock',
            lieu: 'Nantes',
            dateDebut: '2024-07-20',
            dateFin: '2024-07-22'
        },
        {
            id: '3',
            name: 'Festival Électronique',
            lieu: 'Lyon',
            dateDebut: '2024-08-05',
            dateFin: '2024-08-07'
        }
    ];


    // Exemple de données de soirées pour le test
    const exampleSoirees: Soiree[] = [
    
    ];



    const { user } = useUser(); // Récupération des données de l'utilisateur connecté
    const [userFestivals, setUserFestivals] = useState<Festival[]>(exampleUserFestivals); // Liste des festivals de l'utilisateur connecté
    const [showUserFestivals, setShowUserFestivals] = useState<boolean>(false); // Affichage de la liste des festivals de l'utilisateur connecté

    // à rajouter avec le back
    //const [userFestivals, setUserFestivals] = useState<Festival[]>([]);

    const [festivals, setFestivals] = useState<Festival[]>([]); // Liste des festivals
	const [showFestivals, setShowFestivals] = useState<boolean>(false); // Affichage de la liste des festivals


    // A tester avec la base de donnée
    //const [soirees, setSoirees] = useState<Soiree[]>([]);
    const [soirees, setSoirees] = useState<Soiree[]>(exampleSoirees);
    const [showSoirees, setShowSoirees] = useState<boolean>(false);


    
    // Logique de récupération des festivals de l'utilisateur connecté
    const fetchUserFestivals = async (userId: string) => {
        try {
            const res = await getVolunteerFestivals(userId);
            if (res.data) {
                setUserFestivals(res.data);
            }
        } catch (error) {
            console.error('Error fetching user festivals data', error);
        }
    };
    
    
    useEffect(() => {
        if (user && user.userId) {
            fetchUserFestivals(user.userId.toString());
        }
    }, [user]);
    


    // Récupération des festivals depuis la base de donnée
	const fetchFestivals = async () => {
		try {
			const res = await getFestivals();
			console.log("Response from getFestivals:", res);
			if (res.data) {
				setFestivals(res.data);
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



	const toggleFestivals = () => {
        setShowFestivals(!showFestivals);
    };

     const toggleSoirees = () => {
        setShowSoirees(!showSoirees);
    };

    const toggleUserFestivals = () => {
        setShowUserFestivals(!showUserFestivals);
    };
   

    // tester si ca marche si il n'y aucun festival ouverts à l'inscription
	return (
        <>


        <Box id={styles.boxSection}>

            <Typography id={styles.title} variant="h1" color="black">Tableau de bord</Typography>
        
            <Box className={styles.boxTable}>
                <Box className={styles.boxButtonTable}>
                <Button onClick={toggleUserFestivals} variant="text">
                    <Typography className={styles.titleTable} variant="h2" color="initial">
                        Liste des Festivals auxquels vous êtes inscrit
                    </Typography>
                </Button>
                </Box>
                {showUserFestivals && (
                    <List>
                        {userFestivals.length > 0 ? (
                            userFestivals.map((festival, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText primary={festival.name} secondary={`Du ${festival.dateDebut} au ${festival.dateFin}`} />
                                    <Typography variant="body2">
                                        {festival.lieu}
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
                <Button onClick={toggleFestivals} variant="text">
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
                                    <ListItemText primary={festival.name} />
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
                <Button onClick={toggleSoirees} variant="text">
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
                                    <ListItemText primary={soiree.nom} secondary={`${soiree.date}`} />
                                    <Typography variant="body2">
                                        {soiree.lieu}
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
