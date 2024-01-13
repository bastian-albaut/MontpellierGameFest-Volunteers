import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { login } from '../../api';
import styles from "../../styles/components/loginRegister/sectionLogin.module.scss"

export default function Login(props: any) {
    const [data, setData] = useState({ email: '', password: '' });

    // Manage the login
    const handleSignIn = async () => {

        // Check if already loading
        if (props.isLoadingLoginRegister) {
            return;
        }

        // Set loading to true
        props.setIsLoadingLoginRegister(true);

        // Check if the fields are not empty
        if(data.email === '' || data.password === '') {
            props.handleShowAlertMessage("Erreur: Veuillez entrer votre adresse mail et votre mot de passe.", "error");
            props.setIsLoadingLoginRegister(false);
            return;
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(data.email)) {
            props.handleShowAlertMessage("Erreur: L'adresse mail n'est pas valide.", "error");
            props.setIsLoadingLoginRegister(false);
            return;
        }

        try {
            const res = await login(data);
            if(res && res.data) {
                props.validateSignIn(res.data.token, 'Vous êtes connecté avec succès !')
            }
        } catch(error) {
            console.log(error);
            if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
                props.handleShowAlertMessage(`Erreur: ${(error as any).response.data.message}`, "error");
            } else {
                props.handleShowAlertMessage('Une erreur s\'est produite lors de la connexion.', "error");
            }
            props.setIsLoadingLoginRegister(false);
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
                <Button id={styles.buttonLogin} variant="contained" color="primary" onClick={handleSignIn} disabled={props.isLoadingLoginRegister}>Connexion</Button>
                <Button variant="text" color="secondary" onClick={(e) => props.setHaveAccount(false)} disabled={props.isLoadingLoginRegister}>Je n'ai pas de compte</Button>
            </Box>
        </Box>
    );
}