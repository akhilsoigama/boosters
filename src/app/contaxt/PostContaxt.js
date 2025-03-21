'use client';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from './userContaxt';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const loadCount = 4;
  const observer = useRef();
  const { user } = useUser();

  // Fetch Posts
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get('/api/post', { params: { limit: 20 } });
      if (res.data?.length > 0) {
        setPosts(res.data);
        setVisiblePosts(res.data.slice(0, loadCount));
        const likes = {};
        res.data.forEach((post) => likes[post._id] = post.likes || 0);
        setLikesCount(likes);
      } else setHasMore(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) fetchPosts();
  }, [user, fetchPosts]);

  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMorePosts();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMorePosts = () => {
    const currentLength = visiblePosts.length;
    const nextPosts = posts.slice(currentLength, currentLength + loadCount);
    setVisiblePosts((prev) => [...prev, ...nextPosts]);
    if (currentLength + loadCount >= posts.length) setHasMore(false);
  };

  const handleLikeToggle = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setLikesCount((prev) => ({
      ...prev,
      [postId]: likedPosts[postId] ? prev[postId] - 1 : prev[postId] + 1,
    }));
  };

  const handleOpenComment = (post) => {
    setSelectedPost(post);
    setOpenCommentModal(true);
  };

  const handleCloseComment = () => {
    setOpenCommentModal(false);
    setSelectedPost(null);
  };

  return (
    <PostContext.Provider value={{
      posts,
      visiblePosts,
      loading,
      hasMore,
      likedPosts,
      likesCount,
      lastPostRef,
      handleLikeToggle,
      handleOpenComment,
      handleCloseComment,
      openCommentModal,
      selectedPost,
      fetchPosts,
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
