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
import { modifyVolunteersFestival } from "../../api";
import { isVolunteer } from "../../types/IsVolunteer"


const Acceuil = (props: any) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [volunteers, setVolunteers] = useState<isVolunteer[]>([]);
 
    // Redirect to home page if not logged in
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);


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
    

    const columns: GridColDef[] = [
        { field: 'lastName', headerName: 'Nom', width: 130,  renderCell: (params) => params.row.user.lastName, },
        { field: 'firstName', headerName: 'Prénom', width: 130, renderCell: (params) => params.row.user.firstName, },
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
                <>
                    <input
                        type="checkbox"
                        checked={params.row.sizeTeeShirt != null}
                        onChange={(e) => handleTshirtChange(params.row, e.target.checked)}
                    />
                    {params.row.sizeTeeShirt ? `Taille: ${params.row.sizeTeeShirt.toUpperCase()}` : ''}
                </>
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

  
    const handleVegetarianChange = async (row: any, isVegetarian: boolean) => {
        const idFestival = row.idFestival;
        const idUser = row.idUser;
        const data = { isVege: isVegetarian };

        try {
            await modifyVolunteersFestival(idFestival, idUser, data);
            console.log(`Statut végétarien mis à jour : ${isVegetarian}`);

            // Mettre à jour l'état local pour refléter le changement
            setVolunteers(prevVolunteers =>
                prevVolunteers.map(volunteer =>
                    volunteer.idFestival === idFestival && volunteer.idUser === idUser
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
        let data: Partial<isVolunteer>;
    
        if (isChecked) {
            // Supposons que prompt() retourne une chaîne valide ou null si l'utilisateur annule.
            const sizeTeeShirt = prompt("Entrer la taille du t-shirt (XS, S, M, L, XL):");
            if (sizeTeeShirt) {
                data = { sizeTeeShirt };
            } else {
                // L'utilisateur a annulé : ne rien faire ou gérer différemment
                return;
            }
        } else {
            // Si la case est décochée, on ne veut pas inclure sizeTeeShirt
            data = {};
        }
    
        try {
            await modifyVolunteersFestival(idFestival, idUser, data);
            console.log(`T-shirt pour ${idUser} mis à jour : ${data.sizeTeeShirt || 'Non spécifié'}`);
    
            // Mettre à jour l'état local pour refléter le changement
            setVolunteers(prevVolunteers =>
                prevVolunteers.map(volunteer =>
                    volunteer.idFestival === idFestival && volunteer.idUser === idUser
                        ? { ...volunteer, ...data }
                        : volunteer
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour du t-shirt", error);
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
