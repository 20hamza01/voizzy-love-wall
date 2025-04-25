
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import TestimonialForm from "@/components/TestimonialForm";
import { User } from "@/types";

export default function CollectTestimonial() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // Fetch user profile for branding
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        setUserProfile({
          id: profile.id,
          email: profile.email,
          created_at: new Date().toISOString(), // Not needed for this context
          plan_type: profile.plan_type as 'free' | 'basic' | 'premium',
          company_name: profile.company_name,
          logo_url: profile.logo_url,
          theme_color: profile.theme_color,
          hide_branding: profile.hide_branding,
        });
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

      // First check if user has reached the testimonial limit
      // We need to count existing testimonials for this user
      const { data: existingTestimonials, count, error: countError } = await supabase
        .from("testimonials")
        .select("*", { count: 'exact' })
        .eq("user_id", userId);

      if (countError) throw countError;

      // Check if the user is on the free plan and has reached the limit
      if (userProfile?.plan_type === 'free' && count && count >= 3) {
        toast.error("This form has reached its maximum number of submissions");
        return;
      }

      // Insert the testimonial
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
      toast.error(error.message || "Failed to submit testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
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
