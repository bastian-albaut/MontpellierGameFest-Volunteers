// UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../api'; // Your API function to get user data
import { User } from '../types/User';

interface UserContextProps {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                if(res.data) {
                    console.log(res.data);
                    setUser(res.data);
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
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
