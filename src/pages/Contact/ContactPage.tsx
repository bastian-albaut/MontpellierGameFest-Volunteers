import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import SectionContact from "../../components/Contact/SectionContact";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const ContactPage = () => {

    // Get the current user
    const { user, loading } = useUser();

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
            <SectionContact />
        </>
	)
}

export default ContactPage
