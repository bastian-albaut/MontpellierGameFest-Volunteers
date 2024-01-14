import "../../styles/components/Dashboard/sectiondashboard.module.scss" 
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { getFestivals } from '../../api';
import { getSoirees } from '../../api';
import { getIdFestival } from '../../api';

interface Festival {
	id: string;
    nom: string;
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
    const exampleFestivals: Festival[] = [
        {
            id: '1',
            nom: 'Festival du Printemps',
            lieu: 'Montpellier',
            dateDebut: '2023-04-10',
            dateFin: '2024-04-15'
        },
        {
            id: '2',
            nom: 'Festival de Musique Électronique',
            lieu: 'Paris',
            dateDebut: '2023-07-20',
            dateFin: '2024-07-22'
        },
        {
            id: '3',
            nom: 'Festival de Jazz',
            lieu: 'Lyon',
            dateDebut: '2023-08-05',
            dateFin: '2024-08-10'
        }
    ];

    // Exemple de données de soirées pour le test
    const exampleSoirees: Soiree[] = [
        {
            id: '1',
            nom: 'Soirée Disco',
            lieu: 'Marseille',
            date: '2023-05-15'
        },
        {
            id: '2',
            nom: 'Soirée Électro',
            lieu: 'Lille',
            date: '2023-06-25'
        },
        {
            id: '3',
            nom: 'Bal Masqué',
            lieu: 'Bordeaux',
            date: '2023-07-11'
        }
    ];
    

	const [festivals, setFestivals] = useState<Festival[]>(exampleFestivals);
	const [showFestivals, setShowFestivals] = useState<boolean>(false);

    // A tester avec la base de donnée
    //const [festivals, setFestivals] = useState<Festival[]>([]);

    const [soirees, setSoirees] = useState<Soiree[]>(exampleSoirees);
    const [showSoirees, setShowSoirees] = useState<boolean>(false);

    // A tester avec la base de donnée
    //const [soirees, setSoirees] = useState<Soiree[]>([]);

    const [inscritFestivalsByIds, setInscritFestivalsByIds] = useState<Festival[]>([]);
    const [showInscritFestivals, setShowInscritFestivals] = useState<boolean>(false);

    // A tester avec la base de donnée
    //const [inscritFestivals, setInscritFestivals] = useState<Festival[]>([]);


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
		// A tester avec la base de donnée
		//fetchFestivals();
	}, []);

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
        // A tester avec la base de donnée
        //fetchSoirees();
    }, []);

    
    const fetchFestivalsByIds = async (festivalIds: string[]) => {
        try {
            const festivalsData = [];
    
            for (const id of festivalIds) {
                const res = await getIdFestival(id);
                if (res.data) {
                    festivalsData.push(res.data);
                }
            }
    
            const currentDate = new Date().toISOString().split('T')[0];
            const filteredFestivals = festivalsData.filter(festival =>
                festival.dateFin >= currentDate
            );
    
            setFestivals(filteredFestivals);
        } catch (error) {
            console.error('Error fetching festival data by IDs', error);
        }
    };
    
    useEffect(() => {
        const inscritFestivalsIds = ['1', '2']; // Exemple, à remplacer par la logique réelle
        fetchFestivalsByIds(inscritFestivalsIds);
    }, []);

    


	const toggleFestivals = () => {
        setShowFestivals(!showFestivals);
    };

     const toggleSoirees = () => {
        setShowSoirees(!showSoirees);
    };

    const toggleInscritFestivals = () => {
        setShowInscritFestivals(!showInscritFestivals);
    };


	return (
        <>

            <Box sx={{ margin: 3 }}>
                <Button onClick={toggleInscritFestivals} variant="text">
                    <Typography variant="h5" color="initial">
                        Liste des Festivals auxquels je suis inscrit
                    </Typography>
                </Button>
                {showInscritFestivals && inscritFestivalsByIds.length > 0 && (
                    <List>
                        {inscritFestivalsByIds.map((festival, index) => (
                            <ListItem key={index} divider>
                                <ListItemText 
                                    primary={festival.nom} 
                                    secondary={`Lieu: ${festival.lieu}, Du: ${festival.dateDebut} au: ${festival.dateFin}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>


            <Box sx={{ margin: 3 }}>
                <Button onClick={toggleFestivals} variant="text">
                    <Typography variant="h5" color="initial">
                        Liste des Festivals ouverts à l'inscription
                    </Typography>
                </Button>
                {showFestivals && (
                    <List>
                        {festivals.map((festival, index) => (
                            <ListItem key={index} divider>
                                <ListItemText primary={festival.nom} />
                                <Button variant="contained" color="primary">
                                    S'inscrire
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Box sx={{ margin: 3 }}>
                <Button onClick={toggleSoirees} variant="text">
                    <Typography variant="h5" color="initial">
                        Liste des Soirées découvertes
                    </Typography>
                </Button>
                {showSoirees && (
                    <List>
                        {soirees.map((soiree, index) => (
                            <ListItem key={index} divider>
                                <ListItemText primary={soiree.nom} secondary={`${soiree.date}`} />
                                <Typography variant="body2">
                                    {soiree.lieu}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

        </>
    
    );
}

export default SectionDashboard
