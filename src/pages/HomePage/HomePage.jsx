import { Box, Typography } from "@mui/material"
import "../../styles/pages/homepage.scss" 
import Appbar from "../../components/general/Appbar"

const HomePage = () => {
	return(
        <>
            <Appbar />
            <Box className="boxHomepage">
                <Typography variant="h1" color="initial" id="title">Page d'accueil</Typography>
            </Box>
        </>
	)
}

export default HomePage
