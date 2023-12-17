import { Box, Button, TextField, Typography } from "@mui/material"
import styles from "../../styles/components/sectioncreatefestival.module.scss" 
import { useState } from "react"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs"

const SectionCreateFestival = () => {

    const [dataFestival, setDataFestival] = useState({name: "", dateDebut: dayjs(), dateFin: dayjs().add(1, 'day')})
    const [dataPosts, setDataPosts] = useState([{name: "", capacityPoste: "", idFestival: ""}])
    const [dataCreneau, setDataCreneau] = useState([{timeStart: "", timeEnd: "", idFestival: ""}])

    return(
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h3" color="black">Créer un festival</Typography>
            <Box id={styles.boxForm}>
                <TextField className={styles.fieldForm} label="Nom du festival" variant="standard" margin="dense" onChange={(e) => setDataFestival({...dataFestival, name: e.target.value})} required/>
                <DatePicker className={styles.fieldForm} label="Date de début" variant="standard" margin="dense" minDate={dayjs()} value={dataFestival.dateDebut} onChange={(e) => setDataFestival({...dataFestival, dateDebut: e})} />
                <DatePicker className={styles.fieldForm} label="Date de fin" variant="standard" margin="dense" minDate={dayjs().add(1, 'day')} value={dataFestival.dateFin} onChange={(e) => setDataFestival({...dataFestival, dateFin: e})} />
                <Button id={styles.button} variant="contained" color="primary" onClick={console.log("création")}>Créer le festival</Button>
            </Box>
        </Box>
	)
}

export default SectionCreateFestival
