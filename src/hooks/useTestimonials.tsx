
import { useState, useEffect } from "react";
import { Testimonial, TestimonialStats, User } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const useTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats>({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  // Calculate testimonial stats
  const calculateStats = (testimonials: Testimonial[]): TestimonialStats => {
    return {
      total: testimonials.length,
      pending: testimonials.filter(t => t.status === "pending").length,
      approved: testimonials.filter(t => t.status === "approved").length
    };
  };

  // Fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTestimonials(testimonials);
      setStats(calculateStats(testimonials));
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      toast.error(error.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  // Initialize testimonials when user changes
  useEffect(() => {
    if (user) {
      fetchTestimonials();
    } else {
      setTestimonials([]);
      setStats({ total: 0, pending: 0, approved: 0 });
    }
  }, [user]);

  // Create a new testimonial
  const createTestimonial = async (testimonial: Omit<Testimonial, "id" | "user_id" | "created_at" | "status">) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Get user's plan details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan_id, plan:plan_id(*)')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Check testimonial limit for free plan
      // The plan object is an actual object, not an array
      const plan = profile.plan;
      if (plan && plan.testimonial_limit) {
        const { count, error: countError } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (countError) throw countError;
        
        if (count && count >= plan.testimonial_limit) {
          throw new Error(`Free plan is limited to ${plan.testimonial_limit} testimonials. Please upgrade to add more.`);
        }
      }

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: user.id,
          status: 'pending',
          ...testimonial
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchTestimonials();
      toast.success("Testimonial submitted successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to create testimonial");
      throw error;
    }
  };

  // Update testimonial status
  const updateTestimonialStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchTestimonials();
      toast.success(`Testimonial ${status}`);
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      toast.error(error.message || "Failed to update testimonial");
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTestimonials();
      toast.success("Testimonial deleted");
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error(error.message || "Failed to delete testimonial");
    }
  };

  // Get testimonials for public display (only approved)
  const getApprovedTestimonials = async (userId: string) => {
    try {
      console.log("Fetching approved testimonials for user:", userId);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Approved testimonials:", data);
      return data || [];
    } catch (error: any) {
      console.error("Error fetching approved testimonials:", error);
      throw error;
    }
  };

  return {
    testimonials,
    stats,
    loading,
    createTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
    getApprovedTestimonials,
    refreshTestimonials: fetchTestimonials
  };
};
