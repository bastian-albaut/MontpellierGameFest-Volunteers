import "../../styles/components/Dashboard/sectiondashboard.module.scss" 
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';


interface Festival {
	id: string;
    nom: string;
	lieu: string;
    dateDebut: string;
	dateFin: string;
}

const SectionDashboard: React.FC = () => {
    const [festivals, setFestivals] = useState<Festival[]>([]);


	useEffect(() => { 
		fetch("http://localhost:3000/api/festivals")
			.then((res) => res.json())
			.then((data) => {
				setFestivals(data);
			});
	},[]);


	return (
        <Box sx={{ margin: 3 }}>
            <Typography variant="h2" gutterBottom>
                Liste des Festivals
            </Typography>
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
        </Box>
    );
}

export default SectionDashboard
