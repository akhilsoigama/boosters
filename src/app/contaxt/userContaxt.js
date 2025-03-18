'use client';
import { createContext, useContext, useState, useEffect } from 'react';
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
            const response = await axios.get(`${baseUrl}/api/check-auth`, {
                withCredentials: true,
            });
    
    
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                const userId = response.data.user.id;
    
                const userRes = await axios.get(`${baseUrl}/api/users/${userId}`, {
                    withCredentials: true,
                });
    
                setUser(userRes.data);  
            } else {
                setIsLoggedIn(false);
                setUser(null);
                router.push('/Auth/signup');
            }
        } catch (error) {
            toast.error('Error checking login status:', error);
            setIsLoggedIn(false);
            setUser(null);
            router.push('/Auth/login');
        }
    };
    
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
