import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";

const fetcher = async (url) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
};
export function useProfiles(userId) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? `/api/profile` : null,
        fetcher
    );
    const createProfile = async (profileData) => {
        try {
            const response = await axios.post("/api/profile", profileData);
            mutate([...data?.data ?? [], response.data.newProfile], false);
            toast.success("Saved profile");
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to create profile");
        }
    };
    const updateProfile = async (updatedData) => {
        try {
            const response = await axios.patch(`/api/profile`, updatedData);
            mutate(`/api/profile`, response.data.updatedProfile, false);
            toast.success("Profile updated successfully!");
            return response.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating profile");
            throw err;
        }
    };
    
    
    
    return {
        profiles: data ?? [],
        isLoading,
        isError: !!error,
        createProfile,
        updateProfile
    };
}
