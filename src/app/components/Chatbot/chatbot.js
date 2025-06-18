'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import MarkdownPreview from '@/app/pages/common/MarkdownPreview';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import Image from 'next/image';

const fetcher = async (url, { arg }) => {
    try {
        const response = await axios.post(url, {
            messages: [{ role: 'user', content: arg.message }],
            model: 'deepseek/deepseek-chat:free',
            temperature: 0.7,
            max_tokens: 4096,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error?.message || 'Failed to fetch response');
    }
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const { trigger: sendMessage, isMutating: isLoading } = useSWRMutation('/api/chatbot', fetcher);

    useEffect(() => {
        setMessages([
            { text: "👋 Hello! I'm your Boosters AI assistant. How can I help you today?", sender: 'bot' },
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        try {
            const data = await sendMessage({ message: inputValue });
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
                setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: error.message || 'Failed to connect to DeepSeek AI.', sender: 'bot' }]);
        }
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
    };

    return (
        <div className="flex flex-col h-[84vh] bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/logo-transparent-svg.svg"
                        alt="Booster"
                        width={150}
                        height={90}
                        priority
                    />
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon fontSize="small" />}
                    onClick={() => setMessages([{ text: "👋 Hello! I'm your DeepSeek AI assistant. How can I help you today?", sender: 'bot' }])}
                >New Chat
                </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] max-h-[300px] overflow-y-auto px-4 py-3 rounded-lg ${message.sender === 'user'
                                    ? ' rounded-br-none'
                                    : ' dark:bg-gray-800 text-gray-800  border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start space-x-2">
                                        {message.sender === 'bot' && (
                                            <div className="w-6 h-6  dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mt-1 flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="overflow-x-auto dark:text-white break-words w-full">
                                            <MarkdownPreview content={message?.text} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm rounded-bl-none max-w-[85%]">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-3xl mx-auto">
                    <div className="relative">
                        <TextField
                            fullWidth
                            multiline
                            maxRows={6}
                            variant="outlined"
                            placeholder="Message DeepSeek Chat..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isLoading}
                            InputProps={{
                                sx: {
                                    borderRadius: '12px',
                                    paddingRight: '56px',
                                    color: 'inherit',
                                    '& input': {
                                        color: 'inherit',
                                    },
                                    '& textarea': {
                                        color: 'inherit',
                                    },
                                    '&:hover fieldset': { borderColor: 'rgb(59, 130, 246) !important' },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgb(59, 130, 246) !important',
                                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                                    },
                                },
                            }}
                        />
                        <IconButton
                            color="primary"
                            disabled={isLoading || !inputValue.trim()}
                            onClick={handleSendMessage}
                            sx={{
                                position: 'absolute',
                                right: '8px',
                                bottom: '8px',
                                backgroundColor: 'rgb(59, 130, 246)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgb(37, 99, 235)' },
                                '&:disabled': { backgroundColor: 'rgb(191, 219, 254)' },
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                       Boosters Chat can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
