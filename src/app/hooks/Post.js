import axios from "axios";
import useSWR from "swr";
import { useMemo, useCallback } from "react";
import { toast } from "sonner";

const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url, {
      params: { limit: 20 },
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30'
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export function usePosts() {
  const {
    data,
    error,
    isValidating,
    mutate,
  } = useSWR("/api/post", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    focusThrottleInterval: 60000,
  });

  const refreshPosts = useCallback(() => mutate(), [mutate]);

  const createPost = async (newPostData) => {
    try {
      const res = await axios.post("/api/post", newPostData);
      toast.success("Post created");
      mutate();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
      throw err;
    }
  };

  const updatePost = async (id, updatedPostData) => {
    try {
      const res = await axios.patch(`/api/post/${id}`, updatedPostData);
      toast.success("Post updated");
      mutate();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/post/${id}`);
      toast.success("Post deleted");
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
      throw err;
    }
  };

  const getPostById = async (id) => {
    try {
      const res = await axios.get(`/api/post/${id}`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch post");
      return null;
    }
  };

  return useMemo(() => ({
    posts: data ? shuffleArray(data) : [],
    postsError: error,
    isLoading: !data && !error,
    isValidating,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    mutate
  }), [data, error, isValidating, refreshPosts, mutate]);
}