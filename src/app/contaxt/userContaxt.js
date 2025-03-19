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
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_HOST;

    useEffect(() => {
        checkLoginStatus();
    }, [baseUrl]);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get(`/api/auth/check-auth`, {
                withCredentials: true,
            });

            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                const userId = response.data.user.id;

                const userRes = await axios.get(`/api/user/${userId}`, {
                    withCredentials: true,
                });

                setUser(userRes.data);  
            } else {
                setIsLoggedIn(false);
                setUser(null);
                router.push('/Auth/signup');
            }
        } catch (error) {
            toast.error('Error checking login status');
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/login');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
            Cookies.remove('token');
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/signup');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // ✅ Memoize context value to avoid unnecessary re-renders
    const contextValue = useMemo(() => ({
        isLoggedIn,
        user,
        handleLogout
    }), [isLoggedIn, user]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
