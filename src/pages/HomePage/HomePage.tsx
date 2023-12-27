import { Box, Typography } from "@mui/material"
import Appbar from "../../components/general/Appbar"
import { useUser } from "../../contexts/UserContext";
import Loading from "../../components/general/Loading";

const HomePage = () => {

    const { user, loading } = useUser();
    if (loading) {
        return <Loading />;
    }

	return(
        <>
            <Appbar currentUser={user} />
            <Box className="boxHomepage">
                <Typography variant="h1" color="initial" id="title">Page d'accueil</Typography>
            </Box>
        </>
	)
}

export default HomePage
