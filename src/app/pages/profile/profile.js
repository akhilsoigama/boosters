'use client'
import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useUser } from '../../contaxt/userContaxt';

const UserProfile = () => {
    const { user } = useUser();
    const firstLetter = user?.fullName?.charAt(0).toUpperCase() || 'U';
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-lg  p-8 pt-20 flex justify-center  "
        >
            <div className=" space-y-4">

                <div className='flex justify-center gap-4'>
                    <Avatar className="w-24 h-24">
                        <AvatarFallback className="w-full h-full flex items-center justify-center rounded-md bg-blue-100 text-blue-600 text-2xl font-bold">
                            <AvatarImage src=''>
                            </AvatarImage> {firstLetter}
                        </AvatarFallback>
                    </Avatar>
                    <div className=" flex flex-col">
                        <Typography variant="h5" component="h2" className="font-bold text-gray-900 dark:text-white">
                            {user?.fullName || "User"}
                        </Typography>


                        <Typography variant="body1" component="p" className="text-gray-700">
                            frontend developer
                        </Typography>
                        <div className="mt-6 flex gap-3 justify-around">
                            <div className="text-center">
                                <Typography variant="h6" component="h3" className="font-bold">
                                    1.2K
                                </Typography>
                                <Typography variant="body2" component="p" className="text-gray-500">
                                    Followers
                                </Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h6" component="h3" className="font-bold">
                                    456
                                </Typography>
                                <Typography variant="body2" component="p" className="text-gray-500">
                                    Following
                                </Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h6" component="h3" className="font-bold">
                                    78
                                </Typography>
                                <Typography variant="body2" component="p" className="text-gray-500">
                                    Posts
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 ">
                    <Button
                        fullWidth
                        variant="outlined"
                        className="border-blue-500 w-32 text-blue-500 hover:bg-blue-50"

                    >
                        Edit profile
                    </Button>
                </div>
            </div>

        </motion.div>
    );
};

export default UserProfile;