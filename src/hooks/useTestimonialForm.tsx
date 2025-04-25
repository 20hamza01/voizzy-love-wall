
import { useProfileCheck } from "./testimonials/useProfileCheck";
import { useTestimonialSubmit } from "./testimonials/useTestimonialSubmit";
import { User } from "@/types";

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
  const { userProfile, error, isLoading } = useProfileCheck(userId);
  const { isSubmitting, handleSubmit } = useTestimonialSubmit(userId);

  return {
    userProfile,
    error,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}
