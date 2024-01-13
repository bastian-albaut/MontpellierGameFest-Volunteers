import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "../../styles/components/createFestival/modalCreateUpdate.module.scss";
import { useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

// Modal with start hour and end hour into a form
const ModalCreateUpdateCreneau = (props: any) => {

    const parseTimeString = (timeString: string) => {
        // set to the native format of dayjs which is YYYY-MM-DDTHH:mm:ss.SSSZ
        const time = dayjs(`2024-01-01T${timeString}:00.000Z`);
        return time;
    };

    const [currentCreneau, setCurrentCreneau] = useState({
        timeStart: props.isUpdate ? parseTimeString(props.objectToUpdate.timeStart) : dayjs().hour(0).minute(0).second(0).millisecond(0),
        timeEnd: props.isUpdate ? parseTimeString(props.objectToUpdate.timeEnd) : dayjs().hour(0).minute(0).second(0).millisecond(0),
    });

    useEffect(() => {
        if (props.isUpdate) {
            setCurrentCreneau({
                timeStart: parseTimeString(props.objectToUpdate.timeStart),
                timeEnd: parseTimeString(props.objectToUpdate.timeEnd),
            });
        }
    }, [props.objectToUpdate, props.isUpdate]);
    const handleAddCreneau = () => {
        setFormError("");

        // Check if there is not already a creneau that cross the new creneau
        if(props.dataCreneau.find((creneau: any) => (currentCreneau.timeStart >= creneau.timeStart && currentCreneau.timeStart < creneau.timeEnd) || (currentCreneau.timeEnd > creneau.timeStart && currentCreneau.timeEnd <= creneau.timeEnd))) {
            setFormError("Le creneau ne peut pas être en conflit avec un autre creneau.");
            return;
        }

        // Check if the end hour is after the start hour and not the same
        if(currentCreneau.timeEnd <= currentCreneau.timeStart) {
            setFormError("L'heure de fin doit être après l'heure de début.");
            return;
        }

        const newCreneau = { id: props.dataCreneau.length + 1, timeStart: currentCreneau.timeStart.format('HH:mm'), timeEnd: currentCreneau.timeEnd.format('HH:mm')};
        props.setDataCreneau([...props.dataCreneau, newCreneau].sort((a, b) => a.timeStart.localeCompare(b.timeStart)));
        setCurrentCreneau({ timeStart: dayjs().hour(0).minute(0).second(0).millisecond(0), timeEnd: dayjs().hour(0).minute(0).second(0).millisecond(0) });
        props.handleClose();
        props.handleShowAlertMessage(`Le creneau "${currentCreneau.timeStart.format('HH:mm')} - ${currentCreneau.timeEnd.format('HH:mm')}" a bien été créé.`, "success");
    };
    
    const handleUpdateCreneau = () => {
        setFormError("");
        
        // Check if there is not already a creneau that cross the updated creneau
        if(props.dataCreneau.find((creneau: any) => (currentCreneau.timeStart >= creneau.timeStart && currentCreneau.timeStart < creneau.timeEnd) || (currentCreneau.timeEnd > creneau.timeStart && currentCreneau.timeEnd <= creneau.timeEnd))) {
            setFormError("Le creneau ne peut pas être en conflit avec un autre creneau.");
            return;
        }

        // Check if the end hour is after the start hour and not the same
        if(currentCreneau.timeEnd <= currentCreneau.timeStart) {
            setFormError("L'heure de fin doit être après l'heure de début.");
            return;
        }

        const updatedCreneau = { id: props.objectToUpdate.id, timeStart: currentCreneau.timeStart.format('HH:mm'), timeEnd: currentCreneau.timeEnd.format('HH:mm')};
        props.setDataCreneau([...props.dataCreneau.filter((creneau: any) => creneau.id !== props.objectToUpdate.id), updatedCreneau].sort((a, b) => a.timeStart.localeCompare(b.timeStart)));
        setCurrentCreneau({ timeStart: dayjs().hour(0).minute(0).second(0).millisecond(0), timeEnd: dayjs().hour(0).minute(0).second(0).millisecond(0) });
        props.handleClose();
        props.handleShowAlertMessage(`Le creneau "${currentCreneau.timeStart.format('HH:mm')} - ${currentCreneau.timeEnd.format('HH:mm')}" a bien été modifié.`, "success");
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
                    Modification du creneau
                </Typography>  
                ) : (
                <Typography className={styles.typoTitle} variant="h3" color="initial">
                    Création d'un creneau
                </Typography>
                )}
                {formError !== "" && (
                    <Typography className={styles.typoFormError} variant="body1" color="error">{formError}</Typography>
                )}
                <TimePicker
                    className={styles.timePicker1}
                    label="Heure de début"
                    value={currentCreneau.timeStart}
                    onChange={(newTimeStart) => setCurrentCreneau({ ...currentCreneau, timeStart: newTimeStart! })}
                />
                <TimePicker
                    label="Heure de fin"
                    value={currentCreneau.timeEnd}
                    onChange={(newTimeEnd) => setCurrentCreneau({ ...currentCreneau, timeEnd: newTimeEnd! })}
                />
                {props.isUpdate ? (
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleUpdateCreneau()}
                >
                    Modifier le creneau
                </Button> 
                ) : (
                <Button
                    id={styles.button}
                    variant="text"
                    color="primary"
                    onClick={() => handleAddCreneau()}
                >
                    Créer le creneau
                </Button>
                )}
            </Box>
        </Modal>
    );
};

export default ModalCreateUpdateCreneau;