import { Box, Button, Icon, IconButton, TextField, Typography } from "@mui/material"
import styles from "../../styles/components/sectioncreatefestival.module.scss" 
import { useEffect, useState } from "react"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs"
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender, GridValueGetterParams } from '@mui/x-data-grid';
import ModalCreateUpdatePost from "./ModalCreateUpdatePost";
import { Delete, Edit } from "@mui/icons-material";

const SectionCreateFestival = () => {

    const [dataFestival, setDataFestival] = useState({name: "", dateDebut: dayjs(), dateFin: dayjs().add(1, 'day')})
    const [dataPosts, setDataPosts] = useState([])
    const [dataCreneau, setDataCreneau] = useState([{id: 1, timeStart: "", timeEnd: "", idFestival: ""}])

    const [isModalPostOpen, setIsModalPostOpen] = useState(false);
    const handleOpenModalPost = () => setIsModalPostOpen(true);
    const handleCloseModalPost = () => setIsModalPostOpen(false);

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
        if(localStorage.getItem("dataFestival") !== null) {
            let dataFestival = JSON.parse(localStorage.getItem("dataFestival")!);

            // Convert JavaScript Date objects to dayjs objects
            dataFestival.dateDebut = dayjs(dataFestival.dateDebut);
            dataFestival.dateFin = dayjs(dataFestival.dateFin);
            
            setDataFestival(dataFestival)
        }
        if(localStorage.getItem("dataPosts") !== null) {
            let dataPosts = JSON.parse(localStorage.getItem("dataPosts")!);
            setDataPosts(dataPosts)
        }
        if(localStorage.getItem("dataCreneau") !== null) {
            let dataCreneau = JSON.parse(localStorage.getItem("dataCreneau")!);
            setDataCreneau(dataCreneau)
        }
    }, [])


    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nom', width: 150 },
        { field: 'capacity', headerName: 'Capacité', width: 100 },
        { 
            field: 'actions', 
            headerName: 'Actions', 
            width: 150, 
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
                <>
                    <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(params.row)}>
                        <Delete />
                    </IconButton>
                </>
            )
        },
    ];

    const [isUpdate, setIsUpdate] = useState(false);
    const [objectToUpdate, setObjectToUpdate] = useState({} as any);

    const handleEdit = (row: any) => {
        setIsUpdate(true);
        setObjectToUpdate(row);
        handleOpenModalPost();
    }

    const handleDelete = (row: any) => {
        const newDataPosts = dataPosts.filter((post: any) => post.id !== row.id);
        setDataPosts(newDataPosts);
    }

    return(
        <>
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Créer un festival</Typography>
            <Box id={styles.boxForm}>
                <TextField className={styles.fieldForm} label="Nom du festival" variant="standard" margin="dense" value={dataFestival.name} onChange={(e) => setDataFestival({...dataFestival, name: e.target.value})} required/>
                <DatePicker className={styles.fieldForm} label="Date de début" minDate={dayjs()} value={dataFestival.dateDebut || dayjs()} onChange={(e) => setDataFestival({...dataFestival, dateDebut: e || dayjs()})} />
                <DatePicker className={styles.fieldForm} label="Date de fin" minDate={dayjs().add(1, 'day')} value={dataFestival.dateFin} onChange={(e) => setDataFestival({...dataFestival, dateFin: e || dayjs()})} />
                <Box className={styles.boxTable}>
                    <Typography className={styles.titleTable} variant="h2" color="initial">Liste des postes</Typography>
                    <DataGrid
                        rows={dataPosts}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </Box>
                <Box className={styles.boxButtonTable}>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenModalPost()}>Ajouter un poste</Button>
                </Box>
                <Button id={styles.button} variant="contained" color="primary" onClick={() => console.log("création")}>Créer le festival</Button>
            </Box>
        </Box>
        <ModalCreateUpdatePost isUpdate={isUpdate} objectToUpdate={objectToUpdate} open={isModalPostOpen} handleClose={handleCloseModalPost} dataPosts={dataPosts} setDataPosts={setDataPosts} />
        </>
	)
}

export default SectionCreateFestival
