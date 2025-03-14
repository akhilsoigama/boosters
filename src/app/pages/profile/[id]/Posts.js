'use client';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Avatar, CardContent, CardActions, IconButton, Skeleton } from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '@/app/contaxt/userContaxt';
import MarkdownPreview from '../../common/MarkdownPreview';

const Posts = ({ ids }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const { user } = useUser();

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/create-post`, {
                params: {
                    User_Id: user._id,
                },
            });
            if (response.data?.length > 0) {
                const postsWithUserData = await Promise.all(
                    response.data.map(async (post) => {
                        const userResponse = await axios.get(`${baseUrl}/api/users/${post.User_id}`);
                        return { ...post, userData: userResponse.data };
                    })
                );
                const filteredPosts = postsWithUserData.filter(post => post.User_id === ids);
                
                setPosts(filteredPosts);
            }
        } catch (error) {
            toast.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPosts();
        }
    }, [user, ids]); 

    if (loading) {
        return (
            <div className="min-h-screen p-6 pt-20 w-full flex justify-center">
                <div className="space-y-6 max-w-md lg:max-w-2xl grid grid-cols-1  place-items-center">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="w-full"
                        >
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
                                <CardHeader
                                    avatar={
                                        <Skeleton variant="circular" width={40} height={40} />
                                    }
                                    title={<Skeleton variant="text" width={150} />}
                                    subheader={<Skeleton variant="text" width={100} />}
                                    className="bg-blue-50 dark:bg-gray-700 italic"
                                />
                                <CardContent className="w-full flex justify-center">
                                    <Skeleton variant="rectangular" width={512} height={256} />
                                </CardContent>
                                <CardContent className="h-60 overflow-y-auto w-full">
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                </CardContent>
                                <CardActions disableSpacing className="bg-gray-100 dark:bg-gray-700">
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="circular" width={40} height={40} />
                                </CardActions>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pt-20 w-full flex justify-center ">
            <div className="space-y-6 max-w-md lg:max-w-2xl grid gap-3  place-items-center">
                {posts.map((post, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="w-full "
                    >
                        <Card className="shadow-lg  hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
                            <CardHeader
                                avatar={
                                    <Avatar
                                        className="bg-blue-500 dark:bg-blue-700"
                                    >
                                        {post.userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings" className="dark:text-white">
                                        <MoreVert />
                                    </IconButton>
                                }
                                title={<span className="dark:text-white">{post.userData?.fullName || 'Unknown User'}</span>}
                                subheader={<span className="dark:text-gray-400">{post.userData?.email || ''}</span>}
                                className="bg-blue-50 dark:bg-gray-700 italic"
                            />
                            <CardContent className="w-full flex justify-center">
                                <img
                                    src={post.image || '/path/to/fallback/image.jpg'}
                                    alt={post.title || 'Post image'}
                                    className="w-xl h-auto rounded-md"
                                    onError={(e) => {
                                        e.target.src = '/path/to/fallback/image.jpg';
                                    }}
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
                ))}
            </div>
        </div>
    );
};

export default Posts;