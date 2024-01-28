import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import Loading from "../../components/general/Loading";
import Appbar from "../../components/general/Appbar";
import SectionFestival from "../../components/Festival/sectionFestival";

const Festival = () => {
	// Get the current user
    const { user, loading } = useUser();

    // Redirect to home page if not logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading, navigate]);

     // Get the festival id from the url
     const url = window.location.href;
     const idFestival = url.substring(url.lastIndexOf('/') + 1);

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            <Appbar currentUser={user} />
            <SectionFestival idFestival={idFestival} />
        </>
	)
}

export default Festival
