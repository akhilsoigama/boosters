'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== '/Auth/login') {
            checkLoginStatus();
        } else {
            setLoading(false); 
        }
    }, [pathname]);

    const checkLoginStatus = async () => {
        console.log('🔎 Checking login status...');
        try {
            const response = await axios.get('/api/auth/check-auth', { withCredentials: true });
            console.log('✅ Check response:', response.data);
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
                setUser(response.data.user);
            } else {
                redirectToLogin();
            }
        } catch (error) {
            console.error('❌ Error checking login:', error);
            toast.error('Error checking login status');
            redirectToLogin();
        } finally {
            setLoading(false);
        }
    };

    const redirectToLogin = () => {
        setIsLoggedIn(false);
        setUser(null);
        if (pathname !== '/Auth/login') {
            router.push('/Auth/login');
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
            console.error('❌ Error logging out:', error);
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
