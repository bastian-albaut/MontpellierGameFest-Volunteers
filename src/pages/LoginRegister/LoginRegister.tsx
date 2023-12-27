import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/loginregister.module.scss" 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "../../components/loginRegister/sectionLogin";
import Register from "../../components/loginRegister/sectionRegister";

import Loading from "../../components/general/Loading";
import AlertComponent from "../../components/general/Alert";
import Appbar from "../../components/general/Appbar";
import { useUser } from "../../contexts/UserContext";

const LoginRegister = () => {
    const [haveAccount, setHaveAccount] = useState(false);
    const navigate = useNavigate();
    
    // Set the token in the local storage and redirect to the user page
    const validateSignIn = (userToken: any, message: string) => {
        localStorage.setItem('token', JSON.stringify(userToken));

        // Redirect to the dashboard of the user
        const decodedToken = jwtDecode(userToken);
        const userId = (decodedToken as { userId: string }).userId;
        navigate(`/tableaudebord/${userId}`, { state: { message: message, severity: "success" } });
    }

    // Set the token in the local storage and redirect to the login page
    const validateSignUp = (message : any) => {
        navigate("/");
    }

    // Display alert message
    const [alertMessage, setAlertMessage] = useState({content: "", severity: "success"});
    const handleShowAlertMessage = (msg: string, severity: "success" | "info" | "warning" | "error") => {
        setAlertMessage({content: msg, severity: severity});
        setTimeout(() => {
            setAlertMessage({content: "", severity: "success"});
        }, 5000)
    }

    const { user, loading, message, severity } = useUser();
    if (message) {
        handleShowAlertMessage(message, severity);
    }

    if (loading) {
        return <Loading />;
    }
    
    return(
        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            {message && <AlertComponent message={message} severity="error" />}
            {haveAccount ? (
                <Login validateSignIn={validateSignIn} setHaveAccount={setHaveAccount} handleShowAlertMessage={handleShowAlertMessage} />
            ) : (
                <Register validateSignUp={validateSignUp} setHaveAccount={setHaveAccount} handleShowAlertMessage={handleShowAlertMessage} />
            )}
        </>
    );
}

export default LoginRegister;