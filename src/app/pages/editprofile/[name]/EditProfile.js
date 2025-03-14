'use client';
import { useForm } from 'react-hook-form';
import { Typography, Container, Box, Button } from '@mui/material';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUser } from '@/app/contaxt/userContaxt';
import { motion } from 'framer-motion';
import { cardVariants, fieldVariants } from '@/app/components/motion/motion';
import { AvatarUpload } from '../../common/controller/AvtarFiled';
import { TextFieldController } from '../../common/controller/TextField';
import { SelectFieldController } from '../../common/controller/SelectFiled';
import { TextareaController } from '../../common/controller/Textarea';
import { SocialMediaFieldController } from '../../common/controller/SocialMedia';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const { user } = useUser();
    const baseUrl = process.env.NEXT_PUBLIC_HOST;

    const defaultValues = {
        name: user?.fullName || '',
        email: user?.email || '',
        bio: '',
        avatar: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        youTube: '',
        linkedIn: '',
        github: '',
    };

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    // const fetchSavedProfile = async () => {
    //     try {
    //         const response = await axios.get(`${baseUrl}/api/get-profile`, {
    //             params: {
    //                 userId: user?._id, // Pass userId as a query parameter
    //             },
    //         });
    //         return response.data; // Return the fetched profile data
    //     } catch (error) {
    //         console.error('Error fetching profile:', error.response?.data || error.message);
    //         return null;
    //     }
    // };

    // Fetch and set saved profile data when the component mounts
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const savedProfile = await fetchSavedProfile();
    //         if (savedProfile && Object.keys(savedProfile).length > 0) {
    //             reset(savedProfile); // Reset the form with fetched data
    //         }
    //     };
    //     fetchData();
    // }, [reset, user?._id]); // Add user._id as a dependency

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${baseUrl}/api/saved-profile`, data, {
                params: {
                    userId: user?._id, // Pass userId as a query parameter
                },
            });
            console.log('Profile saved:', response.data);
        } catch (error) {
            console.error('Error saving profile:', error.response?.data || error.message);
        }
    };

    return (
        <Container maxWidth="md" className="py-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <Card className="shadow-lg">
                    <CardHeader
                        title={
                            <Typography variant="h4" className="text-center font-bold">
                                Edit Profile
                            </Typography>
                        }
                    />
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                            <AvatarUpload control={control} setValue={setValue} />

                            <TextFieldController
                                control={control}
                                name="name"
                                label="Full Name"
                                placeholder="Enter your full name"
                                rules={{ required: 'Full name is required' }}
                            />

                            <TextFieldController
                                control={control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                }}
                            />

                            <TextFieldController
                                control={control}
                                name="phone"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                type="tel"
                            />

                            <TextFieldController
                                control={control}
                                name="address"
                                label="Address"
                                placeholder="Enter your address"
                            />

                            <TextFieldController
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                placeholder="Enter your date of birth"
                                type="date"
                            />

                            <SelectFieldController
                                control={control}
                                name="gender"
                                label="Gender"
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />

                            <TextareaController
                                control={control}
                                name="bio"
                                label="Bio"
                                placeholder="Tell us about yourself"
                            />

                            <SocialMediaFieldController
                                control={control}
                                name="youTube"
                                label="YouTube"
                                placeholder="Enter your YouTube handle"
                            />
                            <SocialMediaFieldController
                                control={control}
                                name="linkedIn"
                                label="LinkedIn"
                                placeholder="Enter your LinkedIn profile URL"
                            />
                            <SocialMediaFieldController
                                control={control}
                                name="github"
                                label="GitHub"
                                placeholder="Enter your GitHub profile URL"
                            />

                            <motion.div variants={fieldVariants}>
                                <Box className="flex justify-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </motion.div>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Container>
    );
};

export default dynamic(() => Promise.resolve(EditProfile), { ssr: false });