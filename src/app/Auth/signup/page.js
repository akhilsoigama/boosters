'use client'
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Typography, Container, Box, Link } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { bounce, fadeIn, slideInUp } from "../../components/motion/motion";
import FormController from "../common/FormController";
import { SignUpSchema } from "../schemas/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const route = useRouter();

  const defaultValues = useMemo(() => ({
    email: "",
    password: "",
    fullName: '',
    confirmPassword: ''
  }), []);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/auth/signup`, {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      if (response) {
        toast.success("Signup successfully");
        route.push('/Auth/login');
      }
      reset();
    } catch (error) {
      toast.error('Signup failed:', error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Box className="bg-white p-8 rounded-lg shadow-lg" sx={{ border: 1, borderColor: "divider" }}>
            <motion.div variants={bounce} className="text-center">
              <LockOutlined className="text-blue-500 text-4xl mb-4" />
              <Typography variant="h4" className="font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Sign Up
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Create your account to get started.
              </Typography>
            </motion.div>

            <motion.form variants={slideInUp} className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormController
                control={control}
                name="fullName"
                label="Full Name"
                defaultValue=""
                rules={{ required: 'Full Name is required' }}
                errors={errors}
              />
              <FormController
                control={control}
                name="email"
                label="Email Address"
                defaultValue=""
                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                errors={errors}
              />
              <FormController
                control={control}
                name="password"
                label="Password"
                type="password"
                defaultValue=""
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                errors={errors}
              />
              <FormController
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                defaultValue=""
                rules={{ required: 'Confirm Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                errors={errors}
              />

              <motion.div variants={slideInUp}>
                <Button
                  fullWidth
                  variant="contained"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3"
                  type="submit"
                >
                  Sign Up
                </Button>
              </motion.div>
            </motion.form>

            <motion.div variants={slideInUp} className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{" "}
                <Button onClick={() => route.push('/Auth/login')} className="text-blue-500 hover:underline">
                  Log In
                </Button>
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
};

export default SignupPage;
