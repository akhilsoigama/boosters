'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Avatar, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TurndownService from 'turndown';
import { useUser } from '../contaxt/userContaxt';
import Image from 'next/image';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const { user } = useUser();
    const firstLetter = user?.fullName?.charAt(0).toUpperCase() || 'U';
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/create-post`, {
                params: {
                    User_Id: user._id, 
                },
            });
            console.log(response.config.params)
            if (response.data) {
                const data = response.data;
                if (data.length > 0) {
                    setPosts(data); 
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPosts(); 
        }
    }, [user]);

    const turndownService = new TurndownService();
    const convertHtmlToMarkdown = (html) => {
        return turndownService.turndown(html);
    };

    const MarkdownPreview = ({ content }) => {
        const markdownContent = convertHtmlToMarkdown(content);

        return (
            <div className="mt-4 p-4 rounded-lg prose dark:prose-invert">
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
        );
    };

    return (
        <div className="min-h-screen p-6 pt-20 w-full flex justify-center bg-gray-50 dark:bg-gray-900">
            <div className="space-y-6 max-w-md lg:max-w-2xl grid grid-cols-1 place-items-center">
                {posts.map((post, i) => (
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
                                    <Avatar
                                        src={firstLetter}
                                        alt={firstLetter}
                                        className="bg-blue-500 dark:bg-blue-700"
                                    >
                                        {firstLetter.charAt(0)}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings" className="dark:text-white">
                                        <MoreVert />
                                    </IconButton>
                                }
                                title={<span className="dark:text-white">{user?user.fullName.toUpperCase():'U'}</span>}
                                subheader={<span className="dark:text-gray-400">{user?user.email:null}</span>}
                                className="bg-blue-50 dark:bg-gray-700 italic"
                            />
                            <CardContent className="w-full flex justify-center">
                                <img
                                    src={post.image}
                                    alt={post.title}
                               
                                    className="w-xl h-auto rounded-md"
                                />
                            </CardContent>
                            <CardContent className="h-60 overflow-y-auto w-full">
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

export default HomePage;