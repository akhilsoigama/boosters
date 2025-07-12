'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { usePostsCache } from './PostsCacheContext';
import { usePosts } from '../hooks/Post';
import { useUser } from './userContaxt';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { posts, isLoading, isValidating, mutate } = usePosts();
  const { user } = useUser();
  const { getFromCache, setToCache } = usePostsCache();

  const [initialLoad, setInitialLoad] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadCount = 4;
  const observer = useRef();
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API, {
        transports: ['websocket'],
      });

      socketRef.current.on('post-liked', ({ postId }) => {
        mutate(); 
      });

      socketRef.current.on('post-unliked', ({ postId }) => {
        mutate();
      });

      socketRef.current.on('post-commented', ({ postId }) => {
        mutate();
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [mutate]);

  useEffect(() => {
    if (!initialLoad || posts.length === 0) return;
  
    const cacheKey = `posts-${user?._id || 'all'}`;
    const cachedPosts = getFromCache(cacheKey);
  
    if (cachedPosts) {
      setVisiblePosts(cachedPosts.slice(0, loadCount));
    } else {
      const uniquePosts = Array.from(new Map(posts.map(p => [p._id, p])).values());
      setVisiblePosts(uniquePosts.slice(0, loadCount));
      setToCache(cacheKey, uniquePosts);
  
      const initialLikes = {};
      const initialLikesCount = {};
  
      uniquePosts.forEach((p) => {
        initialLikes[p._id] = p.likes?.includes(user?._id) || false;
        initialLikesCount[p._id] = p.likes?.length || 0;
      });
  
      setLikedPosts(initialLikes);
      setLikesCount(initialLikesCount);
    }
  
    setInitialLoad(false); 
  }, [initialLoad, posts, user, getFromCache, setToCache]);
  

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading || isValidating) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting ) {
          loadMorePosts();
        }
      }, { threshold: 0.1 });

      if (node) observer.current.observe(node);
    },
    [isLoading, isValidating]
  );

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
  
    const currentLength = visiblePosts.length;
    const nextPosts = posts.slice(currentLength, currentLength + loadCount);
  
    if (nextPosts.length > 0) {
      setVisiblePosts(prev => {
        const combined = [...prev, ...nextPosts];
        const unique = Array.from(new Map(combined.map(p => [p._id, p])).values());
        return unique;
      });
    }
  }, [isLoading, posts, visiblePosts]);
  

  const handleLikeToggle = async (postId) => {
    if (!user?._id) return;

    const newLikedState = !likedPosts[postId];

    setLikedPosts(prev => ({ ...prev, [postId]: newLikedState }));
    setLikesCount(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (newLikedState ? 1 : -1),
    }));

    try {
      await axios.post(`/api/posts/${postId}/like`, {
        userId: user._id,
        like: newLikedState
      });
      mutate();
    } catch (error) {
      console.error('Toggle like failed:', error);
      setLikedPosts(prev => ({ ...prev, [postId]: !newLikedState }));
      setLikesCount(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (newLikedState ? -1 : 1),
      }));
    }
  };

  const handleOpenComment = (post) => {
    setSelectedPost(post);
    setOpenCommentModal(true);
  };

  const handleCloseComment = () => {
    setSelectedPost(null);
    setOpenCommentModal(false);
  };

  const value = useMemo(() => ({
    posts,
    visiblePosts,
    isLoading: isLoading && initialLoad,
    isValidating,
    likedPosts,
    likesCount,
    lastPostRef,
    handleLikeToggle,
    handleOpenComment,
    handleCloseComment,
    openCommentModal,
    selectedPost,
    mutate,
    socketRef,
  }), [
    posts,
    visiblePosts,
    isLoading,
    initialLoad,
    isValidating,
    likedPosts,
    likesCount,
    lastPostRef,
    openCommentModal,
    selectedPost,
    mutate
  ]);

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
