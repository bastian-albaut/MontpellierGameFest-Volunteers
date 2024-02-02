import styles from "../../styles/pages/VerifyEmail/verifyemail.module.scss"
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {apiVerifyEmail} from "../../api";
import {Box, Typography} from "@mui/material";
import Appbar from "../../components/general/Appbar";
import {useUser} from "../../contexts/UserContext";
const VerifyEmail = () => {
	const [pageLoading, setLoading] = useState(true);
	const [message, setMessage] = useState('');
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const token = searchParams.get('token');
	const { user, loading } = useUser();


	const verifyEmail = async () => {
		try {
			if (!token) {
				setMessage('Aucun token trouvé.');
				return;
			}
			const rep = await apiVerifyEmail(token);
			setMessage('Votre email a été vérifié avec succès !');
		}catch (error) {
			setMessage('Une erreur est survenue lors de la vérification de votre email.');
		}finally {
			setLoading(false);
		}
	}

	const fakeVerifyEmail = () => {
		setMessage('Votre email a été vérifié avec succès !');
		setLoading(false);
	}

	useEffect(() => {
		verifyEmail();
	}, [token]);



	if (pageLoading) return <div>Chargement...</div>;

	return (
		<Box className={styles.mainBox}>
			<Appbar currentUser={user} />
			<Box className={styles.verifyEmail}>
				<Box className={styles.message}>
					<Typography variant="h3">{message}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default VerifyEmail;
