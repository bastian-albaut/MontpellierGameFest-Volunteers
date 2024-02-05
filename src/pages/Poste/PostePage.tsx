import { useNavigate } from "react-router-dom";
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import SectionPoste from "../../components/Poste/SectionPoste";
import useAlert from "../../hooks/useAlerts";
import AlertComponent from "../../components/general/Alert";

const PostePage = () => {

    // Get the current user
    const { user, loading } = useUser();

    // Redirect to home page if not logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

    // Get the poste id from the url
    const url = window.location.href;
    const idPoste = url.substring(url.lastIndexOf('/') + 1);

    const { alertMessage, handleShowAlertMessage } = useAlert();

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />}
            <Appbar currentUser={user} />
            <SectionPoste handleShowAlertMessage={handleShowAlertMessage} idPoste={idPoste} />
        </>
	)
}

export default PostePage
