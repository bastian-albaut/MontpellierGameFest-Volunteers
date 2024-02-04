import { Box, CircularProgress, FormControlLabel, FormLabel, IconButton, Input, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography, Button, Checkbox } from "@mui/material";
import styles from "../../styles/components/SignupFestival/sectionsignupfestival.module.scss" 
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import useAlert from "../../hooks/useAlerts";
import { useNavigate, useParams } from "react-router-dom";
import { addInscription, addVolunteer, getCreneauEspaceByCreneau, getCreneauxByFestival, getFestival, getPostesByFestival, updateCreneauEspace } from "../../api";
import Loading from "../general/Loading";
import { useUser } from "../../contexts/UserContext";
import { isVolunteer } from "../../types/IsVolunteer";
import AlertComponent from "../general/Alert";

const SectionSignupFestival = () => {

    const [sizeTeeShirt, setSizeTeeShirt] = useState<string>("XS");
    const [isVege, setIsVege] = useState(true);
    const handleChangeSizeTeeShirt = (event: SelectChangeEvent) => {
        setSizeTeeShirt(event.target.value);
    };

  const handleVegetarianChange = (event: SelectChangeEvent) => {
    setIsVege(event.target.value === "true" ? true : false);
  };

    // Display loadingGetData during the apis calls
    const [loadingGetData, setloadingGetData] = useState<boolean>(true);

    // Get festival id from url
    const { id } = useParams<{ id: string }>();

    // Get festival data from api
    const navigate = useNavigate();
    const [dataFestival, setDataFestival] = useState<any>();
    const [dataPosts, setDataPosts] = useState<any>();
    const [dataCreneaux, setDataCreneaux] = useState<any>([]);
    const [dataCreneauxEspaces, setDataCreneauxEspaces] = useState<any>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            let isFetchFestival = false;
            let isFetchPostes = false;
            let isFetchCreneaux = false;
    
            try {
                const [festivalResponse, postesResponse, creneauxResponse] = await Promise.all([
                    getFestival(id!),
                    getPostesByFestival(id!),
                    getCreneauxByFestival(id!)
                ]);

                console.log(creneauxResponse.data)
    
                if (festivalResponse && festivalResponse.data) {
                    // Format date
                    festivalResponse.data.dateDebut = formattedDate(festivalResponse.data.dateDebut);
                    festivalResponse.data.dateFin = formattedDate(festivalResponse.data.dateFin);
                    setDataFestival(festivalResponse.data);
                    isFetchFestival = true;
                } else {
                    navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
                }
    
                if (postesResponse && postesResponse.data) {
                    // Rename idPoste attribute to id
                    postesResponse.data.forEach((poste: any) => {
                        poste.id = poste.idPoste;
                        delete poste.idPoste;
                    });
                    // Add the flexible poste
                    postesResponse.data.push({id: 0, name: "Flexible", capacityPoste: 0});
                    setDataPosts(postesResponse.data);
                    isFetchPostes = true;
                } else {
                    navigate("/", { state: { message: "Erreur pendant la récupération des postes du festival.", severity: "error" } });
                }

                if (creneauxResponse && creneauxResponse.data) {

                    // Create an array that contains each creneau separated by date
                    const creneauxSeparated = creneauxResponse.data.reduce((acc: any, creneau: any) => {
                        const date = new Date(creneau.timeStart).toDateString();
                        // Format date
                        const dateFormatted = formattedDate(date);
                        if (!acc[dateFormatted]) {
                            acc[dateFormatted] = [];
                        }
                        acc[dateFormatted].push(creneau);
                        return acc;
                    }, {});

                    // Transform the object into an array of dates with creneaux
                    const creneauxArray = Object.entries(creneauxSeparated).map(([date, creneaux]) => ({
                        date,
                        creneaux,
                    }));

                    console.log(creneauxArray);
                    
                    if(creneauxArray) {

                        // Rename idCreneau attribute to id and format time
                        creneauxArray.forEach(async (dayCreneau: any) => {
                            dayCreneau.creneaux.forEach(async (creneau: any) => {
                                try {
                                    creneau.id = creneau.idCreneau;
                                    delete creneau.idCreneau;
                                    creneau.timeStart = formatTimeToHHMM(new Date(creneau.timeStart));
                                    creneau.timeEnd = formatTimeToHHMM(new Date(creneau.timeEnd));
                                    creneau.isFlexible = false;
                            
                                    const creneauEspaceResponse = await getCreneauEspaceByCreneau(creneau.id);
                            
                                    if (creneauEspaceResponse && creneauEspaceResponse.data) {
                                        const processedCreneauEspaces = creneauEspaceResponse.data.map((creneauEspace: any) => {
                                            creneauEspace.id = creneauEspace.idCreneauEspace;
                                            delete creneauEspace.idCreneauEspace;
                                            creneauEspace.selected = false;
                                            creneauEspace.disabled = false;
                                            return creneauEspace;
                                        });
                            
                                        // Use Promise.all to wait for all asynchronous operations to complete
                                        await Promise.all(processedCreneauEspaces.map(async (creneauEspace: any) => {
                                            setDataCreneauxEspaces((prevState: any) => {
                                                return [...prevState, creneauEspace];
                                            });
                                        }));

                                    } else {
                                        navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
                                    }
                                } catch (error) {
                                    console.error(`Error fetching CreneauEspaces for Creneau ${creneau.id}:`, error);
                                    navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
                                }
                            });
                        });
                        isFetchCreneaux = true;
                        setDataCreneaux(creneauxArray);
                    } 
                } else {
                    navigate("/", { state: { message: "Erreur pendant la récupération des créneaux du festival.", severity: "error" } });
                }
            } catch (error) {
                console.log(error);
                navigate("/", { state: { message: "Erreur pendant la récupération des informations du festival.", severity: "error" } });
            }
    
            // Set loadingGetData to false only if both fetch operations were successful
            if (isFetchFestival && isFetchPostes && isFetchCreneaux) {
                setloadingGetData(false);
            }
        };
    
        fetchData();
    }, []);

    // Format date
    const formattedDate = (date: string) => {
        const originalDate = new Date(date);
        const day = originalDate.getUTCDate().toString().padStart(2, '0');
        const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = originalDate.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    // Format time
    function formatTimeToHHMM(date: Date) {
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
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

    const { alertMessage, handleShowAlertMessage } = useAlert();

    const handleSelectCreneau = (params: any) => {
        // Get the current creneau id
        const idCreneau = parseInt(params.field.split("_")[1]);

        // Get the creneau/espace selected
        const creneauPostItem = dataCreneauxEspaces.find((item: any) => item.espace.name === params.row.name && item.idCreneau === idCreneau);
        
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
        setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
            if(item.idCreneau === idCreneau && item.espace.name !== params.row.name) {
                item.disabled = true;
            }
            return item;
        }
        ));

        // Update the current creneau/post selected as selected
        setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
            if(item.idCreneau === idCreneau && item.espace.name === params.row.name) {
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
            setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
                if(item.idCreneau === idCreneau) {
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
        const creneauPostAlreadySelected = dataCreneauxEspaces.find((item: any) => item.idCreneau === idCreneau && item.selected === true);
        if(creneauPostAlreadySelected) {
            // Decrease currentCapacity
            creneauPostAlreadySelected.currentCapacity -= 1;

            // Update the current creneau/post selected as not selected
            creneauPostAlreadySelected.selected = false;

            // Enable all postes for this creneau
            setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
                if(item.idCreneau === idCreneau) {
                    item.disabled = false;
                }
                return item;
            }
            ));
        }
    }

    const handleIsFlexible = (idCreneau: number, dayCreneau: any) => {
        // If the creneau is flexible
        if(dayCreneau.creneaux.find((item : any) => item.id === idCreneau && item.isFlexible === true)) {
            
            // Update all creneau/post for this creneau as not disabled
            setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
                if(item.idCreneau === idCreneau) {
                    item.disabled = false;
                }
                return item;
            }
            ));
            // Update the current creneau as not flexible
            const creneauToUpdate = dayCreneau.creneaux.find((creneau : any) => creneau.id === idCreneau);
            if(creneauToUpdate) {
                creneauToUpdate.isFlexible = false;
            }
            return;
        }

        // Update the current creneau as flexible
        const creneauToUpdate = dayCreneau.creneaux.find((creneau : any) => creneau.id === idCreneau);
        if(creneauToUpdate) {
            creneauToUpdate.isFlexible = true;
        }

        // Decrease the currentCapacity of the creneau/post selected
        const creneauPostItem = dataCreneauxEspaces.find((item: any) => item.idCreneau === idCreneau && item.selected === true);
        if(creneauPostItem) {
            creneauPostItem.currentCapacity -= 1;
            creneauPostItem.selected = false;
        }

        // Update all creneau/post for this creneau as disabled
        setDataCreneauxEspaces(dataCreneauxEspaces.map((item: any) => {
            if(item.idCreneau === idCreneau) {
                item.disabled = true;
            }
            return item;
        }
        ));
    }

    // Function to generate columns for a specific dayCreneau
    const generateColumns = (dayCreneau: any) => {
        return [
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
        ...dayCreneau.creneaux.map((creneau: any) => {
        return {
            field: `creneau_${creneau.id}`,
            headerName: `${creneau.timeStart} - ${creneau.timeEnd}`,
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
                // Check if the cell corresponds to the row flexible
                if (params.row.name === "Flexible") {
                    return (
                        <>
                            <Checkbox className={styles.checkbox} checked={creneau.isFlexible} onChange={() => handleIsFlexible(creneau.id, dayCreneau)} />
                        </>
                    );
                }

                const creneauPostItem = dataCreneauxEspaces.find((item: any) => item.espace.name === params.row.name && item.idCreneau === creneau.id);
                const capacityPoste = params.row.capacityPoste;

                // Check error
                if (creneauPostItem) {
                    return (
                        <>
                            <IconButton aria-label="select" onClick={() => handleSelectCreneau(params)} disabled={(creneauPostItem.currentCapacity >= capacityPoste) || creneau.isFlexible}>
                                <Box id={styles.boxCircularProgress}>
                                    <CircularProgress
                                        size={65}
                                        variant="determinate"
                                        value={
                                            creneauPostItem.currentCapacity > 0
                                                ? (creneauPostItem.currentCapacity / capacityPoste) * 100
                                                : 0.1
                                        }
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
                                            {`${creneauPostItem.currentCapacity}/${capacityPoste}`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </IconButton>
                        </>
                    );
                }
                return (
                    <CircularProgress />
                );
            },
        };
    })
    ]};

    // Disable the signup button during the signup process
    const [signupInprogress, setSignupInprogress] = useState<boolean>(false);
    const { user, loading} = useUser();

    const handleSignup = async () => {
        // Disable the signup button during the signup process
        setSignupInprogress(true);

        // Check if the user selected at least one creneau/post or one flexible creneau
        const creneauPostSelected = dataCreneauxEspaces.find((item: any) => item.selected === true);
        const flexibleCreneauSelected = dataCreneaux.find((item: any) => item.isFlexible === true);
        if(!creneauPostSelected && !flexibleCreneauSelected) {
            handleShowAlertMessage("Vous devez sélectionner au moins un créneau.", "error");
            return;
        }

        // Check if each creneau/post selected is not already full
        const creneauPostSelectedFull = dataCreneauxEspaces.find((item: any) => item.selected === true && item.currentCapacity >= item.capacityPoste);
        if(creneauPostSelectedFull) {
            handleShowAlertMessage("Un des créneaux sélectionnés est déjà complet.", "error");
            return;
        }

        try {
            const data : isVolunteer = {sizeTeeShirt: sizeTeeShirt, isVege: isVege, idUser: user?.id?.toString()!, idFestival: parseInt(id!)};
            const res = await addVolunteer(data);
            if(res && res.data) {

                // Get all the creneauxEspaces selected by the user
                console.log(dataCreneauxEspaces)
                let dataInscription = dataCreneauxEspaces.filter((item: any) => item.selected === true).map((item: any) => {
                    return {idCreneauEspace: item.id, idUser: user?.id?.toString()!, currentCapacity: item.currentCapacity};
                });

                // Get all flexible creneaux selected by the user
                const flexibleCreneaux = dataCreneaux.filter((item: any) => item.isFlexible === true);

                // Get all creneauxEspaces for flexible creneaux
                const flexibleCreneauxEspaces = dataCreneauxEspaces.filter((item: any) => flexibleCreneaux.find((creneau: any) => creneau.id === item.idCreneau));

                // Add to dataInscription flexibleCreneauxEspaces
                dataInscription = dataInscription.concat(flexibleCreneauxEspaces.map((item: any) => {
                    return {idCreneauEspace: item.id, idUser: user?.id?.toString()!, currentCapacity: item.currentCapacity, isFlexible: true};
                }));
                
                // Remove duplicates
                dataInscription = dataInscription.filter((item: any, index: any, self: any) =>
                    index === self.findIndex((t: any) => (
                        t.idCreneauEspace === item.idCreneauEspace
                    ))
                );

                console.log(dataInscription)

                // For each dataInscription, update in CreneauEspace table the currentCapacity
                const resCreneauEspace = await Promise.all(dataInscription.map(async (item: any) => {
                    const res = await updateCreneauEspace(item.idCreneauEspace, {currentCapacity: item.currentCapacity});
                    return res;
                }));

                if(!resCreneauEspace) {
                    handleShowAlertMessage("Erreur pendant l'inscription au festival.", "error");
                    return;
                }

                // For each dataInscription, insert in Inscription table the idUser, the idCreneauEspace and eventually the isFlexible
                const resInscription = await Promise.all(dataInscription.map(async (item: any) => {
                    delete item.currentCapacity;
                    const res = await addInscription(item);
                    return res;
                }));

                if(resInscription) {
                    handleShowAlertMessage("Inscription au festival réussie.", "success");
                } else {
                    handleShowAlertMessage("Erreur pendant l'inscription au festival.", "error");
                }
            } else {
                handleShowAlertMessage("Erreur pendant l'inscription au festival.", "error");
            }
        } catch (error) {
            console.log(error);
            handleShowAlertMessage("Erreur pendant l'inscription au festival.", "error");
        } finally {
            setSignupInprogress(false);
        }
    }

    if(loadingGetData|| loading) {
        return <Loading />
    }

	return(
        <>
        {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Inscription festival</Typography>
            <Box id={styles.infoFestival}>
                <Typography variant="h5" color="initial">{dataFestival.name}</Typography>
                <Typography variant="body1" color="initial">Du {dataFestival.dateDebut} au {dataFestival.dateFin}</Typography>
            </Box>
            <Box id={styles.boxForm}>
                <Typography className={styles.titleSectionForm} variant="h3" color="initial">Informations personnelles</Typography>
                <InputLabel id="t-shirt">Taille de t-shirt</InputLabel>
                <Select className={styles.fieldForm} labelId="t-shirt" value={sizeTeeShirt} label="Taille de t-shirt" onChange={handleChangeSizeTeeShirt} input={<Input />} MenuProps={MenuProps} margin="dense">
                    <MenuItem value={"XS"}>XS</MenuItem>
                    <MenuItem value={"S"}>S</MenuItem>
                    <MenuItem value={"M"}>M</MenuItem>
                    <MenuItem value={"L"}>L</MenuItem>
                    <MenuItem value={"XL"}>XL</MenuItem>
                </Select>
                <FormLabel id="radio-button">Vegetarien</FormLabel>
                <RadioGroup aria-labelledby="radio-button" name="radio-buttons-group" value={isVege} onChange={handleVegetarianChange}>
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                </RadioGroup>
                <Typography className={styles.titleSectionForm} variant="h3" color="initial">Choix des postes</Typography>
                <Typography id={styles.typoFlexible} variant="body1" color="initial">Le poste vous est égal ? Choisissez flexible pour le créneau correspondant.</Typography>
                {dataCreneaux.map((dayCreneau: any, index: number) => (
                <Box id={styles.boxGrid} key={index}>
                    <Typography variant="h6" color="initial">{dayCreneau.date}</Typography>
                    <DataGrid
                    key={index}
                    rowHeight={90}
                    rows={dataPosts}
                    columns={generateColumns(dayCreneau)}
                    pageSizeOptions={[dataPosts.length]}
                    />
                </Box>
                ))}
                <Button id={styles.buttonSignup} variant="contained" color="primary" onClick={() => handleSignup()} disabled={signupInprogress}>Je m'inscris au festival</Button>
            </Box>
        </Box>
        </>
	)
}

export default SectionSignupFestival;
