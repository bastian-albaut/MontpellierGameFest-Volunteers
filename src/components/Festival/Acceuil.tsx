import styles from "../../styles/components/Festival/acceuil.module.scss" 
import { useEffect } from "react";
import AlertComponent from "../../components/general/Alert"
import { useLocation, useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import Appbar from "../../components/general/Appbar";
import useAlert from "../../hooks/useAlerts";

const Acceuil = () => {

	// Display alert message from location state
    const location = useLocation();
    const { alertMessage, handleShowAlertMessage } = useAlert();
    useEffect(() => {
        if (location?.state?.message !== undefined) {
            handleShowAlertMessage(location.state.message, location.state.severity);
        }
    }, [location, handleShowAlertMessage]);

    // Display alert message from UserContext
    const { user, loading, message, severity } = useUser();
    useEffect(() => {
        if (message) {
            handleShowAlertMessage(message, severity);
        }
    }, [message, severity, handleShowAlertMessage]);

    // Redirect to home page if not logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <Loading />;
    }


	return(
		<>
			<Typography variant="h1" color="initial">Acceuil</Typography>
		</>
	)
}

export default Acceuil
