import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";
import SectionContact from "../../components/Contact/SectionContact";

const ContactPage = () => {

    // Get the current user
    const { user, loading } = useUser();

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            <Appbar currentUser={user} />
            <SectionContact />
        </>
	)
}

export default ContactPage
