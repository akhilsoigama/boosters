'use client';

import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import {
  Favorite,
  Share,
  Comment as CommentIcon,
  MoreVert,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { usePost } from '@/app/contaxt/PostContaxt';
import MarkdownPreview from '@/app/pages/common/MarkdownPreview';
import CommentModal from './CommentModel';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/app/contaxt/userContaxt';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { mutate } from 'swr';
import { useProfiles } from '@/app/hooks/Profile';
import {
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from 'date-fns';
import SkeletonLoader from '../SkeletonLoader';
import ShareModal from '../shareModel/ShareModel';

const PostCard = ({ post, liked, likeCount, commentCount, isLoading }) => {
  const { handleLikeToggle } = usePost();
  const [openModal, setOpenModal] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [commentCountState, setCommentCountState] = useState(
    commentCount || post?.commentCount || 0
  );

  const { profiles } = useProfiles();
  const userId = useMemo(() => (user ? user._id : ''), [user]);
  const isOwnProfileRoute = pathname === `/profile/${userId}`;

  const matchedProfile = profiles?.find(
    (p) => p.userId?._id === post?.User_id?._id
  );

  const displayName = matchedProfile?.name || post?.User_id?.fullName || 'Unknown User';
  const avatarSrc = matchedProfile?.avatar || null;
  const userInitial = displayName.charAt(0).toUpperCase();

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/api/post/${deleteTargetId}`);
      toast.success('Post deleted successfully!');
      mutate('/api/posts');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Unknown';
    try {
      const date = parseISO(createdAt);
      const now = new Date();

      const years = differenceInYears(now, date);
      if (years > 0) return `${years}y`;

      const months = differenceInMonths(now, date);
      if (months > 0) return `${months}mo`;

      const days = differenceInDays(now, date);
      if (days > 0) return `${days}d`;

      const hours = differenceInHours(now, date);
      if (hours > 0) return `${hours}h`;

      const minutes = Math.floor((now - date) / (1000 * 60));
      if (minutes > 0) return `${minutes}m`;

      const seconds = Math.floor((now - date) / 1000);
      if (seconds > 0) return `${seconds}s`;

      return 'Just now';
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) return <SkeletonLoader />;

  const createdAt = getTimeAgo(post.createdAt);

  return (
    <>
      <Card className="shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-indigo-900 transition-shadow duration-100">
        <CardHeader
          avatar={
            <Link href={`/profile/${post.User_id?._id}`}>
              <Avatar
                src={avatarSrc || undefined}
                className={`shadow-lg ring-1 ring-offset-1 ring-indigo-300 dark:ring-indigo-700 cursor-pointer ${avatarSrc
                  ? ''
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600'
                  }`}
              >
                {!avatarSrc && userInitial}
              </Avatar>
            </Link>
          }
          title={
            <span className="font-semibold text-gray-900 dark:text-indigo-100 tracking-tight">
              {displayName} • {createdAt}
            </span>
          }
          subheader={
            <span className="text-sm text-gray-600 dark:text-indigo-300">
              {post.title}
            </span>
          }
          className="bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:via-indigo-900 dark:to-gray-900 px-4 py-2 border-b border-gray-200 dark:border-indigo-800"
          action={
            isOwnProfileRoute && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton className="text-gray-700 dark:text-indigo-200 hover:bg-gray-200 dark:hover:bg-indigo-800 p-2 h-[40px] w-[40px] rounded-full shadow-md">
                    <MoreVert />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/pages/createPost/${post._id}`);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/pages/${post._id}`);
                    }}
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => confirmDelete(post._id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        />

        {post.image && (
          <div className="w-full max-h-[350px] overflow-hidden flex justify-center items-center">
            <img
              src={post.image}
              alt={post.title || 'Post image'}
              className="w-full object-cover transition-transform duration-300 hover:scale-105 shadow-md"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/fallback/image.jpg';
              }}
            />
          </div>
        )}

        <CardContent className="px-4 py-3 h-60 overflow-auto scrollbar-hide text-gray-800 dark:text-indigo-200 bg-gradient-to-b from-transparent to-gray-50/10 dark:from-slate-900 dark:to-indigo-950">
          <MarkdownPreview content={post.content} />
        </CardContent>

        <CardActions className="bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-800 flex justify-between px-4 py-2 border-t border-gray-200 dark:border-indigo-800">
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => handleLikeToggle(post._id)}
              className="text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full p-2"
            >
              <Favorite className={liked ? 'fill-current' : ''} />
            </IconButton>
            <span className="text-sm font-medium text-gray-700 dark:text-indigo-300">
              {likeCount}
            </span>

            <IconButton
              onClick={() => setOpenModal(true)}
              className="text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full p-2"
            >
              <CommentIcon />
            </IconButton>
            <span className="text-sm font-medium text-gray-700 dark:text-indigo-300">
              {commentCountState}
            </span>
          </div>

          <IconButton
            onClick={() => setShareOpen(true)}
            className="text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full p-2"
          >
            <Share />
          </IconButton>
        </CardActions>
      </Card>

      {/* Comment Modal */}
      <CommentModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        selectedPost={post}
        setCommentCount={setCommentCountState}
      />

      {/* Share Modal */}
      <ShareModal
        open={shareOpen}
        handleClose={() => setShareOpen(false)}
        postId={post._id}
        />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          className: 'rounded-xl dark:bg-gray-900 bg-white',
          sx: { minWidth: 320 },
        }}
      >
        <DialogTitle className="text-lg font-semibold dark:text-white text-gray-800">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography className="text-sm dark:text-gray-300 text-gray-600">
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="flex justify-end px-4 py-2">
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            className="text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
            className="text-white"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;
