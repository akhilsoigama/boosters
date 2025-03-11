const { z } = require("zod");

export const SignUpSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "Full Name is required")
            .max(50, "Full Name cannot exceed 50 characters")
            .trim(),
        email: z.string().email("Invalid email address").trim(),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(50, "Password cannot exceed 50 characters")
        ,
        confirmPassword: z.string().min(6, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password cannot exceed 50 characters"),
});