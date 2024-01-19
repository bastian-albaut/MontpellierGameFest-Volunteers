import { Box, CircularProgress, FormControlLabel, FormLabel, IconButton, Input, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from "@mui/material";
import styles from "../../styles/components/SignupFestival/sectionsignupfestival.module.scss" 
import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { Edit } from "@mui/icons-material";

const SectionSignupFestival = () => {

    const [tshirt, setTshirt] = useState<string>("XS");

    const handleChangeTshirt = (event: SelectChangeEvent) => {
        setTshirt(event.target.value as string);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            },
        },
    };

    const [dataCrenaux, setDataCrenaux] = useState([{id: 1, timeStart: "10:00", timeEnd: "12:00"}, {id: 2, timeStart: "14:00", timeEnd: "16:00"}, {id: 3, timeStart: "18:00", timeEnd: "20:00"}]);

    const handleSelectCreneau = (row: any) => {
        console.log(row);
    }

    // Define columns for the DataGrid that correspond to each creneau
    const columnsGrid: GridColDef[] = dataCrenaux.map((creneau) => ({
        field: `creneau_${creneau.id}`, // Unique field name for each creneau
        headerName: `${creneau.timeStart} - ${creneau.timeEnd}`, // Header name for each creneau
        width: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
        <>
            <IconButton aria-label="select" onClick={() => handleSelectCreneau(params.row)}>
            <CircularProgress size={20} color="inherit" />
            </IconButton>
            <Typography variant="body1" color="initial">X/Y</Typography>
        </>
        ),
    }));

	return(
        <>
        {/* {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />} */}
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Inscription festival</Typography>
            <Box id={styles.infoFestival}>
                <Typography variant="h5" color="initial">Festival 10</Typography>
                <Typography variant="body1" color="initial">Du 10/02/2024 au 14/02/2024</Typography>
            </Box>
            <Box id={styles.boxForm}>
                <Typography className={styles.titleSectionForm} variant="h3" color="initial">Informations personnelles</Typography>
                <InputLabel id="t-shirt">Taille de t-shirt</InputLabel>
                <Select className={styles.fieldForm} labelId="t-shirt" value={tshirt} label="Taille de t-shirt" onChange={handleChangeTshirt} input={<Input />} MenuProps={MenuProps} margin="dense">
                    <MenuItem value={"XS"}>XS</MenuItem>
                    <MenuItem value={"S"}>S</MenuItem>
                    <MenuItem value={"M"}>M</MenuItem>
                    <MenuItem value={"L"}>L</MenuItem>
                    <MenuItem value={"XL"}>XL</MenuItem>
                </Select>
                <FormLabel id="radio-button">Vegetarien</FormLabel>
                <RadioGroup aria-labelledby="radio-button" defaultValue="true" name="radio-buttons-group">
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                </RadioGroup>
                <Typography className={styles.titleSectionForm} variant="h3" color="initial">Choix des postes</Typography>
                <DataGrid
                    rows={dataCrenaux.map((creneau) => ({ ...creneau, id: creneau.id.toString() }))}
                    columns={columnsGrid}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </Box>
        </Box>
        </>
	)
}

export default SectionSignupFestival;
