import { useEffect, useState } from "react";
import { getEspacesByPoste, getPosteById } from "../../api";
import styles from "../../styles/components/Poste/sectionposte.module.scss" 
import { Poste } from "../../types/Poste";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../general/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import ModalCreateEspace from "./ModalCreateEspace";

const SectionPoste = (props: any) => {

    const [poste, setPoste] = useState<Poste | null>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
    const [listEspaces, setListEspaces] = useState<any[]>([]);
    const navigate = useNavigate();

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
                <Box className={styles.list}>
                    {listEspaces.map((espace, index) => {
                        return (
                            <Box key={index}>
                                <Typography variant="body1" color="initial">{espace.espace.name}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                <Button id={styles.buttonAddEspace} variant="outlined" color="primary" onClick={() => handleOpenModal()}>Ajouter un espace</Button>
            </Box>
        )}
        <ModalCreateEspace idPoste={poste?.idPoste} handleShowAlertMessage={props.handleShowAlertMessage} open={isModalOpen} handleClose={handleCloseModal} listEspaces={listEspaces} setListEspaces={setListEspaces}/>
    </Box>
  );
}

export default SectionPoste
