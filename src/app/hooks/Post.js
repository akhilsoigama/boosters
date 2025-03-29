"use client";
import axios from "axios";
import useSWR from "swr";
import { useMemo, useCallback } from "react";

// ✅ Correct fetcher function (Now accepts URL)
const fetcher = async (url) => {
  try {
    const { data } = await axios.get(url, { params: { limit: 20 } });
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// ✅ Shuffle function
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// ✅ Custom SWR hook
export function usePosts() {
  const { data, error, isValidating, mutate } = useSWR("/api/post", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const refreshPosts = useCallback(() => mutate(), [mutate]);

  return useMemo(() => ({
    posts: data ? shuffleArray(data) : [],
    postsError: error,
    isLoading: !data && !error,
    isValidating,
    refreshPosts,
  }), [data, error, isValidating, refreshPosts]);
}
