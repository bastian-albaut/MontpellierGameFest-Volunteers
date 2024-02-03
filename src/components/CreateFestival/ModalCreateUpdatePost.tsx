import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import styles from "../../styles/components/createFestival/modalCreateUpdate.module.scss";
import { useEffect, useState } from "react";

// Modal with name and capacity into a form
const ModalCreateUpdatePost = (props: any) => {
    const [currentPost, setCurrentPost] = useState({ name: props.isUpdate ? props.objectToUpdate.name : "", capacityPoste: props.isUpdate ? props.objectToUpdate.capacityPoste : 1, description: props.isUpdate ? props.objectToUpdate.description : "" });

    // Update currentPost when props.objectToUpdate changes
    useEffect(() => {
        if(props.isUpdate) {
            setCurrentPost({ name: props.objectToUpdate.name, capacityPoste: props.objectToUpdate.capacityPoste, description: props.objectToUpdate.description });
        }
    }, [props.objectToUpdate, props.isUpdate])

    const handleAddPost = () => {
        setFormError("");

        // Check if name or description is not empty
        if(currentPost.name === "" || currentPost.description === "") {
            setFormError("Les champs ne peuvent pas être vides.");
            return;
        }

        // Check if name is not already taken
        if(props.dataPosts.find((post: any) => post.name === currentPost.name)) {
            setFormError("Le nom du poste est déjà pris.");
            return;
        }

        // Check if capacity is not negative or 0
        if(currentPost.capacityPoste <= 0) {
            setFormError("La capacité ne peut pas être négative ou nulle.");
            return;
        }

        const newPost = { id: props.dataPosts.length + 1, name: currentPost.name, capacityPoste: currentPost.capacityPoste, description: currentPost.description };
        props.setDataPosts([...props.dataPosts, newPost]);
        setCurrentPost({ name: "", capacityPoste: 1, description: "" });
        props.handleClose();
        props.handleShowAlertMessage(`Le poste "${currentPost.name}" a bien été créé.`, "success");
    };

    const handleUpdatePost = () => {
        setFormError("");

        // Check if name or description is not empty
        if(currentPost.name === "" || currentPost.description === "") {
            setFormError("Les champs ne peuvent pas être vides.");
            return;
        }

        // Check if name is not already taken
        if(props.dataPosts.find((post: any) => post.name === currentPost.name && post.id !== props.objectToUpdate.id)) {
            setFormError("Le nom du poste est déjà pris.");
            return;
        }

        // Check if capacity is not negative or 0
        if(currentPost.capacityPoste <= 0) {
            setFormError("La capacité ne peut pas être négative ou nulle.");
            return;
        }

        const updatedPost = { id: props.objectToUpdate.id, name: currentPost.name, capacityPoste: currentPost.capacityPoste, description: currentPost.description };
        props.setDataPosts(props.dataPosts.map((post: any) => post.id === updatedPost.id ? updatedPost : post));
        setCurrentPost({ name: "", capacityPoste: 1, description: "" });
        props.handleShowAlertMessage(`Le poste "${currentPost.name}" a bien été modifié.`, "success");
        props.handleClose();
        props.setIsUpdate(false);
    }

    const[formError, setFormError] = useState("");

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id={styles.boxModal}>
                {props.isUpdate ? (
                <Typography className={styles.typoTitle} variant="h3" color="initial">
                    Modification du poste
                </Typography>  
                ) : (
                <Typography className={styles.typoTitle} variant="h3" color="initial">
                    Création d'un poste
                </Typography>
                )}
                {formError !== "" && (
                    <Typography className={styles.typoFormError} variant="body1" color="error">{formError}</Typography>
                )}
                <TextField
                    className={styles.fieldForm}
                    label="Nom du poste"
                    variant="standard"
                    margin="dense"
                    onChange={(e) =>
                        setCurrentPost({ ...currentPost, name: e.target.value })
                    }
                    value={currentPost.name}
                    required
                />
                <TextField
                    className={styles.fieldForm}
                    label="Description du poste"
                    variant="standard"
                    margin="dense"
                    onChange={(e) =>
                        setCurrentPost({ ...currentPost, description: e.target.value })
                    }
                    value={currentPost.description}
                    multiline={true}
                    rows={4}
                    required
                />
                <TextField
                    className={styles.fieldForm}
                    label="Capacité"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    margin="dense"
                    onChange={(e) =>
                        setCurrentPost({ ...currentPost, capacityPoste: parseInt(e.target.value) })
                    }
                    value={currentPost.capacityPoste}
                    required
                />
                {props.isUpdate ? (
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleUpdatePost()}
                >
                    Modifier le poste
                </Button> 
                ) : (
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleAddPost()}
                >
                    Créer le poste
                </Button>
                )}
            </Box>
        </Modal>
    );
};

export default ModalCreateUpdatePost;