
import { useState, useEffect } from "react";
import { Plan, User } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/sonner";

// Plans data
const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "3 testimonials max",
      "Basic testimonial widget",
      "Standard collection form"
    ],
    testimonial_limit: 3,
    customization: false,
    hide_branding: false
  },
  {
    id: "basic",
    name: "Basic",
    price: 19,
    description: "For growing businesses",
    features: [
      "Unlimited testimonials",
      "Enhanced testimonial widget",
      "Standard collection form"
    ],
    testimonial_limit: null,
    customization: false,
    hide_branding: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 49,
    description: "For professionals",
    features: [
      "Unlimited testimonials",
      "Enhanced testimonial widget",
      "Custom form colors",
      "Upload your logo",
      "Remove Voizzy branding"
    ],
    testimonial_limit: null,
    customization: true,
    hide_branding: true
  }
];

export const usePlans = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  // Set current plan based on user data
  useEffect(() => {
    if (user) {
      const userPlan = plans.find(p => p.id === user.plan_type);
      setCurrentPlan(userPlan || null);
    } else {
      setCurrentPlan(null);
    }
  }, [user]);

  // Mock upgrade plan functionality
  const upgradePlan = async (planId: "free" | "basic" | "premium") => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // In a real app, this would integrate with a payment processor
      toast.success(`Plan upgraded to ${planId}. This is a mock implementation.`);
      
      // Update local storage with new plan type
      const updatedUser = {
        ...user,
        plan_type: planId
      };
      localStorage.setItem("voizzy_user", JSON.stringify(updatedUser));
      
      // This would trigger useAuth to update the user state
      window.location.reload();
      
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to upgrade plan");
      return false;
    }
  };

  return {
    plans,
    currentPlan,
    upgradePlan
  };
};
