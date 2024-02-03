import styles from "../../styles/components/festival/acceuil.module.scss" 
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getVolunteersByFestival } from "../../api";


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
                    console.log('Data from API:', response.data);
                    setVolunteers(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [props.festivalId]);

    const columns: GridColDef[] = [
        { field: 'lastName', headerName: 'Nom', width: 130 },
        { field: 'firstName', headerName: 'Prénom', width: 130 },
        {
            field: 'present',
            headerName: 'Présent',
            width: 130,
            renderCell: (params) => (
                <input type="checkbox" checked={params.value} disabled />
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
