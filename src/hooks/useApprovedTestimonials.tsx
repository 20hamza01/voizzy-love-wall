
import { supabase } from "@/integrations/supabase/client";
import { Testimonial } from "@/types";

export const useApprovedTestimonials = () => {
  const getApprovedTestimonials = async (userId: string) => {
    try {
      console.log("Fetching approved testimonials for user:", userId);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Approved testimonials:", data);
      return data || [];
    } catch (error: any) {
      console.error("Error fetching approved testimonials:", error);
      throw error;
    }
  };

  return {
    getApprovedTestimonials
  };
};
