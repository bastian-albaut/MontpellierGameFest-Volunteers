import React, { useEffect, useState } from "react";
import { getEspacesByPoste, getIsPlayByEspaceAndFestival, getPosteById } from "../../api";
import styles from "../../styles/components/Poste/sectionposte.module.scss" 
import { Poste } from "../../types/Poste";
import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../general/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faLocationArrow, faGamepad } from "@fortawesome/free-solid-svg-icons";
import ModalCreateEspace from "./ModalCreateEspace";
import ModalLinkGames from "./ModalLinkGames";

const SectionPoste = (props: any) => {

    const [poste, setPoste] = useState<any>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [listEspaces, setListEspaces] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleDeleteEspace = (index: number) => {
        console.log("delete espace", index);
    }

    // Fetch the poste data from the api
    useEffect(() => {
        const fetchPoste = async () => {
            setIsLoadingFetch(true);
            try {
                const res = await getPosteById(props.idPoste);
                if(res && res.data) {
                    setPoste(res.data);

                    // If the poste is "Animation Jeux", fetch the list of espaces 
                    if(res.data.name === "Animation Jeux") {
                        const resEspaces = await getEspacesByPoste(res.data.idPoste);
                        if(resEspaces && resEspaces.data) {
                            // Fetch the list of games for each espace
                            for(let espace of resEspaces.data) {
                                const resGames = await getIsPlayByEspaceAndFestival(espace.idEspace, res.data.idFestival);
                                if(resGames && resGames.data) {
                                    // Add the list of games to the espace
                                    resEspaces.data.find((e: any) => e.idEspace === espace.idEspace).games = resGames.data;
                                    setListEspaces(resEspaces.data);
                                } else {
                                    console.log("no games");
                                }
                            }
                        }
                    }

                    setIsLoadingFetch(false);
                } else {
                    navigate("/", { state: { message: "Ce poste n'existe pas.", severity: "error" } });
                }
            } catch (error) {
                console.log(error);
                navigate("/", { state: { message: "Ce poste n'existe pas.", severity: "error" } });
            }
        }
        fetchPoste();     
    }, [props.idPoste, navigate, isRefresh]);

    // Modal for create a new espace
    const [isEspaceModalOpen, setIsEspaceModalOpen] = useState(false);
    const handleOpenEspaceModal = () => setIsEspaceModalOpen(true);
    const handleCloseEspaceModal = () => setIsEspaceModalOpen(false);

    // Modal for link games to an espace
    const [espaceSelected, setEspaceSelected] = useState<any>(null);
    const [isLinkGamesModalOpen, setIsLinkGamesModalOpen] = useState(false);
    const handleOpenLinkGamesModal = (espace: any) => {
        setIsLinkGamesModalOpen(true);
        setEspaceSelected(espace);
    }
    const handleCloseLinkGamesModal = () => setIsLinkGamesModalOpen(false);

    if(isLoadingFetch) {
        return (
            <Loading />
        )
    }

	return (
    <Box className={styles.posteContainer}>
        <Typography variant="h2" className={styles.posteTitle}>{poste?.name}</Typography>
        <Typography variant="body1" className={styles.posteDescription}>{poste?.description}</Typography>
        <Typography variant="h4" className={styles.referentsTitle}>Référents:</Typography>
        <Box className={styles.referentsList}>
            <Box className={styles.referent}>
                <Avatar alt="Alexandre Lagorce" src="/path/to/avatar1.jpg" />
                <Typography variant="subtitle1">Alexandre Lagorce</Typography>
            </Box>
            <Box className={styles.referent}>
                <Avatar alt="Vincent Dubuc" src="/path/to/avatar2.jpg" />
                <Typography variant="subtitle1">Vincent Dubuc</Typography>
            </Box>
        </Box>
        {poste?.name === "Animation Jeux" && (
            <Box className={styles.boxElements}>
                <Box className={styles.boxIconText}>
                    <FontAwesomeIcon icon={faLocationArrow} className={styles.icon}/>
                    <Typography variant="h4">Espaces</Typography>
                </Box>
                <List>
                {listEspaces.map((espace, index) => (
                    (espace.espace.name !== "Animation Jeux" && (
                    <React.Fragment key={index}>
                        <ListItem className={styles.listItem}>
                            <ListItemText primary={
                                <Typography variant="h5">
                                    {espace.espace.name}
                                </Typography>
                            }/>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteEspace(index)}>
                                <FontAwesomeIcon className={styles.iconActionCell} icon={faTrash} />
                                Supprimer
                            </Button>
                        </ListItem>
                            <ListItem className={styles.boxListGames}>
                                <Box className={styles.boxIconText}>
                                    <FontAwesomeIcon icon={faGamepad} />
                                    <Typography variant="h6">Liste des jeux</Typography>
                                </Box>
                                <Box className={styles.listGames}>
                                    {espace.games && espace.games.map((game: any, gameIndex: number) => (
                                        <Typography key={gameIndex} variant="body1" color="initial">{game.game.name}</Typography>
                                    ))}
                                </Box>
                                <Button variant="text" color="primary" onClick={() => handleOpenLinkGamesModal(espace)}>Ajouter/Supprimer des jeux</Button>
                            </ListItem>
                        <Divider />
                    </React.Fragment>
                    ))
                ))}
            </List>
                <Button id={styles.buttonAddEspace} variant="outlined" color="primary" onClick={() => handleOpenEspaceModal()}>Ajouter un espace</Button>
            </Box>
        )}
        <ModalCreateEspace idPoste={poste?.idPoste} handleShowAlertMessage={props.handleShowAlertMessage} open={isEspaceModalOpen} handleClose={handleCloseEspaceModal} listEspaces={listEspaces} setListEspaces={setListEspaces}/>
        <ModalLinkGames espaceSelected={espaceSelected} idFestival={poste?.idFestival} idPoste={poste?.idPoste} handleShowAlertMessage={props.handleShowAlertMessage} open={isLinkGamesModalOpen} handleClose={handleCloseLinkGamesModal} listEspaces={listEspaces} setListEspaces={setListEspaces} triggerRefresh={() => setIsRefresh(prev => !prev)}/>           
    </Box>
  );
}

export default SectionPoste