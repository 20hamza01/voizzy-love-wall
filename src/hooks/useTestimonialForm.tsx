
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User, ProfileWithPlan } from "@/types";

interface UseTestimonialFormReturn {
  userProfile: User | null;
  error: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: (values: {
    client_name: string;
    client_role?: string;
    rating: number;
    content: string;
  }) => Promise<void>;
}

export function useTestimonialForm(userId: string | undefined): UseTestimonialFormReturn {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        console.log('❌ Invalid form URL - no userId provided');
        setError("Invalid form URL");
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Starting profile fetch for userId:", userId);
        
        // First, check if the userId exists as a valid UUID in the database
        const { count, error: checkError } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true })
          .eq("id", userId);

        if (checkError) {
          console.error("❌ Error checking if profile exists:", checkError);
          setError("Unable to load the testimonial form. Please try again later.");
          setIsLoading(false);
          return;
        }

        console.log(`👀 Profile existence check: ${count} profile(s) found for userId: ${userId}`);
        
        if (count === 0) {
          console.log("⚠️ No profile found with this userId:", userId);
          setError("This testimonial form is not available. The link may be incorrect or the account has been deleted.");
          setIsLoading(false);
          return;
        }

        console.log("📥 Fetching complete profile data with plan...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, plan:plan_id(*)")
          .eq("id", userId)
          .maybeSingle<ProfileWithPlan>();

        if (profileError) {
          console.error("❌ Error fetching profile details:", profileError);
          console.error("Error details:", profileError);
          setError("Unable to load the testimonial form. Please try again later.");
          setIsLoading(false);
          return;
        }

        if (!profile) {
          console.log("⚠️ No profile details found for userId:", userId);
          setError("This testimonial form is not available.");
          setIsLoading(false);
          return;
        }

        // Log the raw profile data for debugging
        console.log("📦 Raw profile data received:", profile);
        console.log("🔍 Plan data:", profile.plan);

        // Transform the profile data with type safety
        const transformedProfile: User = {
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          // Since plan_type is in the database schema for profiles but not in our TypeScript type,
          // we need to handle it as a direct property with type assertion
          plan_type: (profile as any).plan_type as 'free' | 'basic' | 'premium',
          company_name: profile.company_name,
          logo_url: profile.logo_url,
          theme_color: profile.theme_color,
          hide_branding: profile.hide_branding ?? false,
        };

        console.log("✅ Transformed profile data:", transformedProfile);
        setUserProfile(transformedProfile);
      } catch (error) {
        console.error("💥 Unexpected error in fetchUserProfile:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        console.log("🏁 Profile fetch operation completed");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleSubmit = async (values: {
    client_name: string;
    client_role?: string;
    rating: number;
    content: string;
  }) => {
    if (!userId) {
      console.log("❌ Submit failed: Invalid form URL - no userId");
      toast.error("Invalid form URL");
      return;
    }

    try {
      console.log("🔄 Starting testimonial submission process");
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
    userProfile,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}
