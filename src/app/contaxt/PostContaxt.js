'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { usePosts } from '../hooks/Post';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const { posts, isLoading, mutate } = usePosts();
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
        if (posts.length > 0) {
            const uniquePosts = Array.from(new Map(posts.map(post => [post._id, post])).values());
            setVisiblePosts(uniquePosts.slice(0, loadCount));
            const likes = {};
            uniquePosts.forEach((post) => (likes[post._id] = post.likes || 0));
            setLikesCount(likes);
        }
    }, [posts]);

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_API, {
            transports: ['websocket'],
        });

        socketRef.current.on('post-liked', (data) => {
            setLikesCount((prev) => ({
                ...prev,
                [data.postId]: data.likeCount,
            }));
        });

        socketRef.current.on('post-commented', (data) => {
            // toast.success(`New comment on post: ${data.postId}`);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const reshufflePosts = useCallback(() => {
        if (posts.length > 0) {
            const shuffledPosts = [...posts].sort(() => Math.random() - 0.5);
            setVisiblePosts(shuffledPosts.slice(0, loadCount));
            setHasMore(true);
        }
    }, [posts]);

    const lastPostRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) loadMorePosts();
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const loadMorePosts = () => {
        const currentLength = visiblePosts.length;
        const nextPosts = posts.slice(currentLength, currentLength + loadCount);
        const updatedPosts = [...visiblePosts, ...nextPosts];
        const uniquePosts = Array.from(new Map(updatedPosts.map(post => [post._id, post])).values());
        setVisiblePosts(uniquePosts);
        if (uniquePosts.length >= posts.length) setHasMore(false);
    };
    

    const handleLikeToggle = (postId) => {
        setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
        setLikesCount((prev) => ({
            ...prev,
            [postId]: likedPosts[postId] ? prev[postId] - 1 : prev[postId] + 1,
        }));

        socketRef.current.emit('like-post', {
            postId,
            likeCount: likesCount[postId] + (likedPosts[postId] ? -1 : 1),
        });
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
