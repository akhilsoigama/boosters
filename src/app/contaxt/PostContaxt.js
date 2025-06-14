'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { io } from 'socket.io-client';
import { usePosts } from '../hooks/Post';
import { useUser } from './userContaxt';
import { useToggleLike } from '../hooks/Comments';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { posts, isLoading, mutate } = usePosts();
  const { toggleLike } = useToggleLike();
  const {user } = useUser(); 
  const userId = user?._id;

  const [visiblePosts, setVisiblePosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
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
        mutate(); // refresh posts data
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
    if (posts.length > 0) {
      const uniquePosts = Array.from(new Map(posts.map(p => [p._id, p])).values());
      setVisiblePosts(uniquePosts.slice(0, loadCount));

      const initialLikes = {};
      uniquePosts.forEach((p) => {
        initialLikes[p._id] = p.likes || 0;
      });
      setLikesCount(initialLikes);
    }
  }, [posts]);

  // 👉 Intersection observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const loadMorePosts = () => {
    const currentLength = visiblePosts.length;
    const nextPosts = posts.slice(currentLength, currentLength + loadCount);
    const updatedPosts = [...visiblePosts, ...nextPosts];
    const uniquePosts = Array.from(new Map(updatedPosts.map(p => [p._id, p])).values());
    setVisiblePosts(uniquePosts);
    if (uniquePosts.length >= posts.length) setHasMore(false);
  };

  // 👉 Like toggle with optimistic UI + backend call + server emit
  const handleLikeToggle = async (postId) => {
    if (!userId) return;

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    setLikesCount((prev) => ({
      ...prev,
      [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1),
    }));

    try {
      await toggleLike({ postId, userId }); // actual backend call
      mutate(); // revalidate posts
    } catch (error) {
      console.error('Toggle like failed:', error);
    }
  };

  const reshufflePosts = useCallback(() => {
    if (posts.length > 0) {
      const shuffled = [...posts].sort(() => Math.random() - 0.5);
      setVisiblePosts(shuffled.slice(0, loadCount));
      setHasMore(true);
    }
  }, [posts]);

  const handleOpenComment = (post) => {
    setSelectedPost(post);
    setOpenCommentModal(true);
  };

  const handleCloseComment = () => {
    setSelectedPost(null);
    setOpenCommentModal(false);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        visiblePosts,
        isLoading,
        hasMore,
        likedPosts,
        likesCount,
        lastPostRef,
        handleLikeToggle,
        handleOpenComment,
        handleCloseComment,
        openCommentModal,
        selectedPost,
        reshufflePosts,
        mutate,
        socketRef,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
