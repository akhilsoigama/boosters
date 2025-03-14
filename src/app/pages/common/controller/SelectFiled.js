import { Controller } from 'react-hook-form';
import { Select, MenuItem, Box } from '@mui/material';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { fieldVariants } from '@/app/components/motion/motion';

export const SelectFieldController = ({ control, name, label, options }) => {
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
                        <Select
                            {...field}
                            id={name}
                            fullWidth
                            variant="outlined"
                            className="dark:text-white border rounded-lg"
                        >
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </Box>
        </motion.div>
    );
};