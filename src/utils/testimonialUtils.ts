
import { TestimonialStats, Testimonial } from "@/types";

export const calculateStats = (testimonials: Testimonial[]): TestimonialStats => {
  return {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === "pending").length,
    approved: testimonials.filter(t => t.status === "approved").length
  };
};
