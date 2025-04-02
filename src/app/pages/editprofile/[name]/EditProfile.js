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
import { DateFieldController } from '../../common/controller/DateField';
import { SocialMediaFieldController } from '../../common/controller/SocialMedia';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { profileSchema } from '../../common/schemas/Profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfiles } from '@/app/hooks/Profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
    const router = useRouter();
    const { user } = useUser();
    const { profiles, createProfile, updateProfile, isLoading } = useProfiles(user?._id);
    const existingProfile = profiles?.[0] || {};

    const defaultValues = useMemo(() => ({
        name: existingProfile?.name || user?.fullName || '',
        bio: existingProfile?.bio || '',
        profilePicture: existingProfile?.profilePicture || '',
        phoneNo: existingProfile?.phoneNo || '', 
        address: existingProfile?.address || '',
        dob: existingProfile?.dob ? new Date(existingProfile.dob).toISOString().split("T")[0] : '',
        gender: existingProfile?.gender || '',
        youtube: existingProfile?.youtube || '',
        linkedin: existingProfile?.linkedin || '',
        github: existingProfile?.github || '',
    }), [existingProfile, user]);

    const genderOptions = useMemo(() => [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ], []);

    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues,
        resolver: zodResolver(profileSchema)
    });

    useEffect(() => {
        if (existingProfile) {
            Object.keys(existingProfile).forEach(key => {
                setValue(key, existingProfile[key]);
            });
        }
    }, [existingProfile, setValue]);

    const onSubmit = async (data) => {
        try {
            const userId = user?._id;
            if (!userId) {
                toast.error("User ID is required!");
                return;
            }
    
            const profileData = { ...data, User_id: userId };
    
            if (existingProfile?._id) {
                // Update profile
                await updateProfile(profileData);
                toast.success("Profile updated successfully!");
            } else {
                // Create profile
                await createProfile(profileData);
                toast.success("Profile created successfully!");
            }
            reset()
            router.push(`/profile/${userId}`);
        } catch (error) {
            toast.error(error.message || "Failed to save profile.");
        }
    };
    

    return (
        <Container maxWidth="md" className="py-8">
            <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="shadow-lg">
                    <CardHeader title={
                        <Typography variant="h4" className="text-center font-bold">
                            {existingProfile?._id ? "Edit Profile" : "Create Profile"}
                        </Typography>
                    } />
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                            <AvatarUpload name='profilePicture' control={control} setValue={setValue} />
                            <TextFieldController control={control} name="name" label="Full Name" placeholder="Enter your full name" />
                            <TextFieldController control={control} name="phoneNo" label="Phone Number" placeholder="Enter your phone number" type="tel" />
                            <TextFieldController control={control} name="address" label="Address" placeholder="Enter your address" />
                            <DateFieldController control={control} name="dob" label="Date of Birth" placeholder="Enter your date of birth" type="date" />
                            <SelectFieldController control={control} name="gender" label="Gender" options={genderOptions} />
                            <TextareaController control={control} name="bio" label="Bio" placeholder="Tell us about yourself" />
                            <SocialMediaFieldController control={control} name="youtube" label="YouTube" placeholder="Enter your YouTube handle" />
                            <SocialMediaFieldController control={control} name="linkedin" label="LinkedIn" placeholder="Enter your LinkedIn profile URL" />
                            <SocialMediaFieldController control={control} name="github" label="GitHub" placeholder="Enter your GitHub profile URL" />

                            <motion.div variants={fieldVariants}>
                                <Box className="flex justify-end">
                                    <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                                        {isLoading ? "Saving..." : existingProfile?._id ? "Update Profile" : "Create Profile"}
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
