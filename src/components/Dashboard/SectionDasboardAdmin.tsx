import styles from "../../styles/components/Dashboard/sectiondasboardadmin.module.scss" 
import React from "react";
import { useEffect, useState } from "react";
import { deleteFestival, getFestivals } from "../../api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "../general/Loading";
import ConfirmationDialog from "../general/ConfirmationDialog";

const SectionDasboardAdmin = (props: any) => {
	const [festivals, setFestivals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                const res = await getFestivals();
                if (res && res.data) {
                    // Replace the idFestival attribute by id
                    res.data.forEach((festival: any) => {
                        festival.id = festival.idFestival;
                        delete festival.idFestival;
                    });
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
            width: 130,
            renderCell: (params) => (
                <Box className={styles.actionCell}>
                    <Button variant="outlined" color="error" size="small" disabled={isLoadingDelete} onClick={(event) => handleDeleteClick(params.row.id, event)}>
                        <FontAwesomeIcon className={styles.iconActionCell} icon={faTrash} />
                        Supprimer
                    </Button>
                </Box>
            ),
        },
    ];

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedFestivalId, setSelectedFestivalId] = useState<string | null>(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const handleDeleteClick = (festivalId: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsConfirmationOpen(true);
        setSelectedFestivalId(festivalId);
    };

    const handleConfirmDelete = async () => {
        setIsConfirmationOpen(false);
        setIsLoadingDelete(true);
        try {
            if (selectedFestivalId) {
                const res = await deleteFestival(selectedFestivalId);
                if(res && res.data) {
                    setFestivals(festivals.filter((festival: any) => festival.id !== selectedFestivalId));
                    setSelectedFestivalId(null);
                    props.handleShowAlertMessage("Festival supprimé avec succès.", "success");
                } else {
                    props.handleShowAlertMessage("Erreur pendant la suppression du festival.", "error");
                }
            }
        } catch (error) {
            console.error("Error deleting festival", error);
            props.handleShowAlertMessage("Erreur pendant la suppression du festival.", "error");
        } finally {
            setIsLoadingDelete(false);
        }
    }

    const handleCancelDelete = () => {
        setIsConfirmationOpen(false);
        setSelectedFestivalId(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
        
        <Box id={styles.festivalContainer}>
            <Typography id={styles.title} variant="h1" color="black">Tableau de bord</Typography>
            <Box id={styles.boxListFestival}>
                <Box id={styles.boxUpperGrid}>
                    <Typography variant="h3" id={styles.listFestivalTitle}>Liste des Festivals</Typography>
                    <Button id={styles.buttonAddFestival} variant="contained" color="primary" disabled={isLoadingDelete} onClick={() => navigate("/festival/creation")}>Ajouter un festival</Button>
                </Box>
                <Box id={styles.boxGrid}>
                    <DataGrid
                        rows={festivals}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        onRowClick={(params) => {
                            navigate(`/festival/${params.id}`);
                        }}
                        sx={{
                            // disable cell selection style
                            '.MuiDataGrid-cell:focus': {
                              outline: 'none'
                            },
                            // pointer cursor on ALL rows
                            '& .MuiDataGrid-row:hover': {
                              cursor: 'pointer'
                            }
                          }}
                    />
                </Box>
            </Box>
        </Box>
        <ConfirmationDialog
            open={isConfirmationOpen}
            title="Confirmation de suppression"
            message="Êtes-vous sûr de vouloir supprimer ce festival ?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            />
        </>
    );
};

export default SectionDasboardAdmin
