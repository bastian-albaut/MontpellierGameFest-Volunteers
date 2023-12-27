import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const { reloadUserContext } = useUser();
    const validateSignIn = async (userToken: any, message: string) => {
        localStorage.setItem('token', JSON.stringify(userToken));

        // Trigger the fetchUser function from the UserContext
        await reloadUserContext();

        // Redirect to the dashboard of the user
        const decodedToken = jwtDecode(userToken);
        const userId = (decodedToken as { userId: string }).userId;
        navigate(`/tableaudebord/${userId}`, { state: { message: message, severity: "success" } });
    }

    // Set the token in the local storage and redirect to the login page
    const validateSignUp = () => {
        navigate("/");
    }


    const handleShowAlertMessage = useCallback(
        (msg: string, severity: "success" | "info" | "warning" | "error") => {
            setAlertMessage({ content: msg, severity: severity });
            setTimeout(() => {
                setAlertMessage({ content: "", severity: "success" });
            }, 5000);
        },
        []
    );

    // Display alert message from location state
    const location = useLocation();
    const [alertMessage, setAlertMessage] = useState({ content: "", severity: "success" });
    useEffect(() => {
        if (location?.state?.message !== undefined) {
            handleShowAlertMessage(location.state.message, location.state.severity);
        }
    }, [location, handleShowAlertMessage]);

    const { user, loading, message, severity } = useUser();
    useEffect(() => {
        if (message) {
            handleShowAlertMessage(message, severity);
        }
    }, [message, severity, handleShowAlertMessage]);

    // Redirect to the dashboard if the user is already logged in
    useEffect(() => {
        if (user) {
            console.log("User is already logged in");
            navigate(`/tableaudebord/${user.userId}`);
        }
    }, [user, navigate]);

    if (loading) {
        return <Loading />;
    }

    return (
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
};

export default LoginRegister;
