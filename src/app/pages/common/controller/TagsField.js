import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Chip, TextField, Box } from "@mui/material";

const TagsField = ({ control, errors }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      name="tags"
      control={control}
      defaultValue={[]} 
      render={({ field: { onChange, value } }) => {
        const handleAddTag = (event) => {
          if (event.key === "Enter" && inputValue.trim()) {
            const trimmedValue = inputValue.trim();
            if (!value.includes(trimmedValue)) {
              const newTags = [...value, trimmedValue];
              onChange(newTags);
            }
            setInputValue("");
            event.preventDefault();
          }
        };

        const handleRemoveTag = (tagToRemove) => {
          const updatedTags = value.filter((tag) => tag !== tagToRemove);
          onChange(updatedTags);
        };

        return (
          <Box className="space-y-3 flex-none mb-4">
            <TextField
              fullWidth
              label="Tags"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddTag}
              variant="outlined"
              error={!!errors.tags}
              helperText={errors.tags ? errors.tags.message : ''}
              className="dark:bg-gray-800  dark:text-white dark:border-gray-700 rounded-lg"
              InputProps={{
                className: 'dark:text-white',
                startAdornment: (
                  <Box className="flex w-full flex-wrap m-2 gap-2">
                    {value.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ),
              }}
              InputLabelProps={{
                className: 'dark:text-gray-400',
              }}
            />
          </Box>
        );
      }}
    />
  );
};

export default TagsField;