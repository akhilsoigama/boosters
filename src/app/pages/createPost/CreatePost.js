'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Box, Typography } from '@mui/material';
import TitleField from '../common/controller/TitleField';
import AuthorField from '../common/controller/AutherField';
import ContentField from '../common/controller/Content';
import DropzoneField from '../common/controller/DropzoneField';
import { useUser } from '@/app/contaxt/userContaxt';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostSchemas } from '../common/schemas/Schemas';
import ReplyIcon from '@mui/icons-material/Reply';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/app/hooks/Post';

const PostForm = ({ postId }) => {
  const router = useRouter();
  const { user } = useUser();
  const { createPost, updatePost, getPostById } = usePosts();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(PostSchemas),
  });

  const userId = useMemo(() => user?._id, [user]);

  useEffect(() => {
    if (postId && userId) {
      getPostById(postId).then((data) => {
        if (data) {
          reset({
            title: data.title || '',
            auther: data.auther || '',
            content: data.content || '',
            image: data.image || '',
          });
        }
      });
    }
  }, [postId, reset, getPostById, userId]);

  const onSubmit = async (formData) => {
    const postData = { ...formData, User_id: userId };

    try {
      if (postId) {
        await updatePost(postId, postData);
      } else {
        await createPost(postData);
      }

      reset({ title: '', auther: '', content: '', image: '' });
      router.push('/');
    } catch (error) {
      // Handled inside hook
    }
  };

  return (
    <Box
      className="max-w-4xl w-full mx-auto rounded-2xl shadow-lg transition-all duration-300
                 bg-white dark:bg-zinc-900 px-4 py-6 sm:px-8 sm:py-10"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={() => router.push('/')}
          startIcon={<ReplyIcon />}
          className="!hidden sm:!inline-flex"
          variant="outlined"
        >
          Back
        </Button>
      </div>

      {/* Heading */}
      <Typography
        variant="h4"
        align="center"
        className="font-extrabold mb-8"
        sx={{
          background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {postId ? 'Edit Post' : 'Create a New Post'}
      </Typography>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 sm:gap-8"
      >
        <TitleField control={control} errors={errors} />
        <AuthorField control={control} errors={errors} />
        <ContentField control={control} errors={errors} />
        <DropzoneField control={control} errors={errors} />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-3 text-base sm:text-lg"
        >
          {postId ? 'Update Post' : 'Submit Post'}
        </Button>
      </form>
    </Box>
  );
};

export default PostForm;
