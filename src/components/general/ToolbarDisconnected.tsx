import React from "react";
import styles from "../../styles/components/general/toolbarDisconnected.module.scss"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { Login } from "@mui/icons-material";


export default function ToolbarDisconnected() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/connexion");
    }

    return(
        <AppBar position="sticky">
            <Toolbar id={styles.toolbar}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleLogin}
                >
                    <Login id={styles.icon}/>
                </IconButton>
                <Typography id={styles.typoTitle} variant="h6" component="div" color="text.primary">
                    Festival des jeux
                </Typography>
            </Toolbar>
        </AppBar>
    )
}