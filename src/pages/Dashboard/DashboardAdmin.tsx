import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import Loading from "../../components/general/Loading";
import Appbar from "../../components/general/Appbar";
import SectionDasboardAdmin from "../../components/Dashboard/SectionDasboardAdmin";

const DashboardAdmin = () => {

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
            <SectionDasboardAdmin />
        </>
    )
}

export default DashboardAdmin
