'use client';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { CircularProgress, Box } from '@mui/material';
import PostCard from '../posts/PostCard';
import { useRandomPosts } from '@/app/hooks/RandomPost';

const RandomPostsPage = () => {
  const { posts, isLoading, likedPosts, likesCount, toggleLike } = useRandomPosts();
  const observerRef = useRef(null);
  const loadCount = 10;

  const [visiblePosts, setVisiblePosts] = useState([]);

  useEffect(() => {
    if (posts.length > 0 && visiblePosts.length === 0) {
      setVisiblePosts(posts.slice(0, loadCount));
    }
  }, [posts]);

  const lastPostRef = useCallback((node) => {
    if (isLoading || !node) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && posts.length > visiblePosts.length) {
        setVisiblePosts((prev) => {
          const newPosts = posts.slice(prev.length, prev.length + loadCount);
          return Array.from(new Map([...prev, ...newPosts].map(post => [post._id, post])).values());
        });
      }
    }, { threshold: 0.1 });

    observerRef.current.observe(node);
  }, [isLoading, posts, visiblePosts]);

  if (isLoading && visiblePosts.length === 0) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }
  const uniquePosts = useMemo(() => {
    const postMap = new Map();
    posts.forEach((post) => postMap.set(post._id, post)); 
    return Array.from(postMap.values());
  }, [posts]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        {uniquePosts.map((post, index) => (
          <div
            key={`${post._id}-${index}`} 
            ref={index === uniquePosts.length - 1 ? lastPostRef : null}
            className="transform transition duration-500 hover:scale-[1.02]"
          >
            <PostCard
              post={post}
              liked={likedPosts[post._id] || false}
              likeCount={likesCount[post._id] || 0}
              onLike={() => toggleLike(post._id)}
            />
          </div>
        ))}
      </div>

      {isLoading && uniquePosts.length > 0 && (
        <Box className="flex justify-center mt-8">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default RandomPostsPage;
