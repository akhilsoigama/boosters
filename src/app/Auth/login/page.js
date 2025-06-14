'use client';
import React, { useState, Suspense, useMemo } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { fadeIn, slideInUp, MotionDiv } from '../../components/motion/motion';
import FormController from '../common/FormController';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../schemas/Schemas';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/User';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);

  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await mutate();
        toast.success('Login successfully');
        reset();
        router.push(redirect); 
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        toast.error('No response from the server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionDiv
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <MotionDiv variants={slideInUp}>
          <Box className="bg-white p-8 rounded-lg shadow-lg" sx={{ border: 1, borderColor: 'divider' }}>
            <MotionDiv variants={slideInUp} className="text-center">
              <LockOutlined className="text-blue-500 text-4xl mb-4" />
              <Typography
                variant="h4"
                className="font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
              >
                Log In
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Welcome back! Please log in to continue.
              </Typography>
            </MotionDiv>

            <MotionDiv variants={slideInUp}>
              <motion.form
                variants={slideInUp}
                className="mt-6 space-y-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormController
                  control={control}
                  name="email"
                  label="Email Address"
                  defaultValue=""
                  errors={errors}
                />
                <FormController
                  control={control}
                  name="password"
                  label="Password"
                  type="password"
                  defaultValue=""
                  errors={errors}
                />

                <MotionDiv variants={slideInUp}>
                  <Button
                    fullWidth
                    variant="contained"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                </MotionDiv>
              </motion.form>
            </MotionDiv>

            <MotionDiv variants={slideInUp} className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{' '}
                <Button onClick={() => router.push('/Auth/signup')} className="text-blue-500 hover:underline">
                  Sign Up
                </Button>
              </Typography>
            </MotionDiv>
          </Box>
        </MotionDiv>
      </Container>
    </MotionDiv>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
