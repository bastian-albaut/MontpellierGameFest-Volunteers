import { Box, Typography } from "@mui/material";
import styles from "../../styles/components/SignupFestival/sectionsignupfestival.module.scss" 

const SectionSignupFestival = () => {
	return(
        <>
        {/* {alertMessage.content !== "" && <AlertComponent message={alertMessage.content} severity={alertMessage.severity} />} */}
        <Box id={styles.boxSection}>
            <Typography id={styles.title} variant="h1" color="black">Créer un festival</Typography>
            <Box id={styles.boxForm}></Box>
        </Box>
        </>
	)
}

export default SectionSignupFestival;
