import styles from "../../styles/components/Contact/sectioncontact.module.scss" 
import { Box, Typography, Button, TextField, Paper} from "@mui/material";

const ContactSection = () => {
  return (
    <Box className={styles.contactContainer}>
        <Box id={styles.boxLocalisation}>
          <Paper className={styles.mapContainer}>
            <Typography variant="h5" className={styles.mapTitle}>Notre emplacement</Typography>
            <iframe title="Map" width="425" height="350" src="https://www.openstreetmap.org/export/embed.html?bbox=3.877261877059937%2C43.609948485926935%2C3.8864672183990483%2C43.617040467569076&amp;layer=mapnik&amp;marker=43.61349458129111%2C3.881864547729492"></iframe><br/><small><a href="https://www.openstreetmap.org/?mlat=43.61349&amp;mlon=3.88186#map=17/43.61349/3.88186">Voir la carte</a></small>
          </Paper>
        </Box>

        <Box id={styles.boxContact}>
          <Paper className={styles.contactInfoContainer}>
            <Typography variant="h4" className={styles.contactTitle}>Contactez nous</Typography>
            <Typography variant="body1" className={styles.contactDetails}>Address: Corum, 34000 Montpellier</Typography>
            <Typography variant="body1" className={styles.contactDetails}>Phone: XXXXXXXXXX</Typography>
            <Typography variant="body1" className={styles.contactDetails}>Site web: <a href="https://example.com">example.com</a></Typography>

            <form className={styles.contactForm}>
              <TextField label="Name" variant="standard" fullWidth />
              <TextField label="Email" variant="standard" fullWidth />
              <TextField label="Message" variant="standard" fullWidth multiline rows={4} />
              <Button variant="contained" color="primary" className={styles.submitButton}>Envoyer un message</Button>
            </form>
          </Paper>
        </Box>
    </Box>
  );
};

export default ContactSection;