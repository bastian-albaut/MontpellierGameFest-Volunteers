import ViewUserProfileComponent from "../../components/Profile/ViewUserProfile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/general/Loading";
import AlertComponent from "../../components/general/Alert";
import { useUser } from "../../contexts/UserContext";
import useAlert from "../../hooks/useAlerts";
import Appbar from "../../components/general/Appbar";



const ViewUserProfile = () => {

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

	return(

		<>

			<Appbar currentUser={user} />
			{alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
			<ViewUserProfileComponent />

		</>

	);
}

export default ViewUserProfile
