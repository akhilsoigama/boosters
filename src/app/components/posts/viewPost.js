"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Avatar, CircularProgress } from "@mui/material";
import MarkdownPreview from "@/app/pages/common/MarkdownPreview";
import { toast } from "sonner";

const ViewPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/post/${postId}`);
        setPost(data);
      } catch (err) {
        toast('Failed to fetch post')
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (loading) return <div className="flex justify-center py-10"><CircularProgress /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-lg mt-5 mb-5 bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <Avatar
          className="
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 
                shadow-lg ring-2 ring-offset-2 ring-indigo-300 dark:ring-indigo-700
              "
        >
          {post.user?.fullName?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{post?.user?.fullName || "Unknown User"}</h2>
          <p className="text-sm text-gray-500">{post?.user?.email}</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{post?.title}</h1>
      {post?.image && <img src={post.image} alt={post.title} className="w-full rounded-lg mb-4 shadow" />}
      <MarkdownPreview content={post?.content} />
    </div>
  );
};

export default ViewPost;
