'use client';

import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePost } from '@/app/contaxt/PostContaxt';
import { useUser } from '@/app/contaxt/userContaxt';
import { useProfiles } from '@/app/hooks/Profile';
import {
  useComments,
  useCommentCount,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
} from '@/app/hooks/Comments';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';

const CommentModal = ({ open, handleClose, selectedPost, setCommentCount }) => {
  const { socketRef } = usePost();
  const { user } = useUser();
  const { profiles } = useProfiles();

  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { comments, mutate, isLoading } = useComments(selectedPost?._id);
  const { count, isLoading: isCountLoading } = useCommentCount(selectedPost?._id);
  const { addComment } = useAddComment();
  const { updateComment } = useUpdateComment();
  const { deleteComment } = useDeleteComment();

  useEffect(() => {
    setCommentCount?.(count ?? 0);
  }, [count]);

  useEffect(() => {
    const handleCommentUpdate = () => mutate();
    socketRef.current?.on("refresh-comments", handleCommentUpdate);
    return () => {
      socketRef.current?.off("refresh-comments", handleCommentUpdate);
    };
  }, [mutate, socketRef]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedPost?._id || !user?._id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentData = {
        postId: selectedPost._id,
        comment: newComment,
        userId: user._id,
        userName: user.fullName || 'Anonymous',
      };

      await addComment(commentData);
      socketRef.current?.emit('comment-post', commentData);

      toast.success('Comment added!');
      setNewComment('');
      mutate();
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.content || '');
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateComment({ commentId: id, content: editingText });
      toast.success('Comment updated');
      setEditingId(null);
      setEditingText('');
      mutate();
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      toast.success('Comment deleted');
      mutate();
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    toast.info('Like functionality coming soon!');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="bg-white dark:bg-gray-900 w-full sm:w-[500px] mx-auto mt-32 rounded-xl overflow-hidden flex flex-col h-[70vh]">
        <Box className="p-4 border-b border-gray-300 dark:border-gray-700 text-center font-semibold text-lg">
          Comments ({isCountLoading ? '...' : count ?? 0})
        </Box>

        <Box className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {isLoading ? (
            <Typography className="text-gray-500 text-center py-4">
              Loading comments...
            </Typography>
          ) : comments?.length > 0 ? (
            comments.map((comment) => {
              const profile = profiles?.find(p => p.userId?._id === comment.userId);
              const isAuthor = user?._id === comment.userId;

              return (
                <Box key={comment._id} className="flex items-start space-x-3">
                  <Avatar sx={{ width: 32, height: 32 }} src={profile?.avatar || ''}>
                    {(!profile?.avatar && (profile?.name || comment.userName)?.charAt(0).toUpperCase()) || 'U'}
                  </Avatar>
                  <Box className="flex-1">
                    <Typography variant="subtitle2" className="font-semibold">
                      {profile?.name || comment.userName || 'Anonymous'}
                    </Typography>

                    {editingId === comment._id ? (
                      <TextField
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        fullWidth
                        variant="standard"
                        multiline
                      />
                    ) : (
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </Typography>
                    )}

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

                      {isAuthor && (
                        <>
                          {editingId === comment._id ? (
                            <>
                              <IconButton size="small" onClick={() => handleSaveEdit(comment._id)} aria-label="save">
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => setEditingId(null)} aria-label="cancel">
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton size="small" onClick={() => handleEdit(comment)} aria-label="edit">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete(comment._id)} aria-label="delete">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography className="text-gray-500 text-center py-4">
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
              className: 'dark:text-white',
            }}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            className="ml-2 text-blue-500 font-semibold capitalize"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentModal;
