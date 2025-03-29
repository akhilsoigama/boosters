'use client';

import { createContext, useContext, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { logoutUser, useAuth } from '../hooks/User';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user, isLoggedIn, isLoading, authError, mutate } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return; // Wait until loading finishes
        if (!isLoggedIn && pathname !== '/Auth/login') {
            router.replace('/Auth/login'); // Prevent unnecessary history entries
        }
    }, [isLoading, isLoggedIn, pathname, router]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            Cookies.remove('token');
            await mutate(null, false); // Immediately clear SWR cache without re-fetching
            router.replace('/Auth/login');
        } catch (error) {
            toast.error(`❌ Error logging out: ${error.message}`);
        }
    };

    const contextValue = useMemo(() => ({
        user: user || null,
        isLoggedIn: isLoggedIn || false,
        isLoading,
        authError,
        handleLogout,
    }), [user, isLoggedIn, isLoading, authError]);

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
