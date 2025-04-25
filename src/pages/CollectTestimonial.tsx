
import React from "react";
import { useParams } from "react-router-dom";
import TestimonialForm from "@/components/TestimonialForm";
import TestimonialError from "@/components/testimonials/TestimonialError";
import TestimonialLoading from "@/components/testimonials/TestimonialLoading";
import { useTestimonialForm } from "@/hooks/useTestimonialForm";

export default function CollectTestimonial() {
  const { userId } = useParams<{ userId: string }>();
  const { userProfile, error, isLoading, isSubmitting, handleSubmit } = useTestimonialForm(userId);

  if (error) {
    return <TestimonialError message={error} />;
  }

  if (isLoading) {
    return <TestimonialLoading />;
  }

  if (!userProfile) {
    return <TestimonialError message="Unable to load the testimonial form." />;
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
