'use client';
import { Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

const TiptapEditor = dynamic(() => import('../Editor'), { ssr: false });

const ContentField = ({ control, errors }) => {
  return (
    <Box mb={5} >
      <Controller
        name="content"
        control={control}
        defaultValue=""
        rules={{ required: 'Content is required' }}
        render={({ field }) => (
          <Box>
            <TiptapEditor
              value={field.value} 
              onChange={field.onChange}
            />
            {errors.content && (
              <Typography color="error" variant="body2" mt={1}>
                {errors.content.message}
              </Typography>
            )}
          </Box>
        )}
      />
    </Box>
  );
};

export default ContentField;