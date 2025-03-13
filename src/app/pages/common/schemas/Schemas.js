const { z } = require("zod");

const PostSchemas = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title cannot exceed 50 characters")
    .trim(),
  auther: z.string().min(1, "Auther is required").trim(),
  image: z.string().min(1, "Image is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(100, "Content must be at least 100 characters"),
  // tags: z
  //   .array(z.string().min(1, "Tag cannot be empty"))
});

module.exports = { PostSchemas };