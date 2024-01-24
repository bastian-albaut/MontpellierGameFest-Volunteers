import { Box, CircularProgress, FormControlLabel, FormLabel, IconButton, Input, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography, Button, Checkbox } from "@mui/material";
import styles from "../../styles/components/SignupFestival/sectionsignupfestival.module.scss" 
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import useAlert from "../../hooks/useAlerts";
import { useNavigate, useParams } from "react-router-dom";
import { getFestival, getPostesByFestival } from "../../api";
import Loading from "../general/Loading";
import { Poste } from "../../types/Poste";

const SectionSignupFestival = () => {

    const [tshirt, setTshirt] = useState<string>("XS");

    const handleChangeTshirt = (event: SelectChangeEvent) => {
        setTshirt(event.target.value as string);
    };

    // Display loading during the apis calls
    const [loading, setLoading] = useState<boolean>(true);

    // Get festival id from url
    const { id } = useParams<{ id: string }>();

    // Get festival data from api
    const navigate = useNavigate();
    const [dataFestival, setDataFestival] = useState<any>();
    const [dataPosts, setDataPosts] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            let isFetchFestival = false;
            let isFetchPostes = false;
    
            try {
                const [festivalResponse, postesResponse] = await Promise.all([
                    getFestival(id!),
                    getPostesByFestival(id!)
                ]);
    
                if (festivalResponse && festivalResponse.data) {
                    // Format date
                    festivalResponse.data.dateDebut = formattedDate(festivalResponse.data.dateDebut);
                    festivalResponse.data.dateFin = formattedDate(festivalResponse.data.dateFin);
                    setDataFestival(festivalResponse.data);
                    isFetchFestival = true;
                    console.log(festivalResponse.data);
                } else {
                    navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
                }
    
                if (postesResponse && postesResponse.data) {
                    // Rename idPoste attribute to id
                    postesResponse.data.forEach((poste: any) => {
                        poste.id = poste.idPoste;
                        delete poste.idPoste;
                    });
                    setDataPosts(postesResponse.data);
                    isFetchPostes = true;
                    console.log(postesResponse.data);
                } else {
                    navigate("/", { state: { message: "Erreur pendant la récupération des postes du festival.", severity: "error" } });
                }
            } catch (error) {
                console.log(error);
                navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
            }
    
            // Set loading to false only if both fetch operations were successful
            if (isFetchFestival && isFetchPostes) {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id, navigate]);

    // Format date
    const formattedDate = (date: string) => {
        const originalDate = new Date(date);
        const day = originalDate.getUTCDate().toString().padStart(2, '0');
        const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = originalDate.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

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

    // Display alert message
    const { alertMessage, handleShowAlertMessage } = useAlert();

    const handleSelectCreneau = (params: any) => {
        // Get the current creneau id
        const idCreneau = parseInt(params.field.split("_")[1]);

        // Get the creneau/post selected
        const creneauPostItem = creneauPost.find(item => item.id_poste === params.row.id && item.id_creneau === idCreneau);
        
        // Handle if the creneau/post selected was already selected
        if(handleCreneauPostAlreadySelected(creneauPostItem, idCreneau)) {
            return;
        }
        
        // Handle if there was already a selection for this creneau
        handleCreneauAlreadySelected(idCreneau);

        // Increase currentCapacity
        if(creneauPostItem) {
            creneauPostItem.currentCapacity += 1;
        }

        // Disable all postes for this creneau except the current poste
        setCreneauPost(creneauPost.map(item => {
            if(item.id_creneau === idCreneau && item.id_poste !== params.row.id) {
                item.disabled = true;
            }
            return item;
        }
        ));

        // Update the current creneau/post selected as selected
        setCreneauPost(creneauPost.map(item => {
            if(item.id_creneau === idCreneau && item.id_poste === params.row.id) {
                item.selected = true;
            }
            return item;
        }
        ));
    }

    // Handle if the creneau/post selected was already selected
    const handleCreneauPostAlreadySelected = (creneauPostItem: any, idCreneau: number) => {
        if(creneauPostItem && creneauPostItem.selected) {
            // Decrease currentCapacity
            creneauPostItem.currentCapacity -= 1;

            // Update the current creneau/post selected as not selected
            creneauPostItem.selected = false;

            // Enable all postes for this creneau
            setCreneauPost(creneauPost.map(item => {
                if(item.id_creneau === idCreneau) {
                    item.disabled = false;
                }
                return item;
            }
            ));
            return true;
        }
        return false;
    }

    // Handle if there was already a selection for this creneau
    const handleCreneauAlreadySelected = (idCreneau: number) => {
        const creneauPostAlreadySelected = creneauPost.find(item => item.id_creneau === idCreneau && item.selected === true);
        if(creneauPostAlreadySelected) {
            // Decrease currentCapacity
            creneauPostAlreadySelected.currentCapacity -= 1;

            // Update the current creneau/post selected as not selected
            creneauPostAlreadySelected.selected = false;

            // Enable all postes for this creneau
            setCreneauPost(creneauPost.map(item => {
                if(item.id_creneau === idCreneau) {
                    item.disabled = false;
                }
                return item;
            }
            ));
        }
    }

    const handleIsFlexible = (idCreneau: number) => {
        // If the creneau is flexible, update all creneau/post for this creneau as not disabled
        if(dataCrenaux.find(item => item.id === idCreneau && item.isFlexible === true)) {
            setCreneauPost(creneauPost.map(item => {
                if(item.id_creneau === idCreneau) {
                    item.disabled = false;
                }
                return item;
            }
            ));
            // Update the current creneau as not flexible
            setDataCrenaux(dataCrenaux.map(item => {
                if(item.id === idCreneau) {
                    item.isFlexible = false;
                }
                return item;
            }
            ));
            return;
        }

        // Update the current creneau as flexible
        setDataCrenaux(dataCrenaux.map(item => {
            if(item.id === idCreneau) {
                item.isFlexible = true;
            }
            return item;
        }
        ));

        // Decrease the currentCapacity of the creneau/post selected
        const creneauPostItem = creneauPost.find(item => item.id_creneau === idCreneau && item.selected === true);
        if(creneauPostItem) {
            creneauPostItem.currentCapacity -= 1;
            creneauPostItem.selected = false;
        }

        // Update all creneau/post for this creneau as disabled
        setCreneauPost(creneauPost.map(item => {
            if(item.id_creneau === idCreneau) {
                item.disabled = true;
            }
            return item;
        }
        ));
    }

    const [dataCrenaux, setDataCrenaux] = useState([{id: 1, timeStart: "10:00", timeEnd: "12:00", isFlexible: false}, {id: 2, timeStart: "14:00", timeEnd: "16:00", isFlexible: false}, {id: 3, timeStart: "18:00", timeEnd: "20:00", isFlexible: false}, {id: 4, timeStart: "21:00", timeEnd: "22:00", isFlexible: false}, {id: 5, timeStart: "22:30", timeEnd: "23:30", isFlexible: false}]);
    const [creneauPost, setCreneauPost] = useState([{id: 1, id_poste: 1, id_creneau: 1, currentCapacity: 20, disabled: false, selected: false },
                                                    {id: 2, id_poste: 1, id_creneau: 2, currentCapacity: 19, disabled: false, selected: false },
                                                    {id: 3, id_poste: 1, id_creneau: 3, currentCapacity: 20, disabled: false, selected: false },
                                                    {id: 4, id_poste: 1, id_creneau: 4, currentCapacity: 3, disabled: false, selected: false },
                                                    {id: 5, id_poste: 1, id_creneau: 5, currentCapacity: 20, disabled: false, selected: false },
                                                    {id: 6, id_poste: 2, id_creneau: 1, currentCapacity: 14, disabled: false, selected: false },
                                                    {id: 7, id_poste: 2, id_creneau: 2, currentCapacity: 4, disabled: false, selected: false },
                                                    {id: 8, id_poste: 2, id_creneau: 3, currentCapacity: 10, disabled: false, selected: false },
                                                    {id: 9, id_poste: 2, id_creneau: 4, currentCapacity: 3, disabled: false, selected: false },
                                                    {id: 10, id_poste: 2, id_creneau: 5, currentCapacity: 20, disabled: false, selected: false },
                                                    {id: 11, id_poste: 3, id_creneau: 1, currentCapacity: 8, disabled: false, selected: false },
                                                    {id: 12, id_poste: 3, id_creneau: 2, currentCapacity: 7, disabled: false, selected: false },
                                                    {id: 13, id_poste: 3, id_creneau: 3, currentCapacity: 10, disabled: false, selected: false },
                                                    {id: 14, id_poste: 3, id_creneau: 4, currentCapacity: 8, disabled: false, selected: false },
                                                    {id: 15, id_poste: 3, id_creneau: 5, currentCapacity: 5, disabled: false, selected: false }]);
    
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
                // Check if the cell corresponding to the row flexible
                if(params.row.name === "Flexible") {
                    return (
                        <>
                        <Checkbox className={styles.checkbox} checked={creneau.isFlexible} onChange={() => handleIsFlexible(creneau.id)} />
                        </>
                    );
                }

              const creneauPostItem = creneauPost.find(item => item.id_poste === params.row.id && item.id_creneau === creneau.id);
              const capacityPoste = params.row.capacityPoste;
              // Check error
              if(creneauPostItem) {
                return (
                    <>
                    <IconButton aria-label="select" onClick={() => handleSelectCreneau(params)} disabled={(creneauPostItem.currentCapacity >= capacityPoste) || creneau.isFlexible}>
                        <Box id={styles.boxCircularProgress}>
                        <CircularProgress 
                            size={65} 
                            variant="determinate" 
                            value={creneauPostItem ? (creneauPostItem.currentCapacity / capacityPoste) * 100 : 0}
                            style={{
                                opacity: creneauPostItem.disabled ? 0.1 : 1,
                                color:
                                    creneauPostItem.currentCapacity >= capacityPoste
                                        ? "green"
                                        : creneauPostItem.currentCapacity >= capacityPoste / 2
                                        ? "orange"
                                        : creneauPostItem.currentCapacity >= capacityPoste / 3
                                        ? "#ffd500"
                                        : "red"
                            }}
                            thickness={8}
                        />
                        <Box id={styles.boxTextInsideCircularProgress}>
                            <Typography variant="body2" component="div" color="initial">
                            {creneauPostItem ? `${creneauPostItem.currentCapacity}/${capacityPoste}` : '0/X'}
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
    
    if(loading) {
        return <Loading />
    }

	return(
        <>
        {/* {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />} */}
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Inscription festival</Typography>
            <Box id={styles.infoFestival}>
                <Typography variant="h5" color="initial">{dataFestival.name}</Typography>
                <Typography variant="body1" color="initial">Du {dataFestival.dateDebut} au {dataFestival.dateFin}</Typography>
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
                <Typography id={styles.typoFlexible} variant="body1" color="initial">Le poste vous est égal ? Choisissez flexible pour le créneau correspondant.</Typography>
                <Button id={styles.buttonSignup} variant="contained" color="primary">Je m'inscris au festival</Button>
            </Box>
        </Box>
        </>
	)
}

export default SectionSignupFestival;
