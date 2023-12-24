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
    const handleShowError = (msg) => {
        setError(msg)
        setTimeout(() => {
            setError('')
        }, 5000)
    }
    
    // Get the token from the local storage
    const getToken = () => {
        // Check if the token is in the local storage
        if (!localStorage.getItem('token')) {
            return null;
        }
        const tokenString = localStorage.getItem('token');

        // Check if the token is not undefined
        if (tokenString === 'undefined') {
            return null;
        }

        const userToken = JSON.parse(tokenString);
        return userToken;
    };
    
    // Check if the user is login on mount 
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();

            if(!token) {
                setCurrentUser(null);
                setIsLoading(false);
                return;
            }

            if(token) {
                try {
                    const user = await getCurrentUser(token);
                    if (user) {
                        setCurrentUser(user.data);
                    }
                } catch (error) {
                    setCurrentUser(null);
                    localStorage.removeItem('token');
                }
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
    const validateSignIn = (userToken, message) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        
        // Get the result if of the user and redirect to his page
        const decodedToken = jwtDecode(userToken);
        navigate(`/tableaudebord/${decodedToken.id}`, { state: { message: message } });
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
                <Register validateSignIn={validateSignIn} setHaveAccount={setHaveAccount} handleShowError={handleShowError} />
            )}
        </>
    );
}

export default LoginRegister;