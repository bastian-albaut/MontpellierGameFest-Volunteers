import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUser} from "../../contexts/UserContext";

const OAuth2Callback = () => {
	const navigate = useNavigate();
	const { user, loading, message, severity } = useUser();
	const { reloadUserContext } = useUser();

	useEffect(() => {
		// Exemple pour extraire le token de l'URL
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			localStorage.setItem('token',JSON.stringify(token));
			reloadUserContext();
			// Redirection vers le tableau de bord ou la page d'accueil
			navigate('/')
		} else {
			// Gérer l'erreur ou la redirection si aucun token n'est trouvé
			navigate('/login', { replace: true });
		}
	}, [navigate]);

	return (
		<div>Authentification en cours...</div>
	);
};

export default OAuth2Callback;