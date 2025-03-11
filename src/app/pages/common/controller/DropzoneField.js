'use'
import { Typography } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import ImageDropZone from '../DropZone'

const DropzoneField = ({ control, errors }) => {
    return (
        <div className="mb-6">
            <Typography variant="body1" className="mb-2 font-medium">
                Upload Image
            </Typography>
            <Controller
                name="image"
                control={control}
                defaultValue=""
                rules={{ required: 'Image is required' }}
                render={({ field }) => (
                    <ImageDropZone
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                    />
                )}
            />
            {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                </p>
            )}
        </div>
    )
}

export default DropzoneField