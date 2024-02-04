import React, { useEffect, useState } from "react";
import { getEspacesByPoste, getPosteById } from "../../api";
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

    const [poste, setPoste] = useState<Poste | null>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
    const [listEspaces, setListEspaces] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleEditEspace = (index: number) => {
        console.log("edit espace", index);
    }

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
                            setListEspaces(resEspaces.data);
                            console.log(resEspaces.data);
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
    }, [props.idPoste, navigate]);

    // Modal for create a new espace
    const [isEspaceModalOpen, setIsEspaceModalOpen] = useState(false);
    const handleOpenEspaceModal = () => setIsEspaceModalOpen(true);
    const handleCloseEspaceModal = () => setIsEspaceModalOpen(false);

    // Modal for link games to an espace
    const [isLinkGamesModalOpen, setIsLinkGamesModalOpen] = useState(false);
    const handleOpenLinkGamesModal = () => setIsLinkGamesModalOpen(true);
    const handleCloseLinkGamesModal = () => setIsLinkGamesModalOpen(false);

    if(isLoadingFetch) {
        return (
            <Loading />
        )
    }

	return (
    <Box className={styles.posteContainer}>
        <Typography variant="h4" className={styles.posteTitle}>{poste?.name}</Typography>
        <Typography variant="body1" className={styles.posteDescription}>{poste?.description}</Typography>
        <Typography variant="h6" className={styles.referentsTitle}>Référents:</Typography>
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
                    <Typography variant="h5">Espaces</Typography>
                </Box>
                <List>
                {listEspaces.map((espace, index) => (
                    <React.Fragment key={index}>
                        <ListItem className={styles.listItem}>
                            <ListItemText primary={espace.espace.name} />
                            <Button variant="outlined" color="success" size="small" onClick={() => handleEditEspace(index)}>
                                <FontAwesomeIcon className={styles.iconActionCell} icon={faEdit} />
                                Modifier
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteEspace(index)}>
                                <FontAwesomeIcon className={styles.iconActionCell} icon={faTrash} />
                                Supprimer
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Typography variant="subtitle1">Jeux:</Typography>
                            <List>
                                {/* {espace.games.map((game: any, gameIndex: number) => (
                                    <ListItem key={gameIndex}>
                                        <ListItemIcon>
                                            <FontAwesomeIcon icon={faGamepad} />
                                        </ListItemIcon>
                                        <ListItemText primary={game.name} />
                                    </ListItem>
                                ))} */}
                            </List>
                            <Button variant="text" color="primary" onClick={() => handleOpenLinkGamesModal()}>Ajouter des jeux</Button>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
                <Button id={styles.buttonAddEspace} variant="outlined" color="primary" onClick={() => handleOpenEspaceModal()}>Ajouter un espace</Button>
            </Box>
        )}
        <ModalCreateEspace idPoste={poste?.idPoste} handleShowAlertMessage={props.handleShowAlertMessage} open={isEspaceModalOpen} handleClose={handleCloseEspaceModal} listEspaces={listEspaces} setListEspaces={setListEspaces}/>
        <ModalLinkGames idPoste={poste?.idPoste} handleShowAlertMessage={props.handleShowAlertMessage} open={isLinkGamesModalOpen} handleClose={handleCloseLinkGamesModal} listEspaces={listEspaces} setListEspaces={setListEspaces}/>           
    </Box>
  );
}

export default SectionPoste
