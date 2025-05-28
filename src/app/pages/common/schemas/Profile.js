const { z } = require("zod");

const profileSchema = z.object({
    name:z.string(),
    avatar: z.string().optional(),
    bio: z.string().optional().nullable(),
    address: z.string().optional().nullable(),  
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    phoneNo: z.string().min(10, "Phone number is required"),
    dob: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date().optional().nullable()),
    github: z.string().url().optional().nullable(),
    youtube: z.string().url().optional().nullable(),
    linkedin: z.string().url().optional().nullable(),
    userId: z.string().optional()
});

module.exports = { profileSchema };
