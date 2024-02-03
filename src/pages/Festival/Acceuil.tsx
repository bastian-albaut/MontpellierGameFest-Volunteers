import AcceuilComponent from "../../components/Festival/Acceuil";
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from "../../components/general/Alert"


const Acceuil = () => {

	// Get the current user
    const { user, loading } = useUser();

    // Get the festival id from the url
    const url = window.location.href;
    const idFestival = url.substring(url.lastIndexOf('/') + 1);


    // Redirect to home page if not logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    // Display alert message from location state
    const location = useLocation();
    const { alertMessage, handleShowAlertMessage } = useAlert();
    useEffect(() => {
        if (location?.state?.message !== undefined) {
            handleShowAlertMessage(location.state.message, location.state.severity);
        }
    }, [location, handleShowAlertMessage]);

    if (loading) {
        return <Loading />;
    }

	return(
		<>
            <Appbar currentUser={user} />
			{alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <AcceuilComponent idFestival={idFestival}/>
        </> 
    );
}

export default Acceuil
