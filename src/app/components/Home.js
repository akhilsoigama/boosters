'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Avatar, CardContent, CardActions, IconButton } from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import MarkdownPreview from '../pages/common/MarkdownPreview';
import { useUser } from '../contaxt/userContaxt';
import { toast } from 'sonner';
import SkeletonLoader from './SkeletonLoader';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadCount = 4;
  const observer = useRef();
  const { user } = useUser();

  const shuffleArray = useCallback((array) => {
    array.forEach((_, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    });
    return array;
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`/api/post`, {
        params: { User_Id: user._id, limit: 10 }
      });

      if (response.data?.length > 0) {
        const shuffled = shuffleArray(response.data);
        setPosts(shuffled);
        setVisiblePosts(shuffled.slice(0, loadCount));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [user?._id, shuffleArray]);


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

  if (loading) {
    return (
      <div className="min-h-screen p-6 pt-20 w-full flex justify-center bg-gray-50 dark:bg-gray-900">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-20 w-full flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6 max-w-md lg:max-w-2xl grid grid-cols-1 place-items-center">
        {visiblePosts.map((post, i) => {
          const isLast = i === visiblePosts.length - 1;
          return (
            <motion.div
              key={i}
              ref={isLast ? lastPostRef : null}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className="w-full"
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
                <CardHeader
                  avatar={
                    <Avatar className="bg-blue-500 dark:bg-blue-700">
                      {post.User_id?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  }
                  action={<IconButton aria-label="settings" className="dark:text-white"><MoreVert /></IconButton>}
                  title={<span className="dark:text-white">{post.User_id?.fullName || 'Unknown User'}</span>}
                  subheader={<span className="dark:text-gray-400">{post.User_id?.email || ''}</span>}
                  className="bg-blue-50 dark:bg-gray-700 italic"
                />
                <CardContent className="w-full flex justify-center">
                  <img
                    src={post.image || '/path/to/fallback/image.jpg'}
                    alt={post.title || 'Post image'}
                    className="w-xl h-auto rounded-md"
                    onError={(e) => { e.target.src = '/path/to/fallback/image.jpg'; }}
                  />
                </CardContent>
                <CardContent className="h-60 overflow-scroll scrollbar-hide w-full">
                  <MarkdownPreview content={post.content} />
                </CardContent>
                <CardActions disableSpacing className="bg-gray-100 dark:bg-gray-700">
                  <IconButton aria-label="add to favorites">
                    <Favorite className="text-red-500 dark:text-red-400" />
                  </IconButton>
                  <IconButton aria-label="share">
                    <Share className="text-blue-500 dark:text-blue-400" />
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
          );
        })}
        {!hasMore && <p className="text-gray-500 dark:text-gray-400 text-center">No more posts to load.</p>}
      </div>
    </div>
  );
};

export default HomePage;