import { Box, Button, FormControl, Input, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Typography } from "@mui/material";
import styles from "../../styles/components/Poste/modalLinkGames.module.scss";
import { useEffect, useState } from "react";
import { addMultipleIsPlay, deleteIsPlay, getGames } from "../../api";
import Loading from "../general/Loading";

const ModalLinkGames = (props: any) => {

    const [listGames, setListGames] = useState<any[]>([]);
    const [formError, setFormError] = useState("");
    const [isLoadingAddGames, setIsLoadingAddGames] = useState(false);
    const [isLoadingFetchGames, setIsLoadingFetchGames] = useState(false);

    // Get the list of games in the database
    useEffect(() => {
        setIsLoadingFetchGames(true);
        const fetchGames = async () => {
            try {
                const res = await getGames();
                if(res && res.data) {
                    setListGames(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchGames();
        setIsLoadingFetchGames(false);
    }, []);

    const handleAddGames = async () => {
        setIsLoadingAddGames(true);

        if(listGamesSelected.length === 0) {
            setFormError("Vous devez sélectionner au moins un jeu.");
            setIsLoadingAddGames(false);
            return;
        }

        // Create an array with the id of the game selected, the id of the festival and the id of the espace
        const data = listGamesSelected.map((idGame: string) => {
            return {idGame, idFestival: parseInt(props.idFestival), idEspace: parseInt(props.espaceSelected.espace.idEspace)};
        });

        // Add insertion in IsPlay table for each game linked to the festival and the espace
        try {
        const resIsPlay = await addMultipleIsPlay(data);
        if(resIsPlay && resIsPlay.data) {
            // Remove the games that were already linked to the espace
            const gamesToRemove = listGamesSelectedOnInitialRender.filter((idGame: string) => !listGamesSelected.includes(idGame));
            const data = gamesToRemove.map((idGame: string) => {
                return {idGame, idFestival: parseInt(props.idFestival), idEspace: parseInt(props.espaceSelected.espace.idEspace)};
            });
            data.forEach((d: any) => {
                const res = deleteIsPlay(d);
                if(!res) {
                    props.handleShowAlertMessage("Une erreur est survenue lors de la suppression des jeux de l'espace.", "error");
                    props.handleClose();
                }
            });
            // Trigger a reRender of the list of games in the espace
            props.triggerRefresh();
            props.handleShowAlertMessage("La liste des jeux a bien été mise à jour.", "success");
            props.handleClose();
        } else {
            props.handleShowAlertMessage("Une erreur est survenue lors de l'ajout des jeux à l'espace.", "error");
            props.handleClose();
        } 
        } catch (error) {
            props.handleShowAlertMessage("Une erreur est survenue lors de l'ajout des jeux à l'espace.", "error");
            props.handleClose();
        } finally {
            setIsLoadingAddGames(false);
        }
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

    const [listGamesSelected, setListGamesSelected] = useState<any[]>([]);
    const [listGamesSelectedOnInitialRender, setListGamesSelectedOnInitialRender] = useState<any[]>([]);
    useEffect(() => {
        if(props.espaceSelected?.games) {
            setListGamesSelected(props.espaceSelected.games.map((game: any) => game.idGame));
            setListGamesSelectedOnInitialRender(props.espaceSelected.games.map((game: any) => game.idGame));
        }
    }, [props.espaceSelected]);

    const handleChange = (event: SelectChangeEvent<typeof listGamesSelected>) => {
        const {
            target: { value },
          } = event;
          setListGamesSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
    };

    
    // const [personName, setPersonName] = useState<any[]>([]);
    // const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    //   const {
    //     target: { value },
    //   } = event;
    //   setPersonName(
    //     // On autofill we get a stringified value.
    //     typeof value === 'string' ? value.split(',') : value,
    //   );
    // };

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
      ];
      
    if(isLoadingFetchGames) {
        return (
            <Loading />
        )
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id={styles.boxModal}>
                <Typography className={styles.typoTitle} variant="h3" color="initial">
                    Ajout de jeux à l'espace
                </Typography>
                {formError !== "" && (
                    <Typography className={styles.typoFormError} variant="body1" color="error">{formError}</Typography>
                )}
                <FormControl className={styles.formControl}>
                    <InputLabel id="labelMultipleSelect">Sélectionnez les jeux</InputLabel>
                    <Select
                        labelId="labelMultipleSelect"
                        multiple
                        value={listGamesSelected}
                        onChange={handleChange}
                        MenuProps={MenuProps}
                        label="Sélectionnez les jeux"
                        input={<Input />}
                    >
                    {listGames.map((game) => (
                            <MenuItem key={game.idGame} value={game.idGame}>
                                {game.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleAddGames()}
                    disabled={isLoadingAddGames}
                >
                    Mettre à jour la liste des jeux
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalLinkGames;