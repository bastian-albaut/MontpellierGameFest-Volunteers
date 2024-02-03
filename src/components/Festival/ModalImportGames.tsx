import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "../../styles/components/festival/modalImportGames.module.scss";
import FileInput from "./FileInput";
import { useState } from "react";
import { addMultipleIsPlay, uploadFile } from "../../api";

// Modal with start hour and end hour into a form
const ModalImportGames = (props: any) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const[formError, setFormError] = useState("");
    const[isSending, setIsSending] = useState(false);

    const handleSendCsv = async () => {

        // Disable the button to avoid multiple click
        setIsSending(true);

        // Check if a file is selected
        if(!selectedFile) {
            setFormError("Veuillez sélectionner un fichier.");
            return;
        }

        // Check if the file is a CSV
        if((selectedFile as File).type !== "text/csv") {
            setFormError("Le fichier doit être au format CSV.");
            return;
        }

        try {
            const res = await uploadFile(selectedFile);
            if(res && res.data) {
                // const idGamesCreated = res.data.createdGames;

                // // Create an array with the id of the game created and the festivalId
                // const idGamesCreatedWithFestivalId = idGamesCreated.map((idGame: string) => {
                //     return {idGame, idFestival: parseInt(props.idFestival)};
                // });

                // // Add insertion in IsPlay table for each game created
                // const resIsPlay = await addMultipleIsPlay(idGamesCreatedWithFestivalId);
                // if(resIsPlay && resIsPlay.data) {
                    props.handleShowAlertMessage("Le fichier a bien été importé.", "success");
                    props.handleClose();
                // } else {
                //     props.handleShowAlertMessage("Une erreur est survenue lors de l'import du fichier.", "error");
                //     props.handleClose();
                // }
            } else {
                props.handleShowAlertMessage("Une erreur est survenue lors de l'import du fichier.", "error");
                props.handleClose();
            }
        } catch(error) {
            props.handleShowAlertMessage("Une erreur est survenue lors de l'import du fichier.", "error");
            props.handleClose();
        } finally {
            setIsSending(false);
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
                    disabled={isSending}
                >
                    Importer le fichier CSV
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalImportGames;