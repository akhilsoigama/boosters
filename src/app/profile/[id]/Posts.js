'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import SkeletonLoader from '@/app/components/SkeletonLoader';
import { useUser } from '@/app/contaxt/userContaxt';
import PostCard from '@/app/components/posts/PostCard';

const Posts = ({ ids }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/post', {
        params: { User_Id: user._id, limit: 20 }
      });

      if (response.data?.length > 0) {
        setPosts(response.data);
      } else {
        toast.error('No posts found');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) fetchPosts();
  }, [user, ids]);

  const handleOpenComment = (post) => {
    setOpenCommentPost(post);
  };

  const handleCloseComment = () => {
    setOpenCommentPost(null);
  };

  const renderedPosts = useMemo(() => (
    posts.map((post, i) => (
      <motion.div
        key={post._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="w-full"
      >
        <PostCard
          post={post}
          handleOpenComment={handleOpenComment}
        />
      </motion.div>
    ))
  ), [posts]);

  return (
    <div className="min-h-screen p-4 pt-20 w-full flex justify-center bg-gradient-to-b dark:from-gray-950 dark:to-gray-950">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-6  max-w-md lg:max-w-2xl grid gap-6 mb-10">
          {renderedPosts}
        </div>
      )}
    </div>
  );
};

export default Posts;
