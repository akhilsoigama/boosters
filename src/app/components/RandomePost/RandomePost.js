'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import PostCard from '../posts/PostCard';
import { useRandomPosts } from '@/app/hooks/RandomPost';
import SkeletonLoader from '../SkeletonLoader';

const RandomPostsPage = () => {
  const { posts, isLoading, likedPosts, likesCount} = useRandomPosts();
  const observerRef = useRef(null);
  const loadCount = 10;

  const [visiblePosts, setVisiblePosts] = useState([]);

  useEffect(() => {
    if (posts.length > 0 && visiblePosts.length === 0) {
      setVisiblePosts(posts.slice(0, loadCount));
    }
  }, [posts]);

  const lastPostRef = useCallback(
    (node) => {
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
    },
    [isLoading, posts, visiblePosts]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && posts.length === 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {visiblePosts.map((post, index) => (
            <div
              key={`${post._id}-${index}`}
              ref={index === visiblePosts.length - 1 ? lastPostRef : null}
              className="transform transition duration-500 hover:scale-[1.02]"
            >
              <PostCard
                post={post}
                liked={likedPosts[post._id] || false}
                likeCount={likesCount[post._id] || 0}
                isLoading={false}
              />
            </div>
          ))}
        </div>
      )}

      {isLoading && posts.length > 0 && (
        <Box className="flex justify-center mt-8">
          <SkeletonLoader />
        </Box>
      )}
    </div>
  );  
};

export default RandomPostsPage;
