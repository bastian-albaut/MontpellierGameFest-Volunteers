import { useCallback, useEffect, useState } from "react";
import SectionCreateFestival from "../../components/CreateFestival/SectionCreateFestival"
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const CreateFestival = () => {
	// Display alert message from location state
    const [alertMessage, setAlertMessage] = useState({content: "", severity: "success"});
    const handleShowAlertMessage = useCallback((msg: string, severity: "success" | "info" | "warning" | "error") => {
        setAlertMessage({content: msg, severity: severity});
        setTimeout(() => {
            setAlertMessage({content: "", severity: "success"});
        }, 5000)
    }, []);

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
            <SectionCreateFestival />
        </>
	)
}

export default CreateFestival
