import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import { getFestivals } from '../../api';
import Planning from '../Dashboard/Planning';
import { Festival } from '../../types/Festival';
import styles from '../../styles/components/MyFestival/monFestival.module.scss';
import SectionPoste from '../Poste/SectionPoste';
import { SelectChangeEvent } from '@mui/material/Select';

const MonFestival: React.FC = () => {
  const { user, loading: userLoading, reloadUserContext } = useUser();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState<string>('');

  useEffect(() => {
    console.error("user 1",user);
    if (user) {
      const fetchFestivals = async () => {
        setLoading(true);
        try {
          const response = await getFestivals();
          setFestivals(response.data);
          const activeOrUpcomingFestival = response.data.find((f: Festival) => f.isActive || new Date(f.dateDebut) > new Date());
          setSelectedFestival(activeOrUpcomingFestival?.idFestival || '');
          console.error("user 2",user);
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

  const handleFestivalChange = (event: SelectChangeEvent) => {
    setSelectedFestival(event.target.value as string);
  };

  if (userLoading || loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Typography>Vous devez vous connecter pour voir cette page.</Typography>;
  }

  if (!festivals.length) {
    return <Typography>Il n'y a pas de festival à venir pour l'instant.</Typography>;
  }

  const formatDate = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const currentFestival = festivals.find(festival => festival.idFestival?.toString() === selectedFestival);

  return (
    <Box className={styles.monFestivalContainer}>
      <FormControl fullWidth>
        <InputLabel id="festival-selector-label">Sélectionnez un festival</InputLabel>
        <Select
          labelId="festival-selector-label"
          value={selectedFestival}
          label="Sélectionnez un festival"
          onChange={handleFestivalChange}
        >
          {festivals.map((festival) => (
            <MenuItem key={festival.idFestival} value={festival.idFestival?.toString() ?? "error"}>
              {festival.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {currentFestival && (
      <>
        {/* Assurez-vous que currentFestival et ses propriétés sont définis avant de les utiliser */}
        <Typography variant="h4" className={styles.monFestivalTitle}>
          Bienvenue au festival {currentFestival.name}
        </Typography>
        {/* Autres utilisations de currentFestival avec vérification de nullité */}
        <Planning idFestival={currentFestival.idFestival!.toString()} userId={user.userId ?? ''} />
        <SectionPoste idPoste="id_du_poste_sélectionné" />
      </>
    )}
  </Box>
);
}

export default MonFestival;
