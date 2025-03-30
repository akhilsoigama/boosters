import useSWR from 'swr';
import axios from 'axios';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const fetcher = async (url) => {
  try {
    const res = await axios.get(url, { params: { limit: 20 } });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const useRandomPosts = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/post', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const [likedPosts, setLikedPosts] = useState({});
  const [likesCount, setLikesCount] = useState({});

  const uniqueRandomPosts = useMemo(() => {
    if (!data) return [];
    const postMap = new Map();
    data.forEach((post) => postMap.set(post._id, post));
    const uniquePosts = shuffleArray(Array.from(postMap.values()));
    return uniquePosts;
  }, [data]);

  const refreshPosts = useCallback(async () => {
    try {
      await mutate();
      toast.success('Posts refreshed');
    } catch (error) {
      toast.error('Failed to refresh posts');
    }
  }, [mutate]);

  const toggleLike = useCallback(async (postId) => {
    try {
      const newLikedState = !likedPosts[postId];
      setLikedPosts(prev => ({ ...prev, [postId]: newLikedState }));
      setLikesCount(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (newLikedState ? 1 : -1),
      }));

      await axios.post(`/api/posts/${postId}/like`, { like: newLikedState });
      await mutate();
    } catch (error) {
      toast.error('Error liking the post');
      setLikedPosts(prev => ({ ...prev, [postId]: !likedPosts[postId] }));
      setLikesCount(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (likedPosts[postId] ? 1 : -1),
      }));
    }
  }, [likedPosts, mutate]);

  return {
    posts: uniqueRandomPosts,
    isLoading: !data && !error,
    error,
    refreshPosts,
    likedPosts,
    likesCount,
    toggleLike,
  };
};
