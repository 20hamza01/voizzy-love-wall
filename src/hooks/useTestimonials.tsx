
import { useState, useEffect } from "react";
import { Testimonial, TestimonialStats } from "@/types";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { calculateStats } from "@/utils/testimonialUtils";
import { useTestimonialMutations } from "./useTestimonialMutations";
import { useApprovedTestimonials } from "./useApprovedTestimonials";

export const useTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats>({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTestimonials(testimonials);
      setStats(calculateStats(testimonials));
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      toast.error(error.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTestimonials();
    } else {
      setTestimonials([]);
      setStats({ total: 0, pending: 0, approved: 0 });
    }
  }, [user]);

  const { createTestimonial, updateTestimonialStatus, deleteTestimonial } = useTestimonialMutations(fetchTestimonials);
  const { getApprovedTestimonials } = useApprovedTestimonials();

  return {
    testimonials,
    stats,
    loading,
    createTestimonial: (testimonial: Omit<Testimonial, "id" | "user_id" | "created_at" | "status">) => {
      if (!user) throw new Error("User not authenticated");
      return createTestimonial(testimonial, user.id);
    },
    updateTestimonialStatus,
    deleteTestimonial,
    getApprovedTestimonials,
    refreshTestimonials: fetchTestimonials
  };
};
