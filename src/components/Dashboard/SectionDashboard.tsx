import "../../styles/components/Dashboard/sectiondashboard.module.scss" 
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { getFestivals } from '../../api';

interface Festival {
	id: string;
    nom: string;
	lieu: string;
    dateDebut: string;
	dateFin: string;
}

const SectionDashboard: React.FC = () => {

	// Exemple de données de festivals pour le test
    const exampleFestivals: Festival[] = [
        {
            id: '1',
            nom: 'Festival du Printemps',
            lieu: 'Montpellier',
            dateDebut: '2023-04-10',
            dateFin: '2023-04-15'
        },
        {
            id: '2',
            nom: 'Festival de Musique Électronique',
            lieu: 'Paris',
            dateDebut: '2023-07-20',
            dateFin: '2023-07-22'
        },
        {
            id: '3',
            nom: 'Festival de Jazz',
            lieu: 'Lyon',
            dateDebut: '2023-08-05',
            dateFin: '2023-08-10'
        }
    ];

	const [festivals, setFestivals] = useState<Festival[]>(exampleFestivals);

    //const [festivals, setFestivals] = useState<Festival[]>([]);



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


	return (
        <Box sx={{ margin: 3 }}>
            <Typography variant="h2" gutterBottom>
                Liste des Festivals ouverts à l'inscription
            </Typography>
            <List>
                {festivals.map((festival, index) => (
                    <ListItem key={index} divider>
                        <ListItemText primary={festival.nom} />
						// TODO: Ajouter un bouton pour s'inscrire au festival
                        <Button variant="contained" color="primary">
                            S'inscrire
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default SectionDashboard
