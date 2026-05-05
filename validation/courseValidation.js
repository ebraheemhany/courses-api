const { z } = require("zod");

const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),

  price: z
    .number()
    .min(0, "Price must be greater than 0")
    .max(120, "Price must be less than 120"),
});

module.exports = courseSchema;
