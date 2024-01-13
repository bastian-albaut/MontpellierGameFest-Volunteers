import { Box, CircularProgress } from "@mui/material";
import styles from "../../styles/components/general/loading.module.scss";
import React from "react";

const Loading = () => {
    return (
        <Box className={styles.boxLoading}>
            <CircularProgress />
        </Box>
    );
}

export default Loading;