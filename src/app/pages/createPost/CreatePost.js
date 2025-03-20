'use client';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Box, Typography } from '@mui/material';
import TitleField from '../common/controller/TitleField';
import AuthorField from '../common/controller/AutherField';
import ContentField from '../common/controller/Content';
import DropzoneField from '../common/controller/DropzoneField';
import { useUser } from '@/app/contaxt/userContaxt';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PostSchemas } from '../common/schemas/Schemas';
import { useRouter } from 'next/navigation';
import ReplyIcon from '@mui/icons-material/Reply';

const PostForm = () => {
  const router = useRouter();
  const { user } = useUser();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(PostSchemas),
  });

  // ✅ Memoize user ID to prevent recalculation on every render
  const userId = useMemo(() => user?._id, [user]);

  const onSubmit = async (data) => {
    const postData = { ...data, User_id: userId };  // Directly create the object
  
    try {
      const response = await axios.post(`/api/post`, postData);
  
      if (response.data) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      reset({ content: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit post');
    }
  };

  return (
    <Box className="max-w-full mx-auto rounded-lg p-4 mb-10 shadow-lg">
      <div className='w-full mt-5 mb-4'>
        <button onClick={() => router.push('/')} className='hidden md:flex dark:shadow-md px-8 '>
          <ReplyIcon /> Back
        </button>
      </div>
      <div className='w-full '>
        <Typography
          variant="h4"
          className="mb-6 text-center font-bold"
          style={{
            background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create a New Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="flex mt-5 flex-col">
          <TitleField control={control} errors={errors} />
          <AuthorField control={control} errors={errors} />
          <ContentField control={control} errors={errors} />
          <DropzoneField control={control} errors={errors} />
          {/* <TagsField control={control} errors={errors} /> */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2"
          >
            Submit
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default PostForm;
