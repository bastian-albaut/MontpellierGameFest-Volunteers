import styles from '../../styles/components/Dashboard/dashboard.module.scss';
import React, { useEffect, useState } from 'react';
import { getCreneauxByFestival } from '../../api'; // Ajustez selon votre API
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../general/Loading'; // Vérifiez le chemin
import { Box, Typography } from '@mui/material';



interface PlanningProps {
  idFestival: string;
}

const Planning: React.FC<PlanningProps> = ({ idFestival }) => {
  const [creneaux, setCreneaux] = useState<any[]>([]); // Type spécifique si possible
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        const response = await getCreneauxByFestival(idFestival);
        setCreneaux(response.data); // Adaptez le format de la réponse
      } catch (error) {
        console.error('Erreur lors de la récupération des créneaux', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreneaux();
  }, [idFestival]);

  if (loading) {
    return <Loading />;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    // Autres colonnes...
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h5" className={styles.heading}>Planning du Festival</Typography>
      <DataGrid
        rows={creneaux}
        columns={columns}
      />
    </Box>
  );
};

export default Planning;
