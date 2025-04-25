
import * as z from "zod";

export const testimonialFormSchema = z.object({
  client_name: z.string().min(2, "Name must be at least 2 characters"),
  client_role: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(1000, "Testimonial cannot exceed 1000 characters"),
});

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;
