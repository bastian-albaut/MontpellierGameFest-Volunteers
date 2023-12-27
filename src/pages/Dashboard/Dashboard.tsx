import { useEffect, useState, useCallback } from "react";
import AlertComponent from "../../components/general/Alert"
import { useLocation } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import Appbar from "../../components/general/Appbar";

const Dashboard = () => {

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
            <Typography variant="h1" color="initial">Dashboard</Typography>
        </>
    )
}

export default Dashboard
