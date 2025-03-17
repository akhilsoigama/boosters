'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_HOST;

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            checkLoginStatus(token);
        } else {
            setIsLoggedIn(false);
            router.push('/Auth/signup');
        }
    }, []);

    const checkLoginStatus = async (token) => {
        try {
            const response = await axios.get(`${baseUrl}/api/check-auth`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                setUser(response.data.user);
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
    console.log(user)
    const handleLogout = async () => {
        try {
            await axios.post(`${baseUrl}/api/logout`, {}, { withCredentials: true });
            Cookies.remove('token');
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
