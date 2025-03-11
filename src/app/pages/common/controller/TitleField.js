import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const TitleField = ({ control, errors }) => {
    return (
        <div className="mb-6">
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Title"
                        variant="outlined"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title ? errors.title.message : ''}
                        className="  dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg"
                        InputProps={{
                            className: 'dark:text-white',
                        }}
                        InputLabelProps={{
                            className: 'dark:text-gray-400',
                        }}
                    />
                )}
            />
        </div>
    );
};

export default TitleField;