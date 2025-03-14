import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { fieldVariants } from '@/app/components/motion/motion';
import { Box } from '@mui/material';

export const SocialMediaFieldController = ({ control, name, label, placeholder }) => {
    return (
        <motion.div variants={fieldVariants}>
            <Box className="space-y-2">
                <Label htmlFor={name} className="text-sm font-medium">
                    {label}
                </Label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={name}
                            placeholder={placeholder}
                        />
                    )}
                />
            </Box>
        </motion.div>
    );
};