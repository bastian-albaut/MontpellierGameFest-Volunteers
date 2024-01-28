import styles from "../../styles/components/Contact/sectioncontact.module.scss" 
import { Box, Typography, Button, TextField, Paper} from "@mui/material";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <Box className={styles.contactContainer}>
        <Box id={styles.boxLocalisation}>
          <Paper className={styles.mapContainer}>
            <Typography variant="h5" className={styles.mapTitle}>Notre emplacement</Typography>
            <iframe title="Map" id={styles.iframe} src="https://www.openstreetmap.org/export/embed.html?bbox=3.877261877059937%2C43.609948485926935%2C3.8864672183990483%2C43.617040467569076&amp;layer=mapnik&amp;marker=43.61349458129111%2C3.881864547729492"></iframe><br/><small><a href="https://www.openstreetmap.org/?mlat=43.61349&amp;mlon=3.88186#map=17/43.61349/3.88186">Voir la carte</a></small>
          </Paper>
        </Box>

        <Box id={styles.boxContact}>
            <Paper className={styles.contactInfoContainer}>
                <Typography variant="h4" className={styles.contactTitle}>Contactez nous</Typography>
                <Box id={styles.boxContactDetails}>
                    <Box className={styles.contactDetails}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                        <Typography variant="body1">Corum, 34000 Montpellier</Typography>
                    </Box>
                    <Box className={styles.contactDetails}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <Typography variant="body1">
                            <Link to="mailto:contact@festivaldujeu-montpellier.org">contact@festivaldujeu-montpellier.org</Link>
                        </Typography>
                    </Box>
                    <Box className={styles.contactDetails}>
                        <FontAwesomeIcon icon={faGlobe} className={styles.icon} />
                        <Typography variant="body1">
                            <Link to="https://www.festivaldujeu-montpellier.org" target="_blank" rel="noreferrer">Site visiteur</Link>
                        </Typography>
                    </Box>
                </Box>
                <form className={styles.contactForm}>
                    <TextField label="Nom" variant="standard" />
                    <TextField label="Adresse mail" variant="standard" />
                    <TextField label="Message" variant="standard" multiline rows={4} />
                    <Button variant="contained" color="primary" className={styles.submitButton}>Envoyer un message</Button>
                </form>
            </Paper>
        </Box>
    </Box>
  );
};

export default ContactSection;