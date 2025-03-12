'use client';
import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const AuthorField = ({ control, errors }) => {
    return (
        <div className="mb-6">                    
            <Controller
                name="auther"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Author"
                        variant="outlined"
                        fullWidth
                        error={!!errors.auther}
                        helperText={errors.auther ? errors.auther.message : ''}
                        className="rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
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

export default AuthorField;