'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const fetcher = (url, { arg }) =>
    axios.post(url, arg).then((res) => res.data);

const Chatbot = () => {
    const [messages, setMessages] = useState(() => {
        return JSON.parse(localStorage.getItem('chatMessages')) || [];
    });
    const [inputValue, setInputValue] = useState('');
    const [quizMode, setQuizMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const messagesEndRef = useRef(null);

    // SWR Mutations
    const { trigger: sendMessage, isMutating: isLoading } = useSWRMutation(
        'http://localhost:5000/chat',
        fetcher
    );

    const { trigger: fetchQuestion } = useSWRMutation(
        'http://localhost:5000/random-kids-question',
        fetcher
    );

    const { trigger: checkAnswer } = useSWRMutation(
        'http://localhost:5000/check-answer',
        fetcher
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    text: "Hello! I'm a smart bot. Ask me about programming or say 'quiz me' for kids' questions!",
                    sender: 'bot',
                },
            ]);
        }
    }, []);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = { text: inputValue, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');

        try {
            if (inputValue.toLowerCase().includes('quiz me')) {
                setQuizMode(true);
                await getNewQuestion();
            } else if (quizMode && currentQuestion) {
                await verifyAnswer(inputValue);
            } else {
                const data = await sendMessage({ message: inputValue });
                addBotMessage(data.response);
            }
        } catch {
            addBotMessage("Sorry, I'm having trouble connecting to the server.");
        }
    };

    const verifyAnswer = async (answer) => {
        try {
            if (!currentQuestion) return;

            const data = await checkAnswer({
                question: currentQuestion.question,
                answer,
            });

            if (data.correct) {
                addBotMessage(`✅ Correct! ${currentQuestion.answer} is right!`);
            } else {
                addBotMessage(`❌ Not quite! The correct answer is: ${data.correct_answer}`);
            }

            await getNewQuestion();
        } catch {
            addBotMessage('Failed to check your answer. Please try again.');
        }
    };

    const addBotMessage = (text) => {
        setMessages((prev) => [...prev, { text, sender: 'bot' }]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-[600px] w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <motion.h2 className="text-xl font-bold" initial={{ x: -20 }} animate={{ x: 0 }}>
                    Smart Bot
                </motion.h2>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setMessages([]);
                        localStorage.removeItem('chatMessages');
                    }}
                    className="shadow-md"
                >
                    Clear Chat
                </Button>

            </div>

            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide bg-gray-50">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-3">
                        <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-gray-500 rounded-full"
                                        animate={{
                                            y: [0, -5, 0],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.2,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div className="p-3 border-t border-gray-200 bg-white" layout>
                <div className="flex gap-2">
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={quizMode ? 'Type your answer...' : 'Type your message...'}
                        className="flex-1"
                    />
                    <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={isLoading} className="shadow-md">
                        {isLoading ? '...' : 'Send'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Chatbot;
