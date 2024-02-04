import { useNavigate } from "react-router-dom";
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import SectionSignupFestival from "../../components/SignupFestival/SectionSignupFestival";

const SignupFestival = () => {

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
            <SectionSignupFestival />
        </>
	)
}

export default SignupFestival
