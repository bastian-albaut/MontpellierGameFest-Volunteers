import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import {
    Button,
    TextField,
    InputAdornment,
    IconButton,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent, DialogContentText
} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useAlert from "../../hooks/useAlerts";
import { login,motsDePasseOublie } from '../../api';
import styles from "../../styles/components/loginRegister/sectionLogin.module.scss"
import AlertComponent from "../general/Alert";

export default function Login(props: any) {
    const [data, setData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [emailForReset, setEmailForReset] = useState('');

    const handleGoogleSignIn = () => {
        // Remplacez 'http://localhost:8080' par l'URL de base de votre backend si elle est différente
        window.location.href = 'https://montpellier-game-fest-volunteers-api-vincentdub2.vercel.app/auth/google';
    };

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
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleForgotPassword = () => {
        // Here, add logic to handle forgotten password, like opening a dialog or redirecting to a reset password page
        handleOpenDialog();
    };

    const handleSubmitForgotPassword = async () => {
        // Logic to handle submission of email for password reset
        try {
            await motsDePasseOublie(emailForReset);
        }catch (error) {
            console.log(error);
            if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
                props.handleShowAlertMessage(`Erreur: ${(error as any).response.data.message}`, "error");
            } else {
                props.handleShowAlertMessage('Une erreur s\'est produite lors de la connexion.', "error");
            }
            handleCloseDialog();
            return;
        }
        props.handleShowAlertMessage("Un e-mail de réinitialisation de mot de passe a été envoyé à l'adresse e-mail spécifiée.", "success");
        handleCloseDialog();
        // Call an API to initiate the password reset process
    };

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
                <Typography id={styles.forgotPassword} variant="body2" color="black" onClick={handleForgotPassword}>Mot de passe oublié ?</Typography>
                {/* Forgot Password Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Mot de passe oublié</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pour réinitialiser votre mot de passe, veuillez entrer votre adresse e-mail ici.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Adresse e-mail"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={emailForReset}
                            onChange={(e) => setEmailForReset(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Annuler</Button>
                        <Button onClick={handleSubmitForgotPassword}>Envoyer</Button>
                    </DialogActions>
                </Dialog>
                <Button id={styles.buttonLogin} variant="contained" color="primary" onClick={handleSignIn} disabled={props.isLoadingLoginRegister} size="medium">Connexion</Button>
                <Button id={styles.googleLogin} variant="outlined" color="primary" onClick={handleGoogleSignIn} disabled={props.isLoadingLoginRegister} size="medium">
                    <FcGoogle className={styles.googleButton} />
                    Continuer avec Google
                </Button>
                <Button variant="text" color="secondary" onClick={(e) => props.setHaveAccount(false)} disabled={props.isLoadingLoginRegister}>Je n'ai pas de compte</Button>
            </Box>
        </Box>
    );
}