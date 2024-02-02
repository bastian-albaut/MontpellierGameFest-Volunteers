import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "../../styles/components/festival/modalImportGames.module.scss";
import FileInput from "./FileInput";
import { useState } from "react";
import { uploadFile } from "../../api";

// Modal with start hour and end hour into a form
const ModalImportGames = (props: any) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const[formError, setFormError] = useState("");

    const handleSendCsv = async () => {

        // Check if a file is selected
        if(!selectedFile) {
            setFormError("Veuillez sélectionner un fichier.");
            return;
        }

        try {
            const data = {file: selectedFile};
            console.log(data)
            const res = await uploadFile(data);
            if(res && res.data) {
                console.log(res.data);
            } else {
                console.log("Error");
            }
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="Import des jeux"
            aria-describedby="Import des jeux pour le festival"
        >
            <Box id={styles.boxModal}>
                <Typography className={styles.typoTitle} variant="h3" color="initial">
                    Import des jeux
                </Typography>
                <Typography className={styles.typoText} variant="body1" color="initial">
                    Vous pouvez importer un fichier CSV pour ajouter des jeux à ce festival.
                </Typography>
                {formError !== "" && (
                    <Typography className={styles.typoFormError} variant="body1" color="error">{formError}</Typography>
                )}
                <FileInput selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleSendCsv()}
                >
                    Importer le fichier CSV
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalImportGames;