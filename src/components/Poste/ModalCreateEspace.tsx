import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import styles from "../../styles/components/createFestival/modalCreateUpdate.module.scss";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addEspace, addPosteEspace } from "../../api";

// Modal with name and capacity into a form
const ModalCreateEspace = (props: any) => {

    const [currentEspace, setCurrentEspace] = useState({ name: "" });

    const [formError, setFormError] = useState("");

    const [isLoadingAddEspace, setIsLoadingAddEspace] = useState(false);

    const handleAddEspace = async () => {
        setIsLoadingAddEspace(true);

        if (currentEspace.name === "") {
            setFormError("Le nom de l'espace est obligatoire.");
            return;
        }
        try {
            // Insertion of the new espace
            const res = await addEspace(currentEspace)
            if (res && res.data) {
                console.log(res.data);
                // Insertion of PosteEspace
                const resPosteEspace = await addPosteEspace({ idPoste: props.idPoste, idEspace: res.data.idEspace });
                if (resPosteEspace && resPosteEspace.data) {
                    console.log(resPosteEspace.data);
                    props.setListEspaces([...props.listEspaces, { espace: { idEspace: res.data.idEspace, name: res.data.name } }]);
                    props.handleClose();
                    props.handleShowAlertMessage("Espace créé avec succès.", "success");
                } else {
                    props.handleClose();
                    props.handleShowAlertMessage("Une erreur est survenue lors de la création de l'espace.", "error");
                }
            } else {
                props.handleClose();
                props.handleShowAlertMessage("Une erreur est survenue lors de la création de l'espace.", "error");
            }
        } catch (error) {
            props.handleClose();
            props.handleShowAlertMessage("Une erreur est survenue lors de la création de l'espace.", "error");
        } finally {
            setIsLoadingAddEspace(false);
        }
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
                    Création d'un espace
                </Typography>
                {formError !== "" && (
                    <Typography className={styles.typoFormError} variant="body1" color="error">{formError}</Typography>
                )}
                <TextField
                    className={styles.fieldForm}
                    label="Nom de l'espace"
                    variant="standard"
                    margin="dense"
                    onChange={(e) =>
                        setCurrentEspace({ ...currentEspace, name: e.target.value })
                    }
                    value={currentEspace.name}
                    required
                />
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleAddEspace()}
                    disabled={isLoadingAddEspace}
                >
                    Créer l'espace
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalCreateEspace;