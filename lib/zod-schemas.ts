import { z } from "zod";

export const CourseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const CourseStatus = ["Draft", "Published", "Archived"] as const;

export const CourseCategories = [
  "Programming",
  "Productivity",
  "IT and Computer",
  "Health and fitness",
  "Business",
  "Finance",
  "Design",
  "Marketing",
  "Music",
  "Photography",
] as const;

export const CourseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is required" })
    .max(100, { message: "Title must be at most 100 characters long." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." }),
  smallDescription: z
    .string()
    .min(1, {
      message: "Small description mush be at least 3 characters long.",
    })
    .max(200, {
      message: "Small description must be at most 200 characters long.",
    }),
  fileKey: z.string().min(1, { message: "Thumbnail is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  price: z.number().min(1, { message: "Price is required" }).max(500),
  level: z.enum(CourseLevels),
  category: z.enum(CourseCategories, { message: "Category is required" }),
  slug: z
    .string()
    .min(3, { message: "Slug is required at least 3 characters." }),
  status: z.enum(CourseStatus, { message: "Status is required" }),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;
