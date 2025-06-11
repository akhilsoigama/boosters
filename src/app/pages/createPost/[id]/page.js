'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import PostForm from '../CreatePost';

const EditPostPage = () => {
  const params = useParams(); 
  const postId = params?.id;

  return <PostForm postId={postId} />;
};

export default EditPostPage;
