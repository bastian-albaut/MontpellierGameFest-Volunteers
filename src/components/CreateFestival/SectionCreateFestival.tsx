import { Box, Button, TextField, Typography } from "@mui/material"
import styles from "../../styles/components/sectioncreatefestival.module.scss" 
import { useState } from "react"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ModalCreateUpdatePost from "./ModalCreateUpdatePost";

const SectionCreateFestival = () => {

    const [dataFestival, setDataFestival] = useState({name: "", dateDebut: dayjs(), dateFin: dayjs().add(1, 'day')})
    const [dataPosts, setDataPosts] = useState([])
    const [dataCreneau, setDataCreneau] = useState([{id: 1, timeStart: "", timeEnd: "", idFestival: ""}])

    const [isModalPostOpen, setIsModalPostOpen] = useState(false);
    const handleOpenModalPost = () => setIsModalPostOpen(true);
    const handleCloseModalPost = () => setIsModalPostOpen(false);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nom', width: 150 },
        { field: 'capacity', headerName: 'Capacité', width: 100 },
        { field: 'actions', headerName: 'Actions', width: 150, sortable: false },
    ];
    return(
        <>
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Créer un festival</Typography>
            <Box id={styles.boxForm}>
                <TextField className={styles.fieldForm} label="Nom du festival" variant="standard" margin="dense" onChange={(e) => setDataFestival({...dataFestival, name: e.target.value})} required/>
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
        <ModalCreateUpdatePost open={isModalPostOpen} handleClose={handleCloseModalPost} dataPosts={dataPosts} setDataPosts={setDataPosts} />
        </>
	)
}

export default SectionCreateFestival
