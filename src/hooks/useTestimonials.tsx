
import { useState, useEffect } from "react";
import { Testimonial, TestimonialStats, User } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/sonner";

// Sample data - will be replaced with Supabase
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    user_id: "1",
    client_name: "Alex Johnson",
    client_role: "Marketing Director",
    rating: 5,
    content: "Voizzy has transformed how we collect customer feedback. The interface is intuitive and our customers love the simple process.",
    status: "approved",
    created_at: "2025-04-20T12:00:00Z"
  },
  {
    id: "2",
    user_id: "1",
    client_name: "Sarah Miller",
    client_role: "CEO",
    rating: 4,
    content: "Great tool for testimonial collection. Would recommend to any business looking to showcase their customer feedback.",
    status: "pending",
    created_at: "2025-04-22T14:30:00Z"
  },
  {
    id: "3",
    user_id: "1",
    client_name: "Michael Chang",
    client_role: "Product Manager",
    rating: 5,
    content: "The wall of love widget looks fantastic on our site. Our conversion rate has improved since adding it!",
    status: "pending",
    created_at: "2025-04-23T09:15:00Z"
  }
];

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

  // Fetch testimonials (mock implementation)
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) return;
      
      // Filter testimonials by user_id
      const userTestimonials = mockTestimonials.filter(t => t.user_id === user.id);
      setTestimonials(userTestimonials);
      setStats(calculateStats(userTestimonials));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
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
      
      // Check plan limits
      if (user.plan_type === "free" && testimonials.length >= 3) {
        throw new Error("Free plan is limited to 3 testimonials. Please upgrade to add more.");
      }

      const newTestimonial: Testimonial = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        created_at: new Date().toISOString(),
        status: "pending",
        ...testimonial
      };

      mockTestimonials.push(newTestimonial);
      
      await fetchTestimonials();
      toast.success("Testimonial submitted successfully");
      return newTestimonial;
    } catch (error: any) {
      toast.error(error.message || "Failed to create testimonial");
      throw error;
    }
  };

  // Update testimonial status
  const updateTestimonialStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const index = mockTestimonials.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Testimonial not found");
      
      mockTestimonials[index] = {
        ...mockTestimonials[index],
        status
      };
      
      await fetchTestimonials();
      toast.success(`Testimonial ${status}`);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Failed to update testimonial");
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      const index = mockTestimonials.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Testimonial not found");
      
      mockTestimonials.splice(index, 1);
      await fetchTestimonials();
      toast.success("Testimonial deleted");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  // Get testimonials for public display (only approved)
  const getApprovedTestimonials = (userId: string) => {
    return mockTestimonials
      .filter(t => t.user_id === userId && t.status === "approved");
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
