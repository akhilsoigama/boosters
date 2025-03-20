'use client';
import { Card, CardHeader, Avatar, CardContent, CardActions, IconButton } from '@mui/material';
import { Favorite, Share, MoreVert, Comment as CommentIcon } from '@mui/icons-material';
import { usePost } from '@/app/contaxt/PostContaxt';
import MarkdownPreview from '@/app/pages/common/MarkdownPreview';


const PostCard = ({ post, liked, likeCount }) => {
  const { handleLikeToggle, handleOpenComment } = usePost();

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
      <CardHeader
        avatar={
          <Avatar className="bg-blue-500 dark:bg-blue-700">
            {post.User_id?.fullName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        }
        action={<IconButton className="dark:text-white"><MoreVert /></IconButton>}
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

      <CardContent className="h-60 overflow-auto scrollbar-hide w-full">
        <MarkdownPreview content={post.content} />
      </CardContent>

      <CardActions className="bg-gray-100 dark:bg-gray-700">
        <IconButton onClick={() => handleLikeToggle(post._id)}>
          <Favorite className={`text-red-500 dark:text-red-400 ${liked ? 'fill-current' : ''}`} />
          <span className="ml-1">{likeCount}</span>
        </IconButton>

        <IconButton onClick={() => handleOpenComment(post)}>
          <CommentIcon className="text-green-500 dark:text-green-400" />
        </IconButton>

        <IconButton><Share className="text-blue-500 dark:text-blue-400" /></IconButton>
      </CardActions>
    </Card>
  );
};

export default PostCard;
