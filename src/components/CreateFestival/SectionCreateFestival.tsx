import { Box, Button, Icon, IconButton, TextField, Typography } from "@mui/material"
import styles from "../../styles/components/createFestival/sectioncreatefestival.module.scss" 
import { useEffect, useState } from "react"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs"
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender, GridValueGetterParams } from '@mui/x-data-grid';
import ModalCreateUpdatePost from "./ModalCreateUpdatePost";
import { Delete, Edit } from "@mui/icons-material";
import AlertComponent from "../general/Alert";
import useAlert from "../../hooks/useAlerts";
import ModalCreateUpdateCreneau from "./ModalCreateUpdateCreneau";
import { addMultipleCreneau, addMultiplePostes, createFestival } from "../../api";
import { useNavigate } from "react-router-dom";
import { Creneau } from "../../types/Creneau";

const SectionCreateFestival = () => {

    const [dataFestival, setDataFestival] = useState({name: "", dateDebut: dayjs(), dateFin: dayjs().add(1, 'day')})
    const [dataPosts, setDataPosts] = useState([])
    const [dataCreneau, setDataCreneau] = useState([])

    // Modal for create/update a post
    const [isModalPostOpen, setIsModalPostOpen] = useState(false);
    const handleOpenModalPost = () => setIsModalPostOpen(true);
    const handleCloseModalPost = () => setIsModalPostOpen(false);

    // Modal for create/update a creneau
    const [isModalCreneauOpen, setIsModalCreneauOpen] = useState(false);
    const handleOpenModalCreneau = () => setIsModalCreneauOpen(true);
    const handleCloseModalCreneau = () => setIsModalCreneauOpen(false);

    // Display alert message
    const { alertMessage, handleShowAlertMessage } = useAlert();

    // Save dataFestival, dataPosts and dataCreneau on local storage when they change
    useEffect(() => {
        // Prevent on first render
        if(dataFestival.name === "") return;
        
        // Convert dayjs objects to JavaScript Date objects
        const dataFestivalToStore = { ...dataFestival, dateDebut: dataFestival.dateDebut.toDate(), dateFin: dataFestival.dateFin.toDate()};

        localStorage.setItem("dataFestival", JSON.stringify(dataFestivalToStore));
        
    }, [dataFestival])

    useEffect(() => {
        // Prevent on first render
        if(dataPosts.length === 0) return;
        localStorage.setItem("dataPosts", JSON.stringify(dataPosts))
    }, [dataPosts])

    useEffect(() => {
        // Prevent on first render
        if(dataCreneau.length === 0) return;
        localStorage.setItem("dataCreneau", JSON.stringify(dataCreneau))
    }, [dataCreneau])

    // Get dataFestival, dataPosts and dataCreneau from local storage when the page is loaded
    useEffect(() => {
        let dataLoad = false;
        if (localStorage.getItem("dataFestival") !== null) {
            let dataFestival = JSON.parse(localStorage.getItem("dataFestival")!);

            // Convert JavaScript Date objects to dayjs objects
            dataFestival.dateDebut = dayjs(dataFestival.dateDebut);
            dataFestival.dateFin = dayjs(dataFestival.dateFin);

            setDataFestival(dataFestival);
            dataLoad = true;
        }
        if (localStorage.getItem("dataPosts") !== null) {
            let dataPosts = JSON.parse(localStorage.getItem("dataPosts")!);
            if (dataPosts.length > 0) {
                setDataPosts(dataPosts);
                dataLoad = true;
            }
        }
        if (localStorage.getItem("dataCreneau") !== null) {
            let dataCreneau = JSON.parse(localStorage.getItem("dataCreneau")!);
            if (dataCreneau.length > 0) {
                setDataCreneau(dataCreneau);
                dataLoad = true;
            }
        }
        if(dataLoad) {
            handleShowAlertMessage("Votre dernière sauvegarde a été récupéré.", "success");
        }
    }, [])

    // Define columns for the DataGrid of posts
    const columnsPosts: GridColDef[] = [
        { field: 'name', headerName: 'Nom', width: 200 },
        { field: 'description', headerName: 'Description', width: 300, },
        { field: 'capacityPoste', headerName: 'Capacité', width: 100 },
        { 
            field: 'actions', 
            headerName: 'Actions', 
            width: 100, 
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
                <>
                    <IconButton aria-label="edit" onClick={() => handleEditPost(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeletePost(params.row)}>
                        <Delete />
                    </IconButton>
                </>
            )
        },
    ];

    // Define columns for the DataGrid of creneaux
    const columnsCreneaux: GridColDef[] = [
        { field: 'timeStart', headerName: 'Heure de début', width: 150 },
        { field: 'timeEnd', headerName: 'Heure de fin', width: 150 },
        { 
            field: 'actions', 
            headerName: 'Actions', 
            width: 100, 
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
                <>
                    <IconButton aria-label="edit" onClick={() => handleEditCreneau(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteCreneau(params.row)}>
                        <Delete />
                    </IconButton>
                </>
            )
        },
    ];

    const [isUpdatePost, setIsUpdatePost] = useState(false);
    const [objectToUpdatePost, setObjectToUpdatePost] = useState({} as any);

    const [isUpdateCreneau, setIsUpdateCreneau] = useState(false);
    const [objectToUpdateCreneau, setObjectToUpdateCreneau] = useState({} as any);

    // Edit a post
    const handleEditPost = (row: any) => {
        setIsUpdatePost(true);
        setObjectToUpdatePost(row);
        handleOpenModalPost();
    }

    // Delete a post
    const handleDeletePost = (row: any) => {
        try {
            const newDataPosts = dataPosts.filter((post: any) => post.id !== row.id);
            setDataPosts(newDataPosts);
            // Remove the post from the localStorage
            localStorage.setItem("dataPosts", JSON.stringify(newDataPosts));
            handleShowAlertMessage(`Le poste "${row.name}" a bien été supprimé.`, "success");
        } catch (error) {
            handleShowAlertMessage(`Une erreur est survenue lors de la suppression du poste "${row.name}".`, "error");
        }
    }

    // Edit a creneau
    const handleEditCreneau = (row: any) => {
        setIsUpdateCreneau(true);
        setObjectToUpdateCreneau(row);
        handleOpenModalCreneau();
    }

    // Delete a creneau
    const handleDeleteCreneau = (row: any) => {
        try {
            const newDataCreneau = dataCreneau.filter((creneau: any) => creneau.id !== row.id);
            setDataCreneau(newDataCreneau);
            // Remove the creneau from the localStorage
            localStorage.setItem("dataCreneau", JSON.stringify(newDataCreneau));
            handleShowAlertMessage(`Le créneau "${row.timeStart} - ${row.timeEnd}" a bien été supprimé.`, "success");
        } catch (error) {
            handleShowAlertMessage("Une erreur est survenue lors de la suppression du créneau", "error");
        }
    }

    
    // Create a festival
    const navigate = useNavigate();
    const [isLoadingCreateFestival, setIsLoadingCreateFestival] = useState(false);
    const handleCreateFestival = async () => {

        // Prevent multiple click
        setIsLoadingCreateFestival(true);

        // Check if there is a name
        if(dataFestival.name === "") {
            handleShowAlertMessage("Erreur: Veuillez entrer un nom pour le festival.", "error");
            setIsLoadingCreateFestival(false);
            return;
        }

        // Check if the dateDebut is after today
        if(dataFestival.dateDebut.isBefore(dayjs().subtract(1, 'day'))) {
            handleShowAlertMessage("Erreur: La date de début ne peut pas être avant aujourd'hui.", "error");
            setIsLoadingCreateFestival(false);
            return;
        }

        // Check if the dateDebut is before the dateFin
        if(dataFestival.dateDebut.isAfter(dataFestival.dateFin)) {
            handleShowAlertMessage("Erreur: La date de début doit être avant la date de fin.", "error");
            setIsLoadingCreateFestival(false);
            return;
        }

        // Check if there is at least one post
        if(dataPosts.length === 0) {
            handleShowAlertMessage("Erreur: Veuillez créer au moins un poste.", "error");
            setIsLoadingCreateFestival(false);
            return;
        }

        // Check if there is at least one creneau
        if(dataCreneau.length === 0) {
            handleShowAlertMessage("Erreur: Veuillez créer au moins un créneau.", "error");
            setIsLoadingCreateFestival(false);
            return;
        }

        try {
            // Create the festival
            const festivalToCreate = { ...dataFestival, dateDebut: dataFestival.dateDebut.toDate(), dateFin: dataFestival.dateFin.toDate(), address: "Corum", city: "Montpellier", postalCode: "34000", country: "France", isActive: true};
            console.log(festivalToCreate);

            const res = await createFestival(festivalToCreate);
            if(res && res.data) {
                // Handle the creation of the postes and creneaux for the festival
                const idFestival = res.data.idFestival;
                const isPostesCreated = await handlePostesCreation(idFestival);
                const isCreneauxCreated = await handleCreneauxCreation(idFestival);

                if(isPostesCreated && isCreneauxCreated) {
                    // Delete the data from the localStorage
                    localStorage.removeItem("dataFestival");
                    localStorage.removeItem("dataPosts");
                    localStorage.removeItem("dataCreneau");

                    // Redirect to the page of the festival
                    navigate(`/festival/${idFestival}`, { state: { message: "Le festival a bien été créé.", severity: "success" }});
                } else {
                    handleShowAlertMessage("Une erreur est survenue lors de la création du festival.", "error");
                }
            } else {
                handleShowAlertMessage("Une erreur est survenue lors de la création du festival.", "error");
            }
        } catch (error) {
            console.log(error);
            handleShowAlertMessage("Une erreur est survenue lors de la création du festival.", "error");
        } finally {
            setIsLoadingCreateFestival(false);
        }
    }

    // Create all the postes for the festival
    const handlePostesCreation = async (idFestival: number) => {
        try {
            const postesToCreate = dataPosts.map((post: any) => {
                const { id, ...postWithoutId } = post;
                return { ...postWithoutId, idFestival };
            });
            const res = await addMultiplePostes(postesToCreate);

            if(res && res.data) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Create all the creneaux for the festival
    const handleCreneauxCreation = async (idFestival: number) => {
        try {
            const creneauxToCreate : Creneau[] = dataCreneau.map((creneau: any) => {
                const { id, timeStart, timeEnd, ...newCreneau } = creneau;

                // Convert time strings to Date objects
                const formattedTimeStart = parseTimeStringToDate(timeStart);
                const formattedTimeEnd = parseTimeStringToDate(timeEnd);

                return { ...newCreneau, idFestival, timeStart: formattedTimeStart, timeEnd: formattedTimeEnd };
            });
            const res = await addMultipleCreneau(creneauxToCreate);
            if(res && res.data) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    const parseTimeStringToDate = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const currentDate = new Date();
        currentDate.setUTCHours(parseInt(hours, 10));
        currentDate.setUTCMinutes(parseInt(minutes, 10));
        return currentDate;
    };

    return(
        <>
        {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Créer un festival</Typography>
            <Box id={styles.boxForm}>
                <Box id={styles.generalInformations}>
                    <Typography className={styles.titleTable} variant="h3" color="initial">Informations générales</Typography>
                    <TextField className={styles.fieldForm} label="Nom du festival" variant="standard" margin="dense" value={dataFestival.name} onChange={(e) => setDataFestival({...dataFestival, name: e.target.value})} required/>
                    <DatePicker className={styles.fieldForm} label="Date de début"  minDate={dayjs()} value={dataFestival.dateDebut || dayjs()} onChange={(e) => setDataFestival({...dataFestival, dateDebut: e || dayjs()})} />
                    <DatePicker className={styles.fieldForm} label="Date de fin" minDate={dataFestival.dateDebut.add(1, 'day')} value={dataFestival.dateFin} onChange={(e) => setDataFestival({...dataFestival, dateFin: e || dayjs()})} />
                </Box>
                <Box className={styles.boxTablePoste}>
                    <Typography className={styles.titleTable} variant="h3" color="initial">Liste des postes</Typography>
                    {dataPosts.length === 0 ? (
                        <Typography className={styles.textTable} variant="body1" color="initial">Aucun poste pour le moment.</Typography>
                    ) : (
                        <DataGrid
                            rows={dataPosts}
                            columns={columnsPosts}
                            initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            }}
                            pageSizeOptions={[5, 10]}
                        />
                    )}
                </Box>
                <Box className={styles.boxButtonTable}>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenModalPost()} disabled={isLoadingCreateFestival}>Ajouter un poste</Button>
                </Box>
                <Box className={styles.boxTableCreneau}>
                    <Typography className={styles.titleTable} variant="h3" color="initial">Liste des créneaux</Typography>
                    {dataCreneau.length === 0 ? (
                        <Typography className={styles.textTable} variant="body1" color="initial">Aucun créneau pour le moment.</Typography>
                    ) : (
                        <DataGrid
                            rows={dataCreneau}
                            columns={columnsCreneaux}
                            initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            }}
                            pageSizeOptions={[5, 10]}
                        />
                    )}
                </Box>
                <Box className={styles.boxButtonTable}>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenModalCreneau()} disabled={isLoadingCreateFestival}>Ajouter un créneau</Button>
                </Box>
                <Button id={styles.button} variant="contained" color="primary" onClick={() => handleCreateFestival()} disabled={isLoadingCreateFestival}>Créer le festival</Button>
            </Box>
        </Box>
        <ModalCreateUpdatePost handleShowAlertMessage={handleShowAlertMessage} isUpdate={isUpdatePost} objectToUpdate={objectToUpdatePost} setIsUpdate={setIsUpdatePost} open={isModalPostOpen} handleClose={handleCloseModalPost} dataPosts={dataPosts} setDataPosts={setDataPosts} />
        <ModalCreateUpdateCreneau handleShowAlertMessage={handleShowAlertMessage} isUpdate={isUpdateCreneau} objectToUpdate={objectToUpdateCreneau} setIsUpdate={setIsUpdateCreneau} open={isModalCreneauOpen} handleClose={handleCloseModalCreneau} dataCreneau={dataCreneau} setDataCreneau={setDataCreneau} />
        </>
	)
}

export default SectionCreateFestival
