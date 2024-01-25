import { useEffect, useState } from "react";
import { getPosteById } from "../../api";
import styles from "../../styles/components/Poste/sectionposte.module.scss" 
import { Poste } from "../../types/Poste";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SectionPoste = (props: any) => {

    const [poste, setPoste] = useState<Poste | null>(null);
    const navigate = useNavigate();

    // Fetch the poste data from the api
    useEffect(() => {
        const fetchPoste = async () => {
            try {
                const res = await getPosteById(props.idPoste);
                if(res && res.data) {
                    setPoste(res.data);
                } else {
                    navigate("/", { state: { message: "Ce poste n'existe pas.", severity: "error" } });
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchPoste();     
    }, [props.idPoste, navigate]);

	return(
        <Box>
            <Typography variant="h3" color="initial">{poste?.name}</Typography>
        </Box>
	)
}

export default SectionPoste
