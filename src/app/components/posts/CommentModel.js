'use client';
import { usePost } from '@/app/contaxt/PostContaxt';
import { Modal, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/app/contaxt/userContaxt';
import axios from 'axios';

const CommentModal = ({ open, handleClose, selectedPost }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socketRef } = usePost();
  const { user } = useUser();

  const fetchComments = async () => {
    try {
      if (!selectedPost?._id) return;
      
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/comment/${selectedPost._id}`);
      
      const commentsData = response.data || [];
      
      setComments(commentsData.map(comment => ({
        ...comment,
        text: comment.comment,
        likes: comment.likes || []
      })));
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load comments');
        console.error('Error fetching comments:', error);
      }
      setComments([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedPost?._id || !user?._id) return;

    try {
      const commentData = {
        postId: selectedPost._id,
        comment: newComment,
        userId: user._id,
        userName: user.fullName || "Anonymous"
      };

      socketRef.current?.emit('comment-post', commentData);

      toast.success('Comment sent!');
      setNewComment('');
    } catch (error) {
      toast.error('Failed to post comment');
      console.error('Error submitting comment:', error);
    }
  };

  useEffect(() => {
    if (!open || !selectedPost?._id) return;

    const socket = socketRef.current;
    if (!socket) return;

    const handleNewComment = (comment) => {
      if (comment.postId === selectedPost._id) {
        setComments(prev => [...prev, {
          ...comment,
          text: comment.comment,
          likes: comment.likes || []
        }]);
      }
    };

    const handleCommentLiked = (data) => {
      setComments(prev => prev.map(c => 
        c._id === data.commentId 
          ? { ...c, likes: data.likes || [] } 
          : c
      ));
    };

    socket.on('post-commented', handleNewComment);
    socket.on('post-liked', handleCommentLiked);

    fetchComments();

    return () => {
      socket.off('post-commented', handleNewComment);
      socket.off('post-liked', handleCommentLiked);
    };
  }, [open, selectedPost?._id]); // socketRef.current ko hata diya yahan se


  const handleLikeComment = async (commentId) => {
    try {
      toast.info('Like functionality to be implemented');
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  if (!selectedPost) return null;

  const filteredComments = comments.filter(c => c.postId === selectedPost._id);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="bg-white dark:bg-gray-900 w-full sm:w-[500px] mx-auto mt-32 rounded-xl overflow-hidden flex flex-col h-[70vh]">
        <Box className="p-4 border-b border-gray-300 dark:border-gray-700 text-center font-semibold text-lg">
          Comments ({filteredComments.length})
        </Box>

        <Box className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <Typography className="text-gray-500 dark:text-gray-400 text-center py-4">
              Loading comments...
            </Typography>
          ) : filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <Box key={comment._id} className="flex items-start space-x-3">
                <Avatar sx={{ width: 32, height: 32 }}>
                  {comment.userName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box className="flex-1">
                  <Typography variant="subtitle2" className="font-semibold">
                    {comment.userName || 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    {comment.text || comment.comment}
                  </Typography>
                  <Box className="flex items-center mt-1 space-x-4">
                    <Typography variant="caption" className="text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                    <Button 
                      size="small" 
                      className="text-gray-500"
                      onClick={() => handleLikeComment(comment._id)}
                    >
                      Like ({comment.likes?.length || 0})
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>

        <Box className="flex items-center border-t border-gray-300 dark:border-gray-700 p-4">
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            InputProps={{
              disableUnderline: true,
              className: "dark:text-white"
            }}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="ml-2 text-blue-500 font-semibold capitalize"
          >
            Post
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentModal;