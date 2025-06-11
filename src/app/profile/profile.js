'use client';
import { Typography, Button, Tooltip, Divider, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useUser } from '../contaxt/userContaxt';
import { useProfiles } from '../hooks/Profile';
import Link from 'next/link';
import { HoverScale } from '../components/motion/motion';
import { Edit, GitHub, YouTube, LinkedIn } from '@mui/icons-material';

const UserProfile = () => {
    const router = useRouter();
    const { user } = useUser();
    const { profiles, isLoading } = useProfiles();
    const profile = useMemo(() => {
        if (!user?._id || !profiles) return null;
    
        const userProfile = profiles.find(p => String(p?.userId?._id) === String(user._id));
    
        return userProfile
            ? {
                fullName: userProfile.name || user?.fullName || "User",
                bio: userProfile.bio || user?.bio || "Tell people about yourself",
                avatar: userProfile.avatar || user?.avatar || "",
                followers: userProfile.followers || user?.followers || "0",
                following: userProfile.following || user?.following || "0",
                posts: userProfile.posts || user?.posts || "0",
                github: userProfile.github || "",
                youtube: userProfile.youtube || "",
                linkedin: userProfile.linkedin || "",
            }
            : null;
    }, [profiles, user]);
    

    const firstLetter = useMemo(() => profile?.fullName?.charAt(0).toUpperCase() || 'U', [profile?.fullName]);

    const userStats = useMemo(() => (
        [
            { label: 'Followers', value: profile?.followers },
            { label: 'Following', value: profile?.following },
            { label: 'Posts', value: profile?.posts }
        ]
    ), [profile]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto p-4 pt-16"
        >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-800/30 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                        <Avatar className="w-32 h-32 sm:w-36 sm:h-36 shadow-lg ">
                            <AvatarImage
                                src={profile?.avatar}
                                alt={profile?.fullName}
                                className="rounded-lg object-cover border-4  border-white dark:border-gray-700 shadow-md"
                            />
                            <AvatarFallback className="w-full h-full flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                                {firstLetter}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 w-full sm:w-auto space-y-3 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <Typography variant="h5" component="h1" className="font-bold text-gray-900 dark:text-white text-center sm:text-left">
                                        {profile?.fullName}
                                    </Typography>
                                    <Typography variant="subtitle2" component="p" className="text-gray-500 dark:text-gray-400 text-center sm:text-left">
                                        @{profile?.fullName?.toLowerCase().replace(/\s+/g, '')}
                                    </Typography>
                                </div>
                                <div className='hidden sm:flex'>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Edit />}
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-blue-400 dark:text-blue-400"
                                        onClick={() => {
                                            const id = profiles?.find(p => String(p?.userId?._id) === String(user?._id))?._id || user?._id;
                                            router.push(`/pages/editprofile/${id}`);
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                            <Typography
                                variant="body2"
                                component="p"
                                className="text-gray-700 dark:text-gray-300 text-center sm:text-left"
                            >
                                {profile?.bio}
                            </Typography>

                            <div className="flex gap-2 pt-2 justify-center sm:justify-start">
                                {profile?.github && (
                                    <Tooltip title="GitHub" arrow>
                                        <Link href={profile.github} target="_blank" passHref>
                                            <HoverScale>
                                                <IconButton size="small" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <GitHub className="text-gray-700 dark:text-gray-300 text-lg" />
                                                </IconButton>
                                            </HoverScale>
                                        </Link>
                                    </Tooltip>
                                )}
                                {profile?.youtube && (
                                    <Tooltip title="YouTube" arrow>
                                        <Link href={profile.youtube} target="_blank" passHref>
                                            <HoverScale>
                                                <IconButton size="small" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <YouTube className="text-red-600 dark:text-red-400 text-lg" />
                                                </IconButton>
                                            </HoverScale>
                                        </Link>
                                    </Tooltip>
                                )}
                                {profile?.linkedin && (
                                    <Tooltip title="LinkedIn" arrow>
                                        <Link href={profile.linkedin} target="_blank" passHref>
                                            <HoverScale>
                                                <IconButton size="small" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <LinkedIn className="text-blue-700 dark:text-blue-400 text-lg" />
                                                </IconButton>
                                            </HoverScale>
                                        </Link>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="sm:hidden flex justify-center pt-2">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Edit />}
                                    className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-blue-400 dark:text-blue-400"
                                    onClick={() => {
                                        const id = profiles?.find(p => String(p?.userId?._id) === String(user?._id))?._id || user?._id;
                                        router.push(`/pages/editprofile/${id}`);
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="border-gray-200 dark:border-gray-700" />

                <div className="px-6 py-4">
                    <div className="flex justify-around divide-x divide-gray-200 dark:divide-gray-700">
                        {userStats.map((stat, index) => (
                            <div key={index} className="text-center px-4 py-2 flex-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <Typography variant="h6" component="h3" className="font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" component="p" className="text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                                    {stat.label}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;
