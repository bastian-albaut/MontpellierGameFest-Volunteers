import { useEffect, useState } from "react";
import AlertComponent from "../../components/general/Alert"
import { useLocation } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import Appbar from "../../components/general/Appbar";

const Dashboard = () => {

    // Display alert message from location state
    const location = useLocation();
    const [alertMessage, setAlertMessage] = useState({content: location?.state?.message, severity: location?.state?.severity});
    const handleShowAlertMessage = (msg: string, severity: "success" | "info" | "warning" | "error") => {
        setAlertMessage({content: msg, severity: severity});
        setTimeout(() => {
            setAlertMessage({content: "", severity: "success"});
        }, 5000)
    }

    const { user, loading } = useUser();
    if (loading) {
        return <Loading />;
    }

	return(
        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== undefined && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <Typography variant="h1" color="initial">Dashboard</Typography>
        </>
	)
}

export default Dashboard
