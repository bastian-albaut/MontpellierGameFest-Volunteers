import { useNavigate } from "react-router-dom";
import SectionCreateFestival from "../../components/CreateFestival/SectionCreateFestival"
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";

const CreateFestival = () => {

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
            <SectionCreateFestival />
        </>
	)
}

export default CreateFestival
