import { useEffect, useState, useCallback } from "react";
import AlertComponent from "../../components/general/Alert"
import { useLocation } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import Appbar from "../../components/general/Appbar";
import useAlert from "../../hooks/useAlerts";
import SectionDashboard from "../../components/Dashboard/SectionDashboard";

const Dashboard = () => {

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

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <SectionDashboard />
        </>
    )
}

export default Dashboard
