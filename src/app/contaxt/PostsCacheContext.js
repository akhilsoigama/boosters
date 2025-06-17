'use client'
import { createContext, useContext, useState } from 'react';

const PostsCacheContext = createContext();

export const PostsCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());

  const getFromCache = (key) => cache.get(key);
  const setToCache = (key, value) => setCache(prev => new Map(prev).set(key, value));
  const clearCache = () => setCache(new Map());

  return (
    <PostsCacheContext.Provider value={{ getFromCache, setToCache, clearCache }}>
      {children}
    </PostsCacheContext.Provider>
  );
};

export const usePostsCache = () => useContext(PostsCacheContext);