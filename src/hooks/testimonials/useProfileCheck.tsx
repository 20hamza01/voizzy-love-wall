
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, ProfileWithPlan } from "@/types";

interface UseProfileCheckReturn {
  userProfile: User | null;
  error: string | null;
  isLoading: boolean;
}

export function useProfileCheck(userId: string | undefined): UseProfileCheckReturn {
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
        console.log("🔍 Checking profile for userId:", userId);
        
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

        console.log(`👀 Profile check result: ${count} profile(s) found`);
        
        if (count === 0) {
          console.log("⚠️ No profile found with this userId");
          setError("This testimonial form is not available. The link may be incorrect or the account has been deleted.");
          setIsLoading(false);
          return;
        }

        console.log("📥 Fetching profile data with plan details...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, plan:plan_id(*)")
          .eq("id", userId)
          .maybeSingle<ProfileWithPlan>();

        if (profileError) {
          console.error("❌ Error fetching profile details:", profileError);
          setError("Unable to load the testimonial form. Please try again later.");
          setIsLoading(false);
          return;
        }

        if (!profile) {
          console.log("⚠️ No profile details found");
          setError("This testimonial form is not available.");
          setIsLoading(false);
          return;
        }

        console.log("✅ Profile data retrieved successfully");

        const transformedProfile: User = {
          id: profile.id,
          email: profile.email,
          created_at: profile.created_at,
          plan_type: profile.plan_type as 'free' | 'basic' | 'premium',
          company_name: profile.company_name,
          logo_url: profile.logo_url,
          theme_color: profile.theme_color,
          hide_branding: profile.hide_branding ?? false,
        };

        setUserProfile(transformedProfile);
      } catch (error) {
        console.error("💥 Unexpected error:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return {
    userProfile,
    error,
    isLoading,
  };
}
