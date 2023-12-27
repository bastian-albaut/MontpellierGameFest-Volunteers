import { Box, Typography } from "@mui/material"
import Appbar from "../../components/general/Appbar"
import { useUser } from "../../contexts/UserContext";
import Loading from "../../components/general/Loading";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import AlertComponent from "../../components/general/Alert";

const HomePage = () => {

    // Display alert message from location state
    const location = useLocation();
    const [alertMessage, setAlertMessage] = useState({content: "", severity: "success"});
    const handleShowAlertMessage = useCallback((msg: string, severity: "success" | "info" | "warning" | "error") => {
        setAlertMessage({content: msg, severity: severity});
        setTimeout(() => {
            setAlertMessage({content: "", severity: "success"});
        }, 5000)
    }, []);
    useEffect(() => {
        if (location?.state?.message !== undefined) {
            handleShowAlertMessage(location.state.message, location.state.severity);
        }
    } , [location, handleShowAlertMessage]);

    const { user, loading, message, severity } = useUser();
    useEffect(() => {
        if (message) {
            handleShowAlertMessage(message, severity);
        }
    }, [message, severity, handleShowAlertMessage]);

    if (loading) {
        return <Loading />;
    }

	return(
        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <Box className="boxHomepage">
                <Typography variant="h1" color="initial" id="title">Page d'accueil</Typography>
            </Box>
        </>
	)
}

export default HomePage
