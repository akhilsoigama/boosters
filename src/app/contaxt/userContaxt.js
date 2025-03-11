'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_HOST;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/check-auth`, {
                    withCredentials: true,
                });
                const data = response.data;
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                    fetchUserData();
                } else {
                    setIsLoggedIn(false);
                    router.push('/Auth/signup');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
                router.push('/Auth/signup');
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/user`, {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        checkLoginStatus();
    }, [router, baseUrl]);

    const handleLogout = async () => {
        try {
            await axios.post(`${baseUrl}/api/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/signup');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, user, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);