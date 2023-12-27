import React, { useEffect, useState } from "react";
import styles from "../../styles/pages/loginregister.module.scss" 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "../../components/loginRegister/sectionLogin";
import Register from "../../components/loginRegister/sectionRegister";

import Loading from "../../components/general/Loading";
import AlertComponent from "../../components/general/Alert";
import { getCurrentUser } from "../../api";

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
    
    // Check if the user is login on mount 
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("user")
                const user = await getCurrentUser();
                console.log(user)
                if (user) {
                    setCurrentUser(user.data);
                }
            } catch (error) {
                setCurrentUser(null);
                setIsLoading(false);
                localStorage.removeItem('token');
            }
        };
        fetchData();
    }, []);

    // Wait for the user to be set to change the loading state
    useEffect(() => {
        if(currentUser) {
            setIsLoading(false);
        }
    }, [currentUser])

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
    
    if (isLoading) {
        return (
            <Loading />
        );
    } 

    return(
        <>
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