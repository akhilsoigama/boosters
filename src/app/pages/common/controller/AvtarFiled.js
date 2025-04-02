import { Avatar, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { fieldVariants } from '@/app/components/motion/motion';

export const AvatarUpload = ({ control, setValue }) => {
    const [preview, setPreview] = useState(control._formValues.profilePicture || '');

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file!");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("File size should be less than 2MB!");
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target?.result;
                setPreview(base64String);
                setValue('profilePicture', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div variants={fieldVariants}>
            <Box className="flex flex-col items-center space-y-4">
                <Avatar
                    src={preview}
                    alt="Profile Picture"
                    sx={{ width: 100, height: 100 }}
                    className="border-2 border-gray-300"
                />
                <Button variant="contained" component="label">
                    Upload New Photo
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
            </Box>
        </motion.div>
    );
};
