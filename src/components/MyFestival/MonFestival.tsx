import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import { getFestivals } from '../../api';
import Planning from '../Dashboard/Planning';
import { Festival } from '../../types/Festival';
import styles from '../../styles/components/MyFestival/monFestival.module.scss';
import SectionPoste from '../Poste/SectionPoste';

const MonFestival: React.FC = () => {
  const { user, loading: userLoading, reloadUserContext } = useUser();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  useEffect(() => {
    if (user) {
      const fetchFestivals = async () => {
        setLoading(true);
        try {
          const response = await getFestivals();
          setFestivals(response.data);
          // Specify the type for 'f' as 'Festival'
          const activeOrUpcomingFestival = response.data.find((f: Festival) => f.isActive || new Date(f.dateDebut) > new Date());
          setSelectedFestival(activeOrUpcomingFestival || null);
        } catch (error) {
          console.error('Erreur lors de la récupération des festivals', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFestivals();
    } else if (!userLoading) {
      reloadUserContext();
    }
  }, [user, userLoading, reloadUserContext]);

  if (userLoading || loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Typography>Vous devez vous connecter pour voir cette page.</Typography>;
  }

  if (!selectedFestival) {
    return <Typography>Il n'y a pas de festival à venir pour l'instant.</Typography>;
  }

  const formatDate = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Box className={styles.monFestivalContainer}>
      {selectedFestival && (
        <>
          <Typography variant="h4" className={styles.monFestivalTitle}>
            Bienvenue au festival {selectedFestival.name}
          </Typography>
          <Typography variant="h6" className={styles.monFestivalAddress}>
            {`Adresse : ${selectedFestival.address}, ${selectedFestival.postalCode} ${selectedFestival.city}, ${selectedFestival.country}`}
          </Typography>
          <Typography variant="h6" className={styles.monFestivalDate}>
            {`Du ${formatDate(new Date(selectedFestival.dateDebut))} au ${formatDate(new Date(selectedFestival.dateFin))}`}
          </Typography>
          {/* Use optional chaining and provide a fallback empty string */}
          <Planning idFestival={selectedFestival.idFestival?.toString() || ''} userId={user.userId?.toString() || ''} />
          <SectionPoste idPoste="id_du_poste_sélectionné" />
        </>
      )}
    </Box>
  );
};

export default MonFestival;
//test
