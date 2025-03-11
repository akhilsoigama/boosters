import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormController = ({
  control,
  name,
  label,
  defaultValue = "",
  rules = {},
  errors,
  type = "text", 
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          fullWidth
          type={type === "password" && !showPassword ? "password" : "text"} 
          error={!!errors[name]}
          helperText={errors[name] ? errors[name].message : ""}
          InputProps={{
            endAdornment: type === "password" && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormController;