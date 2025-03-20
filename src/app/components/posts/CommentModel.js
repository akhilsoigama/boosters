'use client';
import { usePost } from '@/app/contaxt/PostContaxt';
import { Modal, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import { useState } from 'react';

const CommentModal = ({
  open,
  handleClose,
  selectedPost,
  comments = [],
}) => {
  const [newComment, setNewComment] = useState('');
  const { handleCommentSubmit } = usePost();

  const onSubmit = () => {
    if (newComment.trim() && selectedPost?._id) {
      handleCommentSubmit(selectedPost._id, newComment);
      setNewComment('');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="bg-white dark:bg-gray-900 w-[400px] sm:w-[500px] mx-auto mt-32 rounded-xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <Box className="p-4 border-b border-gray-300 dark:border-gray-700 text-center font-semibold text-lg">
          Comments
        </Box>

        {/* Comments List */}
        <Box className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={index} className="flex items-start space-x-3">
                <Avatar sx={{ width: 32, height: 32 }}>
                  {comment.userName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-800 dark:text-white">
                    {comment.userName || 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography className="text-gray-500 dark:text-gray-400">No comments yet.</Typography>
          )}
        </Box>

        {/* Add Comment */}
        <Box className="flex items-center border-t border-gray-300 dark:border-gray-700 p-4">
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { background: 'transparent', color: '#333', paddingLeft: 8 },
            }}
            className="dark:text-white"
          />
          <Button
            onClick={onSubmit}
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
