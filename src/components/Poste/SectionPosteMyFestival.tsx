import React, { useState, useEffect } from 'react';
import { getPosteById } from '../../api'; // Assurez-vous que cette fonction est définie
import styles from '../../styles/components/Poste/sectionposte.module.scss';
import { Poste } from '../../types/Poste'; // Assurez-vous que le type est correctement défini
import { Avatar, Box, Typography } from '@mui/material';
import Loading from '../general/Loading';

interface SectionPosteProps {
  idPoste: string;
}

const SectionPoste: React.FC<SectionPosteProps> = ({ idPoste }) => {
    const [poste, setPoste] = useState<Poste | null>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(true);

    useEffect(() => {
        const fetchPoste = async () => {
            try {
                const response = await getPosteById(idPoste);
                setPoste(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du poste', error);
            }
            setIsLoadingFetch(false);
        };

        if (idPoste) {
            fetchPoste();
        }
    }, [idPoste]);

    if (isLoadingFetch) {
        return <Loading />;
    }

    if (!poste) {
        return <Typography>Aucun poste à afficher</Typography>;
    }

    return (
        <Box className={styles.posteContainer}>
            <Typography variant="h4" className={styles.posteTitle}>{poste.name}</Typography>
            <Typography variant="body1" className={styles.posteDescription}>{poste.description}</Typography>
            {/* Ici, vous devrez probablement itérer sur une liste de référents si vous en avez */}
            <Typography variant="h6" className={styles.referentsTitle}>Référents:</Typography>
            <Box className={styles.referentsList}>
                {/* Itérer sur les référents pour les afficher ici */}
            </Box>
        </Box>
    );
}

export default SectionPoste;