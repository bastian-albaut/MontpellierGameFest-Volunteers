import styles from "../../styles/pages/ResetMDP/resetmdp.module.scss"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';

// Imaginons que resetPasswordApi soit une fonction qui appelle votre API de réinitialisation du mot de passe
import { resetPasswordApi } from '../../api';

type dataReset = {
	newPassword: string;
	token: string;
}

export default function ResetMDP() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	const handleResetPassword = async () => {
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}
		if (token === null) {
			setError("Aucun token de réinitialisation de mot de passe n'a été fourni.");
			return;
		}

		console.log("Resetting password...");
		console.log("token: " + token);

		const data: dataReset = {
			newPassword: password,
			token: token
		}

		console.log(data);

		// Vérification supplémentaire des critères de mot de passe ici, si nécessaire

		try {
			await resetPasswordApi(data);
			// Si la réinitialisation est réussie, rediriger ou afficher un message de succès
			navigate('/login'); // Redirige vers la page de connexion ou affiche un message de succès
		} catch (error) {
			setError("Une erreur s'est produite lors de la réinitialisation du mot de passe.");
			console.error(error);
		}
	};

	//token, newPassword
	return (
		<Box className={styles.box}>
			<Box className={styles.boxContent}>
			<Typography variant="h4">Réinitialiser le mot de passe</Typography>
			<TextField
				label="Nouveau mot de passe"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="Confirmer le nouveau mot de passe"
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				fullWidth
				margin="normal"
			/>
			{error && <Typography color="error">{error}</Typography>}
			<Button
				onClick={handleResetPassword}
				variant="contained"
				color="primary"
				fullWidth
			>
				Réinitialiser le mot de passe
			</Button>
			</Box>
		</Box>
	);
}
