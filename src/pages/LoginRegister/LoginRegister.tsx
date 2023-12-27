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
    
    // Display error message
    const [error, setError] = useState('');
    const handleShowError = (msg: string) => {
        setError(msg)
        setTimeout(() => {
            setError('')
        }, 5000)
    }
    
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

    const { user, loading } = useUser();
    if (loading) {
        return <Loading />;
    }
    
    return(
        <>
            <Appbar currentUser={user} />
            {error && <AlertComponent message={error} severity="error" />}
            {haveAccount ? (
                <Login validateSignIn={validateSignIn} setHaveAccount={setHaveAccount} handleShowError={handleShowError} />
            ) : (
                <Register validateSignUp={validateSignUp} setHaveAccount={setHaveAccount} handleShowError={handleShowError} />
            )}
        </>
    );
}

export default LoginRegister;