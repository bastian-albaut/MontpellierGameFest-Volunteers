import { useEffect, useState } from "react";
import { getPosteById } from "../../api";
import styles from "../../styles/components/Poste/sectionposte.module.scss" 
import { Poste } from "../../types/Poste";
import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../general/Loading";

const SectionPoste = (props: any) => {

    const [poste, setPoste] = useState<Poste | null>(null);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch the poste data from the api
    useEffect(() => {
        const fetchPoste = async () => {
            setIsLoadingFetch(true);
            try {
                const res = await getPosteById(props.idPoste);
                if(res && res.data) {
                    setPoste(res.data);
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

    if(isLoadingFetch) {
        return (
            <Loading />
        )
    }

	return (
    <Box className={styles.posteContainer}>
        <Typography variant="h4" className={styles.posteTitle}>{poste?.name}</Typography>
        <Typography variant="body1" className={styles.posteDescription}>Description du poste</Typography>
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
    </Box>
  );
}

export default SectionPoste
