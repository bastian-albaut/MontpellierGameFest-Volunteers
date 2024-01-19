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

    const handleSelectCreneau = (row: any) => {
        console.log(row);
    }

    const [dataCrenaux, setDataCrenaux] = useState([{id: 1, timeStart: "10:00", timeEnd: "12:00"}, {id: 2, timeStart: "14:00", timeEnd: "16:00"}, {id: 3, timeStart: "18:00", timeEnd: "20:00"}, {id: 4, timeStart: "21:00", timeEnd: "22:00"}, {id: 5, timeStart: "22:30", timeEnd: "23:30"}]);
    const [dataPosts, setDataPosts] = useState([{id: 1, name: "Poste 1", capacity: 3}, {id: 2, name: "Poste 2", capacity: 2}, {id: 3, name: "Poste 3", capacity: 1}]);
    const [creneauPost, setCreneauPost] = useState([{id: 1, id_poste: 1, id_creneau: 1, currentCapacity: 4, maxCapacity: 5},
                                                    {id: 2, id_poste: 1, id_creneau: 2, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 3, id_poste: 1, id_creneau: 3, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 4, id_poste: 1, id_creneau: 4, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 4, id_poste: 1, id_creneau: 5, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 5, id_poste: 2, id_creneau: 1, currentCapacity: 1, maxCapacity: 5},
                                                    {id: 6, id_poste: 2, id_creneau: 2, currentCapacity: 4, maxCapacity: 5},
                                                    {id: 7, id_poste: 2, id_creneau: 3, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 8, id_poste: 2, id_creneau: 4, currentCapacity: 3, maxCapacity: 5},
                                                    {id: 9, id_poste: 2, id_creneau: 5, currentCapacity: 2, maxCapacity: 5},
                                                    {id: 10, id_poste: 3, id_creneau: 1, currentCapacity: 1, maxCapacity: 5},
                                                    {id: 11, id_poste: 3, id_creneau: 2, currentCapacity: 2, maxCapacity: 5},
                                                    {id: 12, id_poste: 3, id_creneau: 3, currentCapacity: 4, maxCapacity: 5},
                                                    {id: 13, id_poste: 3, id_creneau: 4, currentCapacity: 2, maxCapacity: 5},
                                                    {id: 14, id_poste: 3, id_creneau: 5, currentCapacity: 3, maxCapacity: 5}]);

    // Define columns for the DataGrid that correspond to each creneau
    const columnsGrid: GridColDef[] = [
        {
          field: 'poste',
          headerName: 'Poste',
          width: 150,
          sortable: false,
          renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => (
            <>
              <Typography variant="body1" color="initial"><strong>{params.row.name}</strong></Typography>
            </>
          ),
        },
        ...dataCrenaux.map((creneau) => {
          return {
            field: `creneau_${creneau.id}`,
            headerName: `${creneau.timeStart} - ${creneau.timeEnd}`,
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
              const creneauPostItem = creneauPost.find(item => item.id_poste === params.row.id && item.id_creneau === creneau.id);
              // Check error
              if(creneauPostItem && creneauPostItem.currentCapacity > params.row.capacity) {
                return (
                    <>
                    <IconButton aria-label="select" onClick={() => handleSelectCreneau(params.row)}>
                        <Box id={styles.boxCircularProgress}>
                        <CircularProgress 
                            size={65} 
                            variant="determinate" 
                            value={creneauPostItem ? (creneauPostItem.currentCapacity / creneauPostItem.maxCapacity) * 100 : 0}
                            color={
                                creneauPostItem.currentCapacity === creneauPostItem.maxCapacity
                                ? "success"
                                : creneauPostItem.currentCapacity >= creneauPostItem.maxCapacity / 2
                                ? "warning"
                                : creneauPostItem.currentCapacity >= creneauPostItem.maxCapacity / 3
                                ? "info"
                                : "error"
                            }
                            thickness={8}
                        />
                        <Box id={styles.boxTextInsideCircularProgress}>
                            <Typography variant="body2" component="div" color="initial">
                            {creneauPostItem ? `${creneauPostItem.currentCapacity}/${creneauPostItem.maxCapacity}` : '0/X'}
                            </Typography>
                        </Box>
                        </Box>
                    </IconButton>
                    </>
                );
                } 
                return (
                    <Typography variant="body1" color="initial">Erreur</Typography>
                );
            },
          };
        }),
      ];
    
    

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
                <Box id={styles.boxGrid}>
                    <DataGrid
                        rowHeight={90}
                        rows={dataPosts}
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
        </Box>
        </>
	)
}

export default SectionSignupFestival;
