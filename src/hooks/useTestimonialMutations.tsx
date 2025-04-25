
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Testimonial, ProfileWithPlan } from "@/types";

export const useTestimonialMutations = (refreshTestimonials: () => Promise<void>) => {
  const createTestimonial = async (testimonial: Omit<Testimonial, "id" | "user_id" | "created_at" | "status">, userId: string) => {
    try {
      if (!userId) throw new Error("User not authenticated");
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, plan:plan_id(*)')
        .eq('id', userId)
        .single<ProfileWithPlan>();

      if (profileError) throw profileError;

      const testimonialLimit = profile?.plan?.testimonial_limit;
      if (testimonialLimit !== null && testimonialLimit !== undefined) {
        const { count, error: countError } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);

        if (countError) throw countError;
        
        if (count && count >= testimonialLimit) {
          throw new Error(`Free plan is limited to ${testimonialLimit} testimonials. Please upgrade to add more.`);
        }
      }

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: userId,
          status: 'pending',
          ...testimonial
        }])
        .select()
        .single();

      if (error) throw error;
      
      await refreshTestimonials();
      toast.success("Testimonial submitted successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to create testimonial");
      throw error;
    }
  };

  const updateTestimonialStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await refreshTestimonials();
      toast.success(`Testimonial ${status}`);
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      toast.error(error.message || "Failed to update testimonial");
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await refreshTestimonials();
      toast.success("Testimonial deleted");
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial");
    }
  };

  return {
    createTestimonial,
    updateTestimonialStatus,
    deleteTestimonial
  };
};
