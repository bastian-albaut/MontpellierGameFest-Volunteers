import { useNavigate } from "react-router-dom";
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import SectionPoste from "../../components/Poste/SectionPoste";

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

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            <Appbar currentUser={user} />
            <SectionPoste idPoste={idPoste} />
        </>
	)
}

export default PostePage
