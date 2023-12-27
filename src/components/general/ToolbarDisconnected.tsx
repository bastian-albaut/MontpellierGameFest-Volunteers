import React from "react";
import styles from "../../styles/components/general/toolbarDisconnected.module.scss"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";


export default function ToolbarDisconnected() {

    const navigate = useNavigate();

    const handleBackHomepage = () => {
        navigate("/");
    }

    return(
        <AppBar position="sticky">
            <Toolbar id={styles.toolbar}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleBackHomepage}
                >
                    <ArrowBack id={styles.backIcon}/>
                </IconButton>
                <Typography id={styles.typoTitle} variant="h6" component="div" color="text.primary">
                    Festival des jeux
                </Typography>
            </Toolbar>
        </AppBar>
    )
}