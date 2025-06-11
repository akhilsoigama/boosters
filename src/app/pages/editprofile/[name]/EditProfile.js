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
import { ReplyIcon } from 'lucide-react';

const EditProfile = () => {
  const router = useRouter();
  const { user } = useUser();
  const { profiles, createProfile, updateProfile, isLoading } = useProfiles();

  const existingProfile = useMemo(
    () => profiles?.find((p) => String(p?.userId?._id) === String(user?._id)) || null,
    [profiles, user]
  );

  const defaultValues = useMemo(() => ({
    name: existingProfile?.name || user?.fullName || '',
    bio: existingProfile?.bio || '',
    avatar: existingProfile?.avatar || '',
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

  const { control, handleSubmit, setValue, reset, formState: { isSubmitting, errors } } = useForm({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (existingProfile) {
      const keys = ['name', 'bio', 'avatar', 'phoneNo', 'address', 'dob', 'gender', 'youtube', 'linkedin', 'github'];
      keys.forEach((key) => {
        if (existingProfile[key] !== undefined) {
          setValue(key, existingProfile[key]);
        }
      });
    }
  }, [existingProfile, setValue]);

  const onSubmit = async (data) => {
    if (!user?._id) {
      toast.error("User ID is required!");
      return;
    }

    const profileData = {
      ...data,
      userId: user._id,
    };

    try {
      if (existingProfile?._id) {
        await updateProfile({ id: existingProfile._id, ...profileData });
      } else {
        await createProfile(profileData);
      }

      reset();
      router.push(`/profile/${user._id}`);
    } catch (error) {
      console.error("Profile Save Error:", error);
      toast.error(error?.message || "Failed to save profile.");
    }
  };

  if (!user?._id) {
    return (
      <Container maxWidth="md" className="py-8">
        <Typography variant="h6" className="text-center dark:text-white text-gray-900">Loading user info...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8">
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="shadow-lg dark:bg-gray-900 bg-white dark:text-white text-gray-900">
          <div className="my-3 mx-4">
            <Button
              onClick={() => router.push('/')}
              startIcon={<ReplyIcon />}
              className="!hidden  sm:!inline-flex"
              variant="outlined"
            >
              Back
            </Button>
          </div>
          <CardHeader
            title={
              <Typography variant="h4" className="text-center font-bold dark:text-white text-gray-900">
                {existingProfile?._id ? "Edit Profile" : "Create Profile"}
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
              <AvatarUpload name="avatar" control={control} setValue={setValue} />
              <TextFieldController control={control} name="name" label="Full Name" placeholder="Enter your full name" />
              <TextFieldController control={control} name="phoneNo" label="Phone Number" placeholder="Enter your phone number" type="tel" />
              <TextFieldController control={control} name="address" label="Address" placeholder="Enter your address" />
              <DateFieldController control={control} name="dob" label="Date of Birth" />
              <SelectFieldController control={control} name="gender" label="Gender" options={genderOptions} />
              <TextareaController control={control} name="bio" label="Bio" placeholder="Tell us about yourself" />
              <SocialMediaFieldController control={control} name="youtube" label="YouTube" placeholder="Enter your YouTube handle" />
              <SocialMediaFieldController control={control} name="linkedin" label="LinkedIn" placeholder="Enter your LinkedIn profile URL" />
              <SocialMediaFieldController control={control} name="github" label="GitHub" placeholder="Enter your GitHub profile URL" />

              <motion.div variants={fieldVariants}>
                <Box className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading || !user?._id}
                  >
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
