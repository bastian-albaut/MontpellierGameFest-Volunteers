import styles from "../../styles/components/Dashboard/sectiondasboardadmin.module.scss" 
import React from "react";
import { useEffect, useState } from "react";
import { getFestivals } from "../../api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "../general/Loading";

const SectionDasboardAdmin = () => {
	const [festivals, setFestivals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                const res = await getFestivals();
                if (res && res.data) {
                    console.log(res.data)
                    // Replace the idFestival attribute by id
                    res.data.forEach((festival: any) => {
                        festival.id = festival.idFestival;
                        delete festival.idFestival;
                    });
                    console.log(res.data)
                    setFestivals(res.data);
                } else {
                    console.error("Error fetching festivals");
                }
            } catch (error) {
                console.error("Error fetching festivals", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFestivals();
    }, []);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Nom du Festival", width: 170 },
        {
            field: "dateDebut",
            headerName: "Date de Début",
            width: 120,
            valueGetter: (params) => new Date(params.row.dateDebut).toLocaleDateString(),
        },
        {
            field: "dateFin",
            headerName: "Date de Fin",
            width: 120,
            valueGetter: (params) => new Date(params.row.dateFin).toLocaleDateString(),
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 250,
            renderCell: (params) => (
                <Box className={styles.actionCell}>
                    <Button  variant="contained" color="primary" size="small" onClick={() => handleEditClick(params.row.id)}>
                        <FontAwesomeIcon className={styles.iconActionCell} icon={faEdit} />
                        Modifier
                    </Button>
                    <Button  variant="contained" color="error" size="small" onClick={() => handleDeleteClick(params.row.id)}>
                        <FontAwesomeIcon className={styles.iconActionCell} icon={faTrash} />
                        Supprimer
                    </Button>
                </Box>
            ),
        },
    ];

    const handleEditClick = (festivalId: string) => {
        // Redirect to the edit page with the festivalId
        navigate(`/edit-festival/${festivalId}`);
    };

    const handleDeleteClick = (festivalId: string) => {
        // Implement your delete logic here
        console.log(`Deleting festival with ID ${festivalId}`);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box id={styles.festivalContainer}>
            <Typography id={styles.title} variant="h1" color="black">Tableau de bord</Typography>
            <Typography variant="h4" id={styles.listFestivalTitle}>Liste des Festivals</Typography>
            <Box id={styles.boxGrid}>
                <DataGrid
                    rows={festivals}
                    columns={columns}
                    checkboxSelection
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </Box>
        </Box>
    );
};

export default SectionDasboardAdmin
