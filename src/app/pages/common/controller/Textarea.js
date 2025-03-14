import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { fieldVariants } from '@/app/components/motion/motion';

export const TextareaController = ({ control, name, label, placeholder }) => {
    return (
        <motion.div variants={fieldVariants} className="grid w-full gap-1.5">
            <Label htmlFor={name}>{label}</Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        id={name}
                        placeholder={placeholder}
                    />
                )}
            />
        </motion.div>
    );
};