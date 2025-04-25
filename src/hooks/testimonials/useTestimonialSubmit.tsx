
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ProfileWithPlan } from "@/types";

interface TestimonialSubmitProps {
  client_name: string;
  client_role?: string;
  rating: number;
  content: string;
}

export function useTestimonialSubmit(userId: string | undefined) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TestimonialSubmitProps) => {
    if (!userId) {
      console.log("❌ Submit failed: Invalid form URL - no userId");
      toast.error("Invalid form URL");
      return;
    }

    try {
      console.log("🔄 Starting testimonial submission");
      setIsSubmitting(true);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, plan:plan_id(*)')
        .eq('id', userId)
        .maybeSingle<ProfileWithPlan>();

      if (profileError) {
        console.error("❌ Error checking profile:", profileError);
        throw new Error("Failed to verify testimonial submission permissions");
      }

      if (!profile) {
        console.error("❌ No profile found during submission");
        throw new Error("Unable to submit testimonial - invalid form");
      }

      // Check testimonial limit
      const testimonialLimit = profile?.plan?.testimonial_limit;
      if (testimonialLimit !== null && testimonialLimit !== undefined) {
        console.log("🔍 Checking testimonial limit:", testimonialLimit);
        const { count, error: countError } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);

        if (countError) {
          console.error("❌ Error checking testimonial count:", countError);
          throw countError;
        }
        
        if (count && count >= testimonialLimit) {
          console.log("⚠️ Testimonial limit reached:", count, "/", testimonialLimit);
          toast.error("This form has reached its maximum number of submissions");
          return;
        }
      }

      console.log("📝 Submitting new testimonial");
      const { error } = await supabase
        .from("testimonials")
        .insert({
          user_id: userId,
          client_name: values.client_name,
          client_role: values.client_role || null,
          rating: values.rating,
          content: values.content,
          status: 'pending'
        });

      if (error) {
        console.error("❌ Error submitting testimonial:", error);
        throw error;
      }

      console.log("✅ Testimonial submitted successfully");
      toast.success("Thank you for your testimonial!");
      navigate(`/collect/${userId}/thank-you`);
    } catch (error: any) {
      console.error("💥 Error in handleSubmit:", error);
      toast.error(error.message || "Failed to submit testimonial");
    } finally {
      console.log("🏁 Submission process completed");
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
