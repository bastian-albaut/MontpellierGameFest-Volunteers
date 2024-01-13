import SectionCreateFestival from "../../components/CreateFestival/SectionCreateFestival"
import Appbar from "../../components/general/Appbar";
import Loading from "../../components/general/Loading";
import { useUser } from "../../contexts/UserContext";

const CreateFestival = () => {

    // Get the current user
    const { user, loading } = useUser();

    if (loading) {
        return <Loading />;
    }

    return(
        <>
            <Appbar currentUser={user} />
            <SectionCreateFestival />
        </>
	)
}

export default CreateFestival
