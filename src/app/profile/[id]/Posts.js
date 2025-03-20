'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Avatar, CardContent, CardActions, IconButton } from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'sonner';
import SkeletonLoader from '@/app/components/SkeletonLoader';
import MarkdownPreview from '@/app/pages/common/MarkdownPreview';
import { useUser } from '@/app/contaxt/userContaxt';

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

  const renderedPosts = useMemo(() => (
    posts.map((post, i) => (
      <motion.div
        key={post._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
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
              src={post.image || '/fallback.jpg'}
              alt={post.title || 'Post image'}
              className="w-xl h-auto rounded-md"
              onError={(e) => { e.target.src = '/fallback.jpg'; }}
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
    ))
  ), [posts]);

  return (
    <div className="min-h-screen p-6 pt-20 w-full flex justify-center bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-6 max-w-md lg:max-w-2xl grid gap-3 mb-10 place-items-center">
          {renderedPosts}
        </div>
      )}
    </div>
  );
};

export default Posts;
