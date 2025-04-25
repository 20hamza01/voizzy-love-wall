
export interface User {
  id: string;
  email: string;
  created_at: string;
  plan_type: 'free' | 'basic' | 'premium';
  company_name: string | null;
  logo_url: string | null;
  theme_color: string | null;
  hide_branding: boolean | null;
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  user_id: string;
  client_name: string;
  client_role?: string;
  rating: number;
  content: string;
  status: TestimonialStatus;
  created_at: string;
  updated_at: string;
}

// Add the Plan interface
export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  testimonial_limit: number | null;
  customization: boolean;
  hide_branding: boolean;
}

// Add the TestimonialStats interface
export interface TestimonialStats {
  total: number;
  pending: number;
  approved: number;
}
