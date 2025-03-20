'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('/api/auth/check-auth', { withCredentials: true });
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                setUser(response.data.user); // 👈 yahan se user data mil raha hona chahiye
            } else {
                setIsLoggedIn(false);
                setUser(null);
                router.push('/Auth/login');
            }
        } catch (error) {
            console.error('Error checking login:', error);
            toast.error('Error checking login status');
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            Cookies.remove('token');
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const contextValue = useMemo(() => ({
        isLoggedIn,
        user,
        loading,
        handleLogout,
    }), [isLoggedIn, user, loading]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
