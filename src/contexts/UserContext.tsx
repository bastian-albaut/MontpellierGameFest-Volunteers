// UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../api'; // Your API function to get user data
import { User } from '../types/User';

interface UserContextProps {
    user: User | null;
    loading: boolean;
    message: string | null;
    severity: "success" | "info" | "warning" | "error";
    reloadUserContext: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("success");
    const [messageDisplayed, setMessageDisplayed] = useState(false);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            setUser(null);
            return;
        }

        try {
            const res = await getCurrentUser();
            if (res.data) {
                console.log(res.data);
                setUser(res.data);
            }
        } catch (error) {
            console.error('Error fetching user data', error);
    
            if ((error as any).response && (error as any).response.status === 401) {
                // Unauthorized (token expired or invalid)
                console.log('Removing token from local storage');
                setMessage('Votre session a expiré. Veuillez vous reconnecter.');
                setSeverity("warning");
                
                localStorage.removeItem('token');
                setUser(null);

                // Display the message only if it hasn't been displayed before
                if (!messageDisplayed) {
                    setMessageDisplayed(true);
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000); // Delay of 3 seconds
                } else {
                    setMessage(null);
                }
            } else {
                // Handle other types of errors (network issues, server errors) as needed
                setMessage('Erreur: Connexion au serveur impossible.');
                setSeverity("error");

                // Display the message only if it hasn't been displayed before
                if (!messageDisplayed) {
                    setMessageDisplayed(true);
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000); // Delay of 3 seconds
                } else {
                    setMessage(null);
                }
            } 
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Function to manually trigger user data fetch
    const reloadUserContext = async (): Promise<void> => {
        console.log('Reloading user context')
        await fetchUser(); // Wait for fetchUser to complete
    };

    return (
        <UserContext.Provider value={{ user, loading, message, severity, reloadUserContext }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
