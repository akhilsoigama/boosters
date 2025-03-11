'use client';
import React from 'react';
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


const PostForm = () => {
    const { user } = useUser();
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(PostSchemas),
    });
  
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
  
    const onSubmit = async (data) => {
      const userDetails = user._id; 
      const User_id = userDetails;
      const postData = { ...data, User_id }; 
      try {
        const response = await axios.post(`${baseUrl}/api/create-post`, postData);
  
        if (response.data) {
            console.log(response.data)
          toast.success(response.data.message); 
        } else {
          toast.error(response.data.message); 
        }
        reset({ content: "" }); 
      } catch (error) {
        toast.error(response.data.message); 
      }
    };

    return (
        <Box className="max-w-xl mb-10  mx-auto p-6 mt-20 rounded-lg shadow-lg">
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
            <form onSubmit={handleSubmit(onSubmit)} className=" flex mt-5 flex-col">
                <TitleField control={control} errors={errors} />

                <AuthorField control={control} errors={errors} />

                <ContentField control={control} errors={errors} />

                <DropzoneField control={control} errors={errors} />

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
        </Box>
    );
};

export default PostForm;