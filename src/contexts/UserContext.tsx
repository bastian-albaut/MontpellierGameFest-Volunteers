// UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../api'; // Your API function to get user data
import { User } from '../types/User';

interface UserContextProps {
    user: User | null;
    loading: boolean;
    message: string | null;
    severity: "success" | "info" | "warning" | "error";
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error">("success");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await getCurrentUser();
                if (res.data) {
                    console.log(res.data);
                    setUser(res.data);
                    setMessage('GET CURRENT USER OK');
                    setSeverity("warning");
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
                } else {
                    // Handle other types of errors (network issues, server errors) as needed
                    setMessage('Erreur: Connexion au serveur impossible.');
                    setSeverity("error");
                } 
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, message, severity }}>
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
