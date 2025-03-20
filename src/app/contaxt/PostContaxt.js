'use client';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from './userContaxt';
import { io } from 'socket.io-client';

export const PostContext = createContext();
let socket; // global socket

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

  // ✅ Initialize Socket.io (Replace with your Railway / Vercel Socket URL)
  useEffect(() => {
    const socket = io('https://caboose.proxy.rlwy.net:22628', { transports: ['websocket'] });


    // Listen for real-time likes
    socket.on('post-liked', (data) => {
      setLikesCount((prev) => ({
        ...prev,
        [data.postId]: data.likeCount,
      }));
    });

    // Listen for real-time comments (optional if you want to show instantly)
    socket.on('post-commented', (data) => {
      toast.success(`New comment on post: ${data.postId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ✅ Fetch Posts
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

  // ✅ Infinite Scroll Observer
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

  // ✅ Like Toggle with Socket Emit
  const handleLikeToggle = (postId) => {
    const updatedLiked = !likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: updatedLiked }));

    const newLikeCount = updatedLiked
      ? (likesCount[postId] || 0) + 1
      : (likesCount[postId] || 1) - 1;

    setLikesCount((prev) => ({
      ...prev,
      [postId]: newLikeCount,
    }));

    // Emit like event to server
    socket.emit('like-post', { postId, likeCount: newLikeCount });
  };

  // ✅ Comment Modal Controls
  const handleOpenComment = (post) => {
    setSelectedPost(post);
    setOpenCommentModal(true);
  };

  const handleCloseComment = () => {
    setOpenCommentModal(false);
    setSelectedPost(null);
  };

  // ✅ Comment Submit (Optional Socket emit for real-time)
  const handleCommentSubmit = (comment) => {
    socket.emit('comment-post', { postId: selectedPost._id, comment });
    toast.success('Comment added!');
    handleCloseComment();
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
      handleCommentSubmit,
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
