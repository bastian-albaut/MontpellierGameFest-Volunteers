import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileInput from "./FileInput";
import styles from "../../styles/components/loginRegister/sectionRegister.module.scss"
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { register, postResult } from "../../api";
import { CheckBox } from "@mui/icons-material";

export default function Register(props) {

    const [formData, setFormData] = useState({name: '', firstname: '', email: '', password: '', picture: '', associations: []});

    const [selectedFile, setSelectedFile] = useState(null);

    // Get all the associations on mount
    const [associations, setAssociations] = useState(["Women in Games France", "Push Start", "TrainHard Esport", "Terra"]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TO DO
                // const res = await getAssociations();
                // if(res && res.data) {
                //     setAssociations(res.data);
                // }
            } catch(error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    const handleFileSelect = async (file) => {
        setSelectedFile(file);
        const base64 = await convertBase64(file);
        setFormData({...formData, picture: base64})
    };

    const convertBase64 = (file) => {
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

    const setToken = (userToken) => {
        localStorage.setItem('token', JSON.stringify(userToken));
    }

    // Visibility password
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleSignUp = async (event) => {
        event.preventDefault();

        if(formData.email === '' || formData.password === '' || formData.firstname === '' || formData.lastname === '' || formData.file === '') {
            props.handleShowError("Veuillez remplir tous les champs.");
            return;
        }

        if(formData.password.length < 8) {
            props.handleShowError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if(formData.firstname.length < 2) {
            props.handleShowError("Le prénom doit contenir au moins 2 caractères.");
            return;
        }

        if(formData.lastname.length < 2) {
            props.handleShowError("Le nom doit contenir au moins 2 caractères.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)) {
            props.handleShowError("L'adresse mail n'est pas valide.");
            return;
        }

        // Persist the user in the database
        try {
            const res = await register(formData);
            if(res && res.data) {
                props.validateSignIn(res.data.token, 'Vous êtes enregistré avec succès !')
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
                <TextField onChange={(e) => setFormData({...formData, firstname: e.target.value})} label="Firstname" variant="standard" margin="dense" required />
                <TextField onChange={(e) => setFormData({...formData, lastname: e.target.value})} label="Lastname" variant="standard" margin="dense" required />
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
                    <Select multiple value={formData.associations} onChange={(e) => setFormData({...formData, associations: e.target.value})} input={<Input label="Associations" />} labelId="multipleCheckboxLabel" renderValue={(selected) => selected.join(', ')} margin="dense" MenuProps={MenuProps}>
                    {associations.map((name) => (
                        <MenuItem key={name} value={name}>
                            <CheckBox checked={formData.associations.indexOf(name) > -1} />
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