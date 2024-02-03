import styles from '../../styles/components/Dashboard/dashboard.module.scss';

import React, { useEffect, useState } from 'react';
import { getCreneauxByFestival } from '../../api'; // Ajustez selon votre API
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../general/Loading'; // Vérifiez le chemin
import { Box, Typography } from '@mui/material';
import { Creneau } from '../../types/Creneau';



interface PlanningProps  {
  idFestival: string ;
}

const Planning: React.FC<PlanningProps> = ({ idFestival }) => {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        const response = await getCreneauxByFestival(idFestival);
        // Typage explicite de la variable 'creneau' dans le callback map
        const transformedData = response.data.map((creneau: Creneau) => ({
          ...creneau,
          id: creneau.idCreneau, // Utilisez l'ID de créneau comme clé unique pour chaque ligne
        }));
        setCreneaux(transformedData);
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
    <>

    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h5" className={styles.heading}>Planning du Festival</Typography>
      <DataGrid
        rows={creneaux}
        columns={columns}
        getRowId={(row) => row.idCreneau}
      />
    </Box>
    
</> );
};

export default Planning;
