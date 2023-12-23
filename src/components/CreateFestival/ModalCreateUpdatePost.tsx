import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import styles from "../../styles/components/modalCreateUpdatePost.module.scss";
import { useEffect, useState } from "react";

// Modal with name and capacity into a form
const ModalCreateUpdatePost = (props: any) => {
    const [currentPost, setCurrentPost] = useState({ name: props.isUpdate ? props.objectToUpdate.name : "", capacity: props.isUpdate ? props.objectToUpdate.capacity : 1 });

    // Update currentPost when props.objectToUpdate changes
    useEffect(() => {
        if(props.isUpdate) {
            setCurrentPost({ name: props.objectToUpdate.name, capacity: props.objectToUpdate.capacity });
        }
    }, [props.objectToUpdate, props.isUpdate])

    const handleAddPost = () => {
        // Check if name is not empty
        if(currentPost.name === "") {
            // TODO: display error message
            return;
        }

        // Check if name is not already taken
        if(props.dataPosts.find((post: any) => post.name === currentPost.name)) {
            // TODO: display error message
            return;
        }

        // Check if capacity is not negative or 0
        if(currentPost.capacity <= 0) {
            // TODO: display error message
            return;
        }

        const newPost = { id: props.dataPosts.length + 1, name: currentPost.name, capacity: currentPost.capacity};
        props.setDataPosts([...props.dataPosts, newPost]);
        setCurrentPost({ name: "", capacity: 1 });
        props.handleClose();
    };

    const handleUpdatePost = () => {
        // Check if name is not empty
        if(currentPost.name === "") {
            // TODO: display error message
            return;
        }

        // Check if name is not already taken
        if(props.dataPosts.find((post: any) => post.name === currentPost.name && post.id !== props.objectToUpdate.id)) {
            // TODO: display error message
            return;
        }

        // Check if capacity is not negative or 0
        if(currentPost.capacity <= 0) {
            // TODO: display error message
            return;
        }

        const updatedPost = { id: props.objectToUpdate.id, name: currentPost.name, capacity: currentPost.capacity};
        props.setDataPosts(props.dataPosts.map((post: any) => post.id === updatedPost.id ? updatedPost : post));
        setCurrentPost({ name: "", capacity: 1 });
        props.handleClose();
    }


    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id={styles.boxModal}>
                {props.isUpdate ? (
                <Typography variant="h3" color="initial">
                    Modification du poste
                </Typography>  
                ) : (
                <Typography variant="h3" color="initial">
                    Création d'un poste
                </Typography>
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
                    label="Capacité"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    margin="dense"
                    onChange={(e) =>
                        setCurrentPost({ ...currentPost, capacity: parseInt(e.target.value) })
                    }
                    value={currentPost.capacity}
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