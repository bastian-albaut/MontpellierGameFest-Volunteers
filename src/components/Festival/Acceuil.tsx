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

    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [presenceStatus, setPresenceStatus] = useState<Record<string, boolean>>({});
    const [festival, setFestival] = useState<Festival | null>(null);
    const [volunteers, setVolunteers] = useState<isVolunteer[]>([]);
    const [isDataFetching, setIsDataFetching] = useState<boolean>(false);
 
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

    const loadPresenceForAllVolunteers = async () => {
        // Vérifiez si `festival` est `null` et arrêtez l'exécution de la fonction si c'est le cas
        if (!festival) {
            console.error("Festival est null, impossible de charger la présence pour les bénévoles.");
            return;
        }
    
        const festivalDays = getDatesBetween(new Date(festival.dateDebut), new Date(festival.dateFin));
        let newPresenceStatus: Record<string, boolean> = {};
    
        for (const volunteer of volunteers) {
            for (const day of festivalDays) {
                const formattedDay = day.toISOString().split('T')[0];
                const key = `${volunteer.idUser}-${formattedDay}`;
                try {
                    const response = await getPresent({
                        idFestival: Number(props.idFestival),
                        idUser: volunteer.idUser,
                        date: formattedDay
                    });
                    console.log(response);
                    // Si la réponse n'est pas null, considérez le bénévole comme présent
                    if (response.data !== null) {
                        newPresenceStatus[key] = true;
                    } else {
                        // Si la réponse est null, considérez le bénévole comme non présent
                        newPresenceStatus[key] = false;
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement de la présence", error);
                    newPresenceStatus[key] = false;
                }
            }
        }
    
        setPresenceStatus(newPresenceStatus);
        setIsDataFetching(true);
    };

    

    useEffect(() => {
        if (festival && isDataFetching) {
            const presenceColumns = generatePresenceColumns(festival);
            const uniqueColumns = new Map();
    
            // Ajoutez d'abord les colonnes statiques pour garantir leur présence
            columns.forEach(col => uniqueColumns.set(col.field, col));
    
            // Ensuite, ajoutez ou mettez à jour les colonnes dynamiques
            presenceColumns.forEach(col => uniqueColumns.set(col.field, col));
    
            // Convertissez les valeurs de la Map en tableau pour setColumns
            const updatedColumns = Array.from(uniqueColumns.values());
            setColumns(updatedColumns);
        }
    }, [festival, isDataFetching, presenceStatus]); // Dépendances mises à jour pour inclure presenceStatus
    
    



    useEffect(() => {
        if (props.idFestival) {
            // Récupérer les détails du festival par son ID
            getFestivalById(props.idFestival)
                .then(festivalResponse => {
                    const festivalData: Festival = festivalResponse.data;
                    setFestival(festivalData);

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


    useEffect(() => {
        if (festival && volunteers.length > 0) {
            loadPresenceForAllVolunteers();
        }
    }, [festival, volunteers]); 
    


    function getDatesBetween(startDate: Date, endDate: Date): Date[] {
        const dates: Date[] = [];
        let currentDate = new Date(startDate.getTime());
    
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        return dates;
    }


    function generatePresenceColumns(festival: Festival): GridColDef[] {
        const festivalDays = getDatesBetween(new Date(festival.dateDebut), new Date(festival.dateFin));
    
        return festivalDays.map(day => {
            const formattedDay = day.toISOString().split('T')[0];
            return {
                field: formattedDay,
                headerName: day.toLocaleDateString(),
                width: 150,
                renderCell: (params: GridRenderCellParams): React.ReactNode => {
                    const key = `${params.row.idUser}-${formattedDay}`;
                    const isPresentToday = presenceStatus[key];
                    return (
                        <input
                            type="checkbox"
                            checked={isPresentToday}
                            onChange={(e) => handleDayPresenceChange(params.row as isVolunteer, day, e.target.checked)}
                        />
                    );
                },
            };
        });
    }


    const handleDayPresenceChange = async (volunteer: isVolunteer, day: Date, isChecked: boolean) => {
        const formattedDay = day.toISOString().split('T')[0];
        const key = `${volunteer.idUser}-${formattedDay}`;
        const data: IsPresent = { idFestival: volunteer.idFestival, idUser: volunteer.idUser, date: formattedDay };
        try {
            if (isChecked) {
                await addPresent(data);
                console.log(`Présence ajoutée`, data);
            } else {
                await deletePresent(data);
                console.log(`Présence supprimée`, data);
            }
            let currentPresence = presenceStatus[key];
            setPresenceStatus(prevPresenceStatus => ({ ...prevPresenceStatus, [key]: !currentPresence }));
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
