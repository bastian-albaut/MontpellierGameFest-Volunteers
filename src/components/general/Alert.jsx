import React from "react";
import styles from "../../styles/components/general/alert.module.scss";
import { Alert, Box } from "@mui/material";

const AlertComponent = ({ message, severity }) => {
    return (
        <Box className={styles.boxAlert}>
            <Alert className={styles.alert} severity={severity}>{message}</Alert>
        </Box>
    );
}

export default AlertComponent;