import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import MonFestival from "../../components/MyFestival/MonFestival";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const MonFestivalPage = () => {

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
            <MonFestival />
        </>
	)
}

export default MonFestivalPage
