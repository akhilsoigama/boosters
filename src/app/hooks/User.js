"use client"; 

import axios from "axios";
import useSWR from "swr";

export const logoutUser = async () => {
    try {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
        throw new Error("Logout failed");
    }
};

export function useAuth() {
    const { data, error, isValidating, mutate } = useSWR(
        "/api/auth/check-auth",
        async (url) => { 
            const res = await axios.get(url, { withCredentials: true });
            return res.data;
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    return {
        user: data?.user || null,
        isLoggedIn: data?.isLoggedIn || false,
        isLoading: !data && !error,
        authError: error,
        isValidating,
        mutate,
    };
}
