import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';

const fetcher = url => axios.get(url).then(res => res.data);

export function useProfiles() {
  const { data: profiles, error, mutate } = useSWR('/api/profile', fetcher);

  const isLoading = !profiles && !error;
  const createProfile = async (profileData) => {
    try {
      const res = await axios.post('/api/profile', profileData);
      toast.success('Profile created');
      mutate(prev => (prev ? [...prev, res.data.newProfile] : [res.data.newProfile]), false);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile');
      throw err;
    }
  };
  
  const updateProfile = async ({ id, ...updatedData }) => {
    try {
      const res = await axios.patch(`/api/profile/${id}`, updatedData);
      toast.success('Profile updated');
      mutate(prev => {
        if (!prev) return prev;
        return prev.map(p => (p._id === id ? res.data.profile : p));
      }, false);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  return {
    profiles,
    isLoading,
    createProfile,
    updateProfile,
    error,
    mutate,
  };
}
