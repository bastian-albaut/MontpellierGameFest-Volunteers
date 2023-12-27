import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileInput from "./FileInput";
import styles from "../../styles/components/loginRegister/sectionRegister.module.scss"
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { register } from "../../api";
import { CheckBox } from "@mui/icons-material";
import { User } from "../../types/User";

export default function Register(props: any) {

    const [formData, setFormData] = useState({firstName: '', lastName: '', address: ' ', email: '', password: '', file: '', associations: [] });

    const [selectedFile, setSelectedFile] = useState(null);

    // Get all the associations on mount
    const [associations, setAssociations] = useState(["Women in Games France", "Push Start", "TrainHard Esport", "Terra"]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // TO DO
    //             // const res = await getAssociations();
    //             // if(res && res.data) {
    //             //     setAssociations(res.data);
    //             // }
    //         } catch(error) {
    //             console.log(error);
    //         }
    //     }
    //     fetchData();
    // }, [])

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
      

    const navigate = useNavigate();

    const setToken = (userToken: any) => {
        localStorage.setItem('token', JSON.stringify(userToken));
    }

    // Manage the register
    const handleSignUp = async (event: any) => {
        event.preventDefault();

        // Check if the fields are not empty
        if(formData.firstName === '' || formData.lastName === '' || formData.email === '' || formData.password === '') {
            props.handleShowAlertMessage("Veuillez remplir tous les champs.", "error");
            return;
        }

        // Check if the firstname is valid
        if(formData.firstName.length < 2) {
            props.handleShowAlertMessage("Le prénom doit contenir au moins 2 caractères.", "error");
            return;
        }

        // Check if the lastname is valid
        if(formData.lastName.length < 2) {
            props.handleShowAlertMessage("Le nom doit contenir au moins 2 caractères.", "error");
            return;
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)) {
            props.handleShowAlertMessage("L'adresse mail n'est pas valide.", "error");
            return;
        }
        
        // Check if the password is valid
        if(formData.password.length < 8) {
            props.handleShowAlertMessage("Le mot de passe doit contenir au moins 8 caractères.", "error");
            return;
        }

        // Create the user object
        const user: User = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: " ",
            email: formData.email,
            password: formData.password,
            file: formData.file,
        }

        // Register the user
        try {
            const res = await register(user);
            if (res && res.data) {
                props.validateSignUp('Vous êtes enregistré avec succès ! Veuillez vous connecter.');
            }
        } catch (error) {
            console.log(error);
            if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
                props.handleShowAlertMessage(`Erreur: ${(error as any).response.data.message}`, "error");
            } else {
                props.handleShowAlertMessage('Une erreur s\'est produite lors de l\'enregistrement.', "error");
            }
        }
    }

    // Visibility password
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    return (
        <Box id={styles.boxSection}>
            <Typography id={styles.typoTitle} variant="h3">Créer un compte</Typography>
            <form id={styles.boxFormRegister}>
                <TextField onChange={(e) => setFormData({...formData, firstName: e.target.value})} label="Prénom" variant="standard" margin="dense" required />
                <TextField onChange={(e) => setFormData({...formData, lastName: e.target.value})} label="Nom" variant="standard" margin="dense" required />
                <TextField onChange={(e) => setFormData({...formData, email: e.target.value})} label="Adresse mail" variant="standard" margin="dense" required />
                <TextField onChange={(e) => setFormData({...formData, password: e.target.value})} label="Mot de passe" variant="standard" margin="dense" required type={showPassword ? "text" : "password"} InputProps={{ // <-- This is where the toggle button is added.
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
                                                                                                                                                }}/>

                <FormControl id={styles.multipleSelect} sx={{ width: 300 }}>
                    <InputLabel id="multipleCheckboxLabel" sx={{ marginLeft: "-14px" }}>Associations</InputLabel>
                    <Select multiple value={formData.associations || []} onChange={(e) => setFormData({...formData, associations: e.target.value as never[]})} input={<Input />} labelId="multipleCheckboxLabel" renderValue={(selected) => selected.join(', ')} margin="dense" MenuProps={MenuProps}>
                    {associations.map((name) => (
                        <MenuItem key={name} value={name}>
                            {/* <CheckBox checked={formData.associations.indexOf(name) > -1} /> */}
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FileInput selectedFile={selectedFile} setSelectedFile={setSelectedFile} handleFileSelect={handleFileSelect} />
                <Button id={styles.buttonRegister} variant="contained" color="primary" type="submit" onClick={(event) => handleSignUp(event)}>S'inscrire</Button>
                <Button variant="text" color="secondary" onClick={(e) => props.setHaveAccount(true)}>J'ai déjà un compte</Button>
            </form>
        </Box>

    )
}