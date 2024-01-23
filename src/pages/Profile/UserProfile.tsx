import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { Box, Typography, TextField, Button, InputLabel, FormControl, Input, MenuItem, ListItemText, Select } from '@mui/material';
import styles from "../../styles/pages/Profile/userprofile.module.scss";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from '../../components/general/Alert';

import { useLocation } from 'react-router-dom';
import Appbar from '../../components/general/Appbar';
import Loading from "../../components/general/Loading";
import UserProfileComponent from '../../components/Profile/UserProfile';


import { modifyUser } from '../../api';


const UserProfilePage = () => {
    
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

    // Redirect to home page if not logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <Loading />;
    }

    
    return (

        <>
            <Appbar currentUser={user} />
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <UserProfileComponent />
        </>

    );


};
    

export default UserProfilePage;
