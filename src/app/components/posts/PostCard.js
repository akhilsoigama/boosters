"use client";
import { Card, CardHeader, Avatar, CardContent, CardActions, IconButton } from "@mui/material";
import { Favorite, Share, Comment as CommentIcon, MoreVert } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { usePost } from "@/app/contaxt/PostContaxt";
import MarkdownPreview from "@/app/pages/common/MarkdownPreview";
import CommentModal from "./CommentModel";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/contaxt/userContaxt";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PostCard = ({ post, liked, likeCount, commentCount }) => {
  const { handleLikeToggle } = usePost();
  const [openModal, setOpenModal] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter()
  const userId = useMemo(() => {
    return user ? user._id : "";
  }, [user]);
  const isSpecificRoute = pathname === `/profile/${userId}`;

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`/api/post/${postId}`);

      if (res.status === 200) {
        toast.success("Post deleted successfully");
        window.location.reload();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  return (
    <>
      <Card
        className="
          shadow-xl 
          bg-gradient-to-br from-white via-blue-50 to-indigo-100 
          dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 
          rounded-2xl 
          overflow-hidden 
          border border-gray-200 dark:border-indigo-900 
          transition-shadow duration-100
        "
      >
        <Link href={`/profile/${post.User_id?._id}`}>
          <CardHeader
            avatar={
              <Avatar
                className="
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 
                shadow-lg ring-2 ring-offset-2 ring-indigo-300 dark:ring-indigo-700
              "
              >
                {post.User_id?.fullName?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            }
            title={
              <span className="font-semibold text-gray-900 dark:text-indigo-100 tracking-tight">
                {post.User_id?.fullName || "Unknown User"}
              </span>
            }
            subheader={
              <span className="text-sm text-gray-600 dark:text-indigo-300">
                {post.User_id?.email || ""}
              </span>
            }
            className="
            bg-gradient-to-r from-gray-100 to-blue-50 
            dark:from-gray-800 dark:via-indigo-900 dark:to-gray-900 
            px-4 py-2 
            border-b border-gray-200 dark:border-indigo-800
          "
            action={
              isSpecificRoute && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton className="text-gray-700 dark:text-indigo-200 hover:bg-gray-200 dark:hover:bg-indigo-800 p-2 h-[40px] w-[40px] rounded-full shadow-md">
                      <MoreVert />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push(`/pages/createPost?postId=${post._id}`)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/pages/${post._id}`)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(post._id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
          />
        </Link>
        {post.image && (
          <div className="w-full max-h-[350px] overflow-hidden flex justify-center items-center ">
            <img
              src={post.image}
              alt={post.title || "Post image"}
              className="w-full object-cover transition-transform duration-300 hover:scale-105  shadow-md"
              onError={(e) => (e.target.src = "/path/to/fallback/image.jpg")}
            />
          </div>
        )}

        <CardContent
          className="
            px-4 py-3 h-60 overflow-auto scrollbar-hide 
            text-gray-800 dark:text-indigo-200 
            bg-gradient-to-b from-transparent to-gray-50/10 
            dark:from-slate-900 dark:to-indigo-950
          "
        >
          <MarkdownPreview content={post.content} />
        </CardContent>

        <CardActions
          className="
            bg-gradient-to-r from-gray-100 to-blue-50 
            dark:from-gray-900 dark:via-indigo-900 dark:to-gray-800 
            flex justify-between 
            px-4 py-2 
            border-t border-gray-200 dark:border-indigo-800
          "
        >
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => handleLikeToggle(post._id)}
              className="
                text-red-500 dark:text-red-400 
                hover:bg-red-100 dark:hover:bg-red-900/50 
                rounded-full p-2
              "
            >
              <Favorite className={liked ? "fill-current" : ""} />
            </IconButton>
            <span className="text-sm font-medium text-gray-700 dark:text-indigo-300">
              {likeCount}
            </span>

            <IconButton
              onClick={() => setOpenModal(true)}
              className="
                text-green-500 dark:text-green-400 
                hover:bg-green-100 dark:hover:bg-green-900/50 
                rounded-full p-2
              "
            >
              <CommentIcon />
            </IconButton>
            <span className="text-sm font-medium text-gray-700 dark:text-indigo-300">
              {commentCount}
            </span>
          </div>

          <IconButton
            className="
              text-blue-500 dark:text-blue-400 
              hover:bg-blue-100 dark:hover:bg-blue-900/50 
              rounded-full p-2
            "
          >
            <Share />
          </IconButton>
        </CardActions>
      </Card>

      <CommentModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        selectedPost={post}
      />
    </>
  );
};

export default PostCard;