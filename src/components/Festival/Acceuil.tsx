import styles from "../../styles/components/Festival/acceuil.module.scss" 
import { useEffect } from "react";
import AlertComponent from "../../components/general/Alert"
import { useLocation, useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";

const Acceuil = () => {

    const location = useLocation();
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
			<Typography variant="h1" color="initial">Acceuil</Typography>
		</>
	)
}

export default Acceuil
