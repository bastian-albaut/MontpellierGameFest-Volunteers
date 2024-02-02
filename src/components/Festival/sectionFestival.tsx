// FestivalDetails.tsx
import { useEffect, useState } from "react";
import { getCreneauxByFestival, getFestivalById, getPostesByFestival, getVolunteersByFestival } from "../../api"; // Assurez-vous d'avoir une fonction getFestivalById dans votre fichier api
import styles from "../../styles/components/festival/sectionfestival.module.scss";
import { Festival } from "../../types/Festival";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../general/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faMapMarkerAlt, faUsers, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import ModalImportGames from "./ModalImportGames";

const SectionFestival = (props: any) => {
    const [festival, setFestival] = useState<Festival | null>(null);
    const [postes, setPostes] = useState<any[]>([]);
    const [creneaux, setCreneaux] = useState<any[]>([]);
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make multiple API calls concurrently using Promise.all
                const [festivalData, postesData, creneauxData, volunteersData] = await Promise.all([
                    getFestivalById(props.idFestival),
                    getPostesByFestival(props.idFestival),
                    getCreneauxByFestival(props.idFestival),
                    getVolunteersByFestival(props.idFestival)
                ]);

                if (festivalData && festivalData.data && postesData && postesData.data && creneauxData && creneauxData.data && volunteersData && volunteersData.data) {
                    // format date
                    festivalData.data.dateDebut = new Date(festivalData.data.dateDebut);
                    festivalData.data.dateFin = new Date(festivalData.data.dateFin);
                    setFestival(festivalData.data);
                    setPostes(postesData.data);
                    setCreneaux(creneauxData.data);
                    setVolunteers(volunteersData.data);
                } else {
                    navigate("/", { state: { message: "Une erreur est survenu lors de la récupération des données du festival.", severity: "error" } });
                }
            } catch (error) {
                navigate("/", { state: { message: "Une erreur est survenu lors de la récupération des données du festival.", severity: "error" } });
            } finally {
                setIsLoadingFetch(false);
            }
        };

        fetchData();
    }, [props.idFestival, navigate]);

    // Format date
    const formattedDate = (originalDate: Date) => {
        const day = originalDate.getUTCDate().toString().padStart(2, '0');
        const month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = originalDate.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    // Format time
    const formattedTime = (originalDate: Date) => {
        const hours = originalDate.getUTCHours().toString().padStart(2, '0');
        const minutes = originalDate.getUTCMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime;
    }

    // Modal for import games
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (isLoadingFetch) {
        return <Loading />;
    }

    return (
        <Box className={styles.festivalContainer}>
            <Typography variant="h4" className={styles.festivalTitle}>{festival?.name}</Typography>
            <Box className={styles.boxIconText}>
                <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                <Typography variant="body1">{`Du ${formattedDate(festival?.dateDebut!)} au ${formattedDate(festival?.dateFin!)}`}</Typography>
            </Box>
            <Box className={styles.boxIconText}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                <Typography variant="body1">{`${festival?.address}, ${festival?.postalCode} ${festival?.city}, ${festival?.country}`}</Typography>
            </Box>
            <Box className={styles.boxElements}>
                <Box className={styles.boxIconText}>
                    <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                    <Typography variant="h5">Bénévoles</Typography>
                </Box>
                <Box className={styles.list}>
                    {volunteers.map((volunteer, index) => {
                        return (
                            <Box key={index}>
                                <Avatar alt={volunteer.firstname} src={volunteer.firstname} />
                                <Typography variant="subtitle1">{`${volunteer.firstname} ${volunteer.lastname}`}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box className={styles.boxElements}>
                <Box className={styles.boxIconText}>
                    <FontAwesomeIcon icon={faUserFriends} className={styles.icon} />
                    <Typography variant="h5">Postes</Typography>
                </Box>
                <Box className={styles.list}>
                    {postes.map((poste, index) => {
                        return (
                            <Box key={index}>
                                <Button variant="text" color="primary" onClick={() => navigate(`/poste/${poste.idPoste}`)}>{poste.name}</Button>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box className={styles.boxElements}>
                <Box className={styles.boxIconText}>
                    <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                    <Typography variant="h5">Créneaux</Typography>
                </Box>
                <Box className={styles.list}>
                    {creneaux.map((creneau, index) => {
                        return (
                            <Box key={index}>
                                <Typography variant="subtitle1">{`${formattedTime(new Date(creneau.timeStart))} - ${formattedTime(new Date(creneau.timeEnd))}`}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box className={styles.boxElements}>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>Importer des jeux</Button>
            </Box>
            <ModalImportGames open={isModalOpen} handleClose={handleCloseModal} />
        </Box>
    );
};

export default SectionFestival;