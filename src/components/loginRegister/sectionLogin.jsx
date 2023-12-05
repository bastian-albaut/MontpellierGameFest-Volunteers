import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { login } from '../../api';
import styles from "../../styles/components/loginRegister/sectionLogin.module.scss"

export default function Login(props) {
    const [data, setData] = useState({ email: '', password: '' });

    const handleSignIn = async () => {

        if(data.email === '' || data.password === '') {
            props.handleShowError("Erreur: Veuillez entrer votre adresse mail et votre mot de passe.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(data.email)) {
            props.handleShowError("Erreur: L'adresse mail n'est pas valide.");
            return;
        }

        try {
            const res = await login(data);
            if(res && res.data) {
                props.validateSignIn(res.data.token, 'Vous êtes connecté avec succès !')
            }
        } catch(error) {
            if(error.code === "ERR_NETWORK") {
                props.handleShowError("Erreur: Serveur inaccessible.");
            } else if (error.response.data.message !== undefined) {
                props.handleShowError(`Erreur:${error.response.data.message}`);
            } else {
                props.handleShowError("Erreur: Une erreur est survenue.");
            }
        }
    }

    // Visibility password
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return(
        <Box id={styles.sectionSignIn}>
            
            <Box id={styles.boxSection}>
                <Typography id={styles.titleSignIn} variant="h3" color="black">Se connecter</Typography>
                <Box id={styles.boxFormSignIn}>
                    <TextField label="Adresse mail" variant="standard" margin="dense" onChange={(e) => setData({...data, email: e.target.value})}/>
                    <TextField type={showPassword ? "text" : "password"} label="Mot de passe" variant="standard" margin="dense" onChange={(e) => setData({...data, password: e.target.value})} InputProps={{ // <-- This is where the toggle button is added.
                                                                                                                                                                                                                endAdornment: (
                                                                                                                                                                                                                <InputAdornment position="end">
                                                                                                                                                                                                                    <IconButton
                                                                                                                                                                                                                        aria-label="toggle password visibility"
                                                                                                                                                                                                                        onClick={handleClickShowPassword}
                                                                                                                                                                                                                        onMouseDown={handleMouseDownPassword}
                                                                                                                                                                                                                    >
                                                                                                                                                                                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                                                                                                                                                                    </IconButton>
                                                                                                                                                                                                                </InputAdornment>
                                                                                                                                                                                                                )
                                                                                                                                                                                                            }}
                                                                                                                                                                                                            />
                </Box>
                <Button id={styles.buttonLogin} variant="contained" color="primary" onClick={handleSignIn}>Connexion</Button>
                <Button variant="text" color="secondary" onClick={(e) => props.setHaveAccount(false)}>Je n'ai pas de compte</Button>
            </Box>
        </Box>
    );
}