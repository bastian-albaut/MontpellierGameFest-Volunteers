import React, { useState, ChangeEvent, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button, InputLabel, FormControl, Input, MenuItem, ListItemText, Select } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from '../general/Alert';
import { useNavigate } from 'react-router-dom';
import FileInput from "../loginRegister/FileInput";


import { modifyUser } from '../../api';


const UserProfileComponent = () => {
    const { user } = useUser();
    const { alertMessage, handleShowAlertMessage } = useAlert();
    const navigate = useNavigate();
    const { reloadUserContext } = useUser();


	// Initialise l'état avec des valeurs par défaut
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        picture: '',
    });


    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({firstName: '', lastName: '', address: ' ', email: '', password: '', file: '', associations: [] });

    const handleFileSelect = async (file: any) => {
        setSelectedFile(file);
        const base64 = await convertBase64(file);
        setFormData({...formData, file: base64 as string})
    };

    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
          if (!file || !(file instanceof Blob)) {
            reject(new Error('Invalid file'));
            return;
          }
      
          const fileReader = new FileReader();
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
          };
      
          fileReader.readAsDataURL(file);
        });
      };



    // Met à jour l'état avec les informations de l'utilisateur après le rendu initial
    useEffect(() => {
        if (user) {
            setUserInfo({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                picture: user.picture,
            });
        }
    }, [user]);


	if (!user) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6">Vous devez être connecté pour voir cette page.</Typography>
            </Box>
        );
    }


	// Gère la mise à jour des champs de saisie
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    // Gère la sélection de la nouvelle photo
    const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Vous pouvez traiter le fichier ici si nécessaire
            // Assurez-vous de mettre à jour l'état avec le nouveau chemin de l'image
            setUserInfo({ ...userInfo, picture: URL.createObjectURL(file) });
        }
    };

    
	const handleSubmit = async () => {
        try {
            const userDataToUpdate = {
                id: user.id,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                address: userInfo.address,
                email: userInfo.email,
                picture: userInfo.picture,
            };
    
            // Appel à la fonction modifyUser avec les informations à mettre à jour
            const response = await modifyUser(userDataToUpdate); // Cela retourne AxiosResponse
    
            // Accéde aux données renvoyées via response.data
            const updatedUser = response.data; // Supposons que cela contienne l'utilisateur mis à jour

            if (response.status === 200) { // Vérifiez que la réponse est OK
                await reloadUserContext(); // Rafraîchit les informations de l'utilisateur dans le contexte
                handleShowAlertMessage("Les modifications ont été enregistrées avec succès.", "success");
            }
    
            // Utilise updatedUser pour accéder à vos propriétés
            setUserInfo({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                address: updatedUser.address,
                picture: updatedUser.picture,
            });

            // Affiche un message de succès
            handleShowAlertMessage("Les modifications ont été enregistrées avec succès.", "success");
    
            console.log('Informations mises à jour avec succès.');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations :', error);
        }
    };

    const handleBackToProfile = () => {
        navigate('/viewprofil'); 
    };
    
    /* Ajoutez un champ pour la sélection de la nouvelle photo
    <InputLabel htmlFor="profile-picture" className={styles.fileInputLabel}>
    Choisir une nouvelle photo de profil
    </InputLabel>
    <Input
        type="file"
        id="profile-picture"
        inputProps={{ accept: "image/*,.heic,.heif" }} 
        onChange={handlePictureChange}
        className={styles.fileInput}
    />
    */

    
    return (

		<Box className={styles.userProfile}>
            <Typography className={styles.userProfileTitle} variant="h4" gutterBottom>
                Modifie ton profil
            </Typography>

             {/* Affiche la photo de l'utilisateur */}
             {userInfo.picture && (
                <img
                    src={userInfo.picture}
                    alt="User"
                    style={{ width: '150px', height: '150px' }} 
                />
            )}

            <FileInput selectedFile={selectedFile} setSelectedFile={setSelectedFile} handleFileSelect={handleFileSelect} />

    
            <TextField
                label="Prénom"
                variant="outlined"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleChange}
                className={styles.userInfo}
            />
            <TextField
                label="Nom"
                variant="outlined"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleChange}
                className={styles.userInfo}
            />
            <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                className={styles.userInfo}
            />

            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}


			<Box display="flex" justifyContent="center" alignItems="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    className={styles.submitButton}
                    style={{ marginRight: '8px' }} 
                >
                    Valider les modifications
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackToProfile}
                    className={styles.backButton} 
                >
                    Retour au profil
                </Button>
            </Box>

            
        </Box>

		

    );


};
    
    

export default UserProfileComponent;
