import { Typography } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import ImageDropZone from '../DropZone';

const DropzoneField = ({ control, errors, value }) => {
    return (
        <div className="mb-6">
            <Typography variant="body1" className="mb-2 font-medium">
                Upload Image
            </Typography>
            <Controller
                name="image"
                control={control}
                defaultValue={value}  
                rules={{ required: 'Image is required' }}
                render={({ field }) => (
                    <ImageDropZone value={field.value} onChange={field.onChange} />
                )}
            />
            {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                </p>
            )}
        </div>
    );
};

export default DropzoneField;
