const { z } = require("zod");

const PostSchemas = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title cannot exceed 50 characters")
    .trim(),
  auther: z.string().min(1, "Author is required").trim(),
  image: z.string().min(1, "Image is required"),
  content: z.string().min(1, "Content is required").min(100, "Content cannot exceed 100 characters"),
});

module.exports = { PostSchemas };