
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
        setError("Invalid form URL");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile for", userId);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, plan:plan_id(*)")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Unable to load the testimonial form. Please try again later.");
          setIsLoading(false);
          return;
        }

        if (!profile) {
          setError("This testimonial form does not exist.");
          setIsLoading(false);
          return;
        }

        console.log("Profile data:", profile);
        setUserProfile({
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          plan_type: profile.plan?.name?.toLowerCase() || 'free',
          company_name: profile.company_name,
          logo_url: profile.logo_url,
          theme_color: profile.theme_color,
          hide_branding: profile.hide_branding,
        });
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
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
      toast.error("Invalid form URL");
      return;
    }

    try {
      setIsSubmitting(true);

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
          toast.error("This form has reached its maximum number of submissions");
          return;
        }
      }

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

      if (error) throw error;

      toast.success("Thank you for your testimonial!");
      navigate(`/collect/${userId}/thank-you`);
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast.error(error.message || "Failed to submit testimonial");
    } finally {
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
