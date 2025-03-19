import React, { useState, useMemo } from "react";
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

  const passwordAdornment = useMemo(() => {
    if (type !== "password") return null;

    return (
      <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          edge="end"
          aria-label="toggle password visibility"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  }, [showPassword, type]);

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
            endAdornment: passwordAdornment,
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormController;
