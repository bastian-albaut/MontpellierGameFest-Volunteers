import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Loading from '../general/Loading'; // Assurez-vous que le chemin est correct
import { getCreneauxByUserAndFestival,getInscriptionByUserAndFestival } from '../../api'; // Importez la fonction de l'API
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
        if(!userId){
          console.error("User non connecté");
          return;
        }
         console.error("UserID",userId)
          console.error("Festival",idFestival)
          const response = await getInscriptionByUserAndFestival(userId,idFestival.toString());
          setCreneaux(response.data);
          console.error(response.data);
          console.error("salut")
      
      } catch (error) {
        console.error('Erreur lors de la récupération des créneaux', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreneaux();
  }, [idFestival, userId]);

  const columns: GridColDef[] = [
    {
      field: 'idCreneauEspace',
      headerName: 'ID Créneau Espace',
      width: 150,
    },
    {
      field: 'timeStart',
      headerName: 'Heure de début',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.creneauEspace.creneau.timeStart).toLocaleTimeString(),
    },
    {
      field: 'timeEnd',
      headerName: 'Heure de fin',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.creneauEspace.creneau.timeEnd).toLocaleTimeString(),
    },
    {
      field: 'nameEspace',
      headerName: 'Espace',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => params.row.creneauEspace.espace.name,
    },
    // Vous pouvez ajouter d'autres colonnes basées sur les informations que vous souhaitez afficher
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
  getRowId={(row) => row.idCreneauEspace}
/>
    </Box>
  );
};

export default Planning;
