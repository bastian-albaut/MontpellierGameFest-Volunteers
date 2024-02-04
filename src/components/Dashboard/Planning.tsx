import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Loading from '../general/Loading'; // Assurez-vous que le chemin est correct
import { getCreneauxByUserAndFestival } from '../../api'; // Importez la fonction de l'API
import { Creneau } from '../../types/Creneau';

interface PlanningProps {
  idFestival: string;
  userId: string; // Utilisez cette prop pour récupérer les créneaux de l'utilisateur
}

const Planning: React.FC<PlanningProps> = ({ idFestival, userId }) => {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreneaux = async () => {
      setLoading(true);
      try {
        const response = await getCreneauxByUserAndFestival(userId, idFestival);
        setCreneaux(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des créneaux', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreneaux();
  }, [idFestival, userId]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'Prénom',
      width: 150,
      editable: true,
    },
    {
      field: 'timeStart',
      headerName: 'Heure de début',
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.timeStart).toLocaleTimeString(),
    },
    {
      field: 'timeEnd',
      headerName: 'Heure de fin',
      width: 130,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.timeEnd).toLocaleTimeString(),
    },
    // Ajoutez ici d'autres colonnes si nécessaire
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Planning du Festival
      </Typography>
      <DataGrid
  rows={creneaux}
  columns={columns}
  // Retirez les lignes suivantes si vous utilisez la version gratuite de DataGrid
  // pageSize={5}
  // rowsPerPageOptions={[5]}
  getRowId={(row) => row.id}
/>
    </Box>
  );
};

export default Planning;
