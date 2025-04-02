import { Controller } from 'react-hook-form';
import { TextField, Box } from '@mui/material';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { fieldVariants } from '@/app/components/motion/motion';

export const DateFieldController = ({ control, name, label }) => {
    return (
        <motion.div variants={fieldVariants}>
            <Box className="space-y-2">
                <Label htmlFor={name} className="text-sm font-medium">
                    {label}
                </Label>
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                        {...field}
                        id={name}
                        fullWidth
                        type="date"
                        variant="outlined"
                        InputProps={{
                            style: { color: 'white' }, 
                        }}
                        InputLabelProps={{
                            style: { color: 'white' },  
                        }}
                        value={field.value ? field.value.split('T')[0] : ""} 
                        onChange={(e) => field.onChange(e.target.value)} 
                    />
                    )}
                />
            </Box>
        </motion.div>
    );
};
