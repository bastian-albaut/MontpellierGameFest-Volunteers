import styles from "../../styles/components/festival/acceuil.module.scss" 
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getVolunteersByFestival } from "../../api";
import { addPresent } from "../../api";
import { IsPresent } from "../../types/IsPresent";
import { getPresent } from "../../api";
import { deletePresent } from "../../api";
import { modifyVolunteersFestival } from "../../api";
import { isVolunteer } from "../../types/IsVolunteer"
import { Festival } from "../../types/Festival";
import { getFestivalById } from "../../api";


const Acceuil = (props: any) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [presenceStatus, setPresenceStatus] = useState({}); 
    const [volunteers, setVolunteers] = useState<isVolunteer[]>([]);
 
    // Redirect to home page if not logged in
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

   

    const [columns, setColumns] = useState<GridColDef[]>([
        { field: 'lastName', headerName: 'Nom', width: 130,  renderCell: (params) => params.row.user.lastName, },
        { field: 'firstName', headerName: 'Prénom', width: 130, renderCell: (params) => params.row.user.firstName, },
        {
            field: 'present',  
            headerName: 'Présent',
            width: 100,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.value}
                    onChange={(e) => handlePresentChange(params.row, e.target.checked)}
                />
            ),
        },
        {
             field: 'getTeeShirt',
            headerName: 'T-shirt récupéré',
            width: 150,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.row.getTeeShirt || false}
                    onChange={(e) => handleTshirtChange(params.row, e.target.checked)}
                />
            ),
        },
        {
            field: 'isVege',
            headerName: 'Végétarien',
            width: 130,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.row.isVege || false}
                    onChange={(e) => handleVegetarianChange(params.row, e.target.checked)}
                />
            ),
        },
    ]);

    
    useEffect(() => {
        if (props.idFestival) {
            // Récupérer les détails du festival par son ID
            getFestivalById(props.idFestival)
                .then(festivalResponse => {
                    const festival: Festival = festivalResponse.data;
                    // Générer les colonnes de présence en fonction des dates du festival
                    const presenceColumns = generatePresenceColumns(festival);
    
                    // Mettre à jour l'état des colonnes avec les colonnes de base + colonnes de présence
                    setColumns(currentColumns => [...currentColumns, ...presenceColumns]);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des détails du festival", error);
                });

            // Récupérer les bénévoles pour ce festival
            getVolunteersByFestival(props.idFestival)
                .then(response => {
                    const volunteersData: isVolunteer[] = response.data.map((item: any) => ({
                        ...item,
                        idFestival: item.idFestival,
                        idUser: item.idUser,
                        lastName: item.user.lastName,
                        firstName: item.user.firstName,
                    }));
                    setVolunteers(volunteersData);
                })
                .catch(error => {
                    console.error("Erreur lors du chargement des bénévoles", error);
                });
        }
    }, [props.idFestival]);

     /*
    useEffect(() => {
        if (props.idFestival) {
            getVolunteersByFestival(props.idFestival)
                .then(response => {
                    const volunteersData: isVolunteer[] = response.data.map((item: any) => ({
                        ...item,
                        idFestival: item.idFestival,
                        idUser: item.idUser,
                        lastName: item.user.lastName,
                        firstName: item.user.firstName,
                    }));
                    setVolunteers(volunteersData);
                    console.log(volunteersData);
                })
                .catch(error => {
                    console.error("Erreur lors du chargement des bénévoles", error);
                });
        }
    }, [props.idFestival]);
    */


    function getDatesBetween(startDate: Date, endDate: Date): Date[] {
        const dates: Date[] = [];
        let currentDate = new Date(startDate.getTime());
    
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return dates;
    }

    // Cette fonction doit être utilisée dans le composant où vous définissez vos colonnes pour DataGrid
    function generatePresenceColumns(festival: Festival): GridColDef[] {
        const festivalDays = getDatesBetween(new Date(festival.dateDebut), new Date(festival.dateFin));

        return festivalDays.map(day => ({
            field: day.toISOString().split('T')[0],
            headerName: day.toLocaleDateString(),
            width: 150,
            renderCell: (params: GridRenderCellParams): React.ReactNode => {
                // La logique pour déterminer si le bénévole est présent ce jour devra être implémentée
                // en fonction de vos données et de la manière dont vous accédez à l'état de présence
                const isPresentToday = false; // Remplacez par la logique appropriée
                return (
                    <input
                        type="checkbox"
                        checked={isPresentToday}
                        onChange={(e) => handleDayPresenceChange(params.row as isVolunteer, day, e.target.checked)}
                    />
                );
            },
        }));
    }


    /*
    const columns: GridColDef[] = [
        { field: 'lastName', headerName: 'Nom', width: 130,  renderCell: (params) => params.row.user.lastName, },
        { field: 'firstName', headerName: 'Prénom', width: 130, renderCell: (params) => params.row.user.firstName, },
        {
            field: 'present',  
            headerName: 'Présent',
            width: 100,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.value}
                    onChange={(e) => handlePresentChange(params.row, e.target.checked)}
                />
            ),
        },
        {
             field: 'getTeeShirt',
            headerName: 'T-shirt récupéré',
            width: 150,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.row.getTeeShirt || false}
                    onChange={(e) => handleTshirtChange(params.row, e.target.checked)}
                />
            ),
        },
        {
            field: 'isVege',
            headerName: 'Végétarien',
            width: 130,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={params.row.isVege || false}
                    onChange={(e) => handleVegetarianChange(params.row, e.target.checked)}
                />
            ),
        },
    ];
    */


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
                console.log(`Présence ajoutée pour ${row.idUser} le ${today}`);
            } else {
                await deletePresent(data);
                console.log(`Présence supprimée pour ${row.idUser} le ${today}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout/suppression de la présence", error);
        }
    };


    const handleDayPresenceChange = async (volunteer: isVolunteer, day: Date, isChecked: boolean) => {
        const formattedDay = day.toISOString().split('T')[0];
        const data: IsPresent = {
            idFestival: volunteer.idFestival, 
            idUser: volunteer.idUser,
            date: formattedDay,
        };
    
        try {
            if (isChecked) {
                await addPresent(data);
                console.log(`Présence ajoutée pour ${volunteer.idUser} le ${formattedDay}`);
            } else {
                // Implémentez deletePresent selon votre API
                console.log(`Présence supprimée pour ${volunteer.idUser} le ${formattedDay}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout/suppression de la présence", error);
        }
    };
    

  
    const handleVegetarianChange = async (row: isVolunteer, isVegetarian: boolean) => {
        const idFestival = String(row.idFestival);
        const idUser = row.idUser;
        const data = { isVege: isVegetarian };

        try {
            await modifyVolunteersFestival(idFestival, idUser, data);
            console.log(`Statut végétarien mis à jour : ${isVegetarian}`);

            // Mettre à jour l'état local pour refléter le changement
            setVolunteers(prevVolunteers =>
                prevVolunteers.map(volunteer =>
                    volunteer.idFestival === Number(idFestival) && volunteer.idUser === idUser
                        ? { ...volunteer, isVege: isVegetarian }
                        : volunteer
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut végétarien", error);
        }
    };


    
    const handleTshirtChange = async (row: any, isChecked: boolean) => {
        const idFestival = row.idFestival;
        const idUser = row.idUser;
        const data ={ getTeeShirt: isChecked };

        try {
            await modifyVolunteersFestival(idFestival, idUser, data);
            console.log(`Statut de récupération du t-shirt pour ${idUser} mis à jour : ${isChecked}`);

            // Mettre à jour l'état local pour refléter le changement
            setVolunteers(prevVolunteers =>
                prevVolunteers.map(volunteer =>
                    volunteer.idFestival === idFestival && volunteer.idUser === idUser
                        ? { ...volunteer, getTeeShirt: isChecked }
                        : volunteer
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la récupération du t-shirt", error);
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
                            paginationModel: { page: 0 },
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
