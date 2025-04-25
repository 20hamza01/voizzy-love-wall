
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import TestimonialForm from "@/components/TestimonialForm";
import { User, ProfileWithPlan } from "@/types";

export default function CollectTestimonial() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Unable to load the testimonial form.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <TestimonialForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        showBranding={!userProfile.hide_branding}
        themeColor={userProfile.theme_color || undefined}
        logoUrl={userProfile.logo_url || undefined}
      />
    </div>
  );
}
