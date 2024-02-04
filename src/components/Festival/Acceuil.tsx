import styles from "../../styles/components/festival/acceuil.module.scss" 
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getVolunteersByFestival } from "../../api";
import { addPresent } from "../../api";
import { IsPresent } from "../../types/IsPresent";
import { deletePresent } from "../../api";


const Acceuil = (props: any) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [volunteers, setVolunteers] = useState([]);
 
    // Redirect to home page if not logged in
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    // Chargement des bénévoles
    useEffect(() => {
        if (props.idFestival) {
            getVolunteersByFestival(props.idFestival)
                .then(response => {
                    //console.log('Data from API:', response.data);
                    const dataWithNames = response.data.map((item: any ) => ({
                        ...item,
                        lastName: item.user.lastName,
                        firstName: item.user.firstName,
                    }));
                    setVolunteers(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [props.festivalId]);

    const columns: GridColDef[] = [
        { field: 'user.lastName', headerName: 'Nom', width: 130,  renderCell: (params) => params.row.user.lastName, },
        { field: 'user.firstName', headerName: 'Prénom', width: 130, renderCell: (params) => params.row.user.firstName, },
        {
            field: 'present',
            headerName: 'Présent',
            width: 130,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.value}
                    onChange={(e) => handlePresentChange(params.row, e.target.checked)}
                />
            ),
        },
        {
            field: 'tshirtCollected',
            headerName: 'T-shirt récupéré',
            width: 160,
            renderCell: (params) => (
                <input type="checkbox" checked={params.value} disabled />
            ),
        },
        {
            field: 'vegetarian',
            headerName: 'Végétarien',
            width: 130,
            renderCell: (params) => (
                <input type="checkbox" checked={params.value} disabled />
            ),
        },
        {
            field: 'flexible',
            headerName: 'Flexible',
            width: 130,
            renderCell: (params) => (
                <input type="checkbox" checked={params.value} disabled />
            ),
        },
    ];


    const handlePresentChange = async (row: any, isChecked: boolean) => {
        const today = new Date().toISOString().split('T')[0];
    
        const data: IsPresent = {
            idFestival: row.idFestival, 
            idUser: row.idUser,
            date: today,
        };
    
        try {
            if (isChecked) {
                await addPresent(data);
                //console.log('Présence ajoutée', data);
            } else {
                await deletePresent(String(row.idFestival), row.idUser, today);
                //console.log('Présence supprimée', data);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout/suppression de la présence", error);
        }
    };
    

    if (loading) {
        return <Loading />;
    }

	return(
		<>
			<Box id={styles.festivalContainer}>
                <Typography id={styles.title} variant="h1" color="black">Accueil des bénévoles</Typography>
                <Box id={styles.boxListFestival}>
                <DataGrid
                    rows={volunteers}
                    columns={columns}
                    getRowId={(row) => `${row.idFestival}-${row.idUser}`}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0,  },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    sx={{
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer'
                        }
                    }}
                />
                </Box>
            </Box>
		</>
	)
}

export default Acceuil
