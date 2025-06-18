"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProfiles } from "@/app/hooks/Profile";
import { useUser } from "@/app/contaxt/userContaxt";
import { usePosts } from "@/app/hooks/Post";
import { Avatar } from "@mui/material";
import MarkdownPreview from "@/app/pages/common/MarkdownPreview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SkeletonLoader from "../SkeletonLoader";

const ViewPost = () => {
  const { postId } = useParams();
  const router = useRouter();
  const { profiles, isLoading: profilesLoading } = useProfiles();
  const { getPostById } = usePosts();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const result = await getPostById(postId);
      if (result) setPost(result);
      setLoading(false);
    };
    if (postId) fetchPost();
  }, [postId, getPostById]);

  const matchedProfile = useMemo(() => {
    return profiles?.find((p) => p.userId?._id === post?.userId);
  }, [profiles, post]);

  const displayName =
    matchedProfile?.name || post?.user?.fullName || "Unknown User";
  const avatarSrc = matchedProfile?.avatar || undefined;
  const userInitial = displayName.charAt(0).toUpperCase();

  if (loading || profilesLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] dark:bg-gray-950 bg-gray-50">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen  pb-20 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-6">
       
        <div className="mb-4">
          <Button
            variant="ghost"
            className="flex items-center mt-10 gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => router.back() || router.push('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card className="rounded-2xl shadow-md dark:bg-gray-900 bg-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar
                src={avatarSrc}
                alt={displayName}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: avatarSrc ? "transparent" : "#673ab7",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 22,
                }}
              >
                {!avatarSrc && userInitial}
              </Avatar>
              <div>
                <CardTitle className="text-lg text-gray-800 dark:text-white">
                  {displayName}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {post?.user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <h1 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
              {post?.title}
            </h1>

            {post?.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full max-h-[400px] object-cover rounded-xl mb-6 shadow"
              />
            )}

            <div className="prose dark:prose-invert max-w-none">
              <MarkdownPreview content={post?.content} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewPost;
