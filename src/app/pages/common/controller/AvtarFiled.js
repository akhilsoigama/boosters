import { Avatar, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { fieldVariants } from '@/app/components/motion/motion';

export const AvatarUpload = ({ control, setValue }) => {
    return (
        <motion.div variants={fieldVariants}>
            <Box className="flex flex-col items-center space-y-4">
                <Avatar
                    src={control._formValues.avatar}
                    alt="Profile Picture"
                    sx={{ width: 100, height: 100 }}
                    className="border-2 border-gray-300"
                />
                <Button variant="contained" component="label">
                    Upload New Photo
                    <input
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    setValue('avatar', event.target?.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </Button>
            </Box>
        </motion.div>
    );
};