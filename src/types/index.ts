
export type User = {
  id: string;
  email: string;
  created_at: string;
  plan_type: 'free' | 'basic' | 'premium';
  company_name?: string;
  logo_url?: string;
  theme_color?: string;
  hide_branding?: boolean;
};

export type Testimonial = {
  id: string;
  user_id: string;
  client_name: string;
  client_role?: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type TestimonialStats = {
  total: number;
  pending: number;
  approved: number;
};

export type Plan = {
  id: 'free' | 'basic' | 'premium';
  name: string;
  price: number;
  description: string;
  features: string[];
  testimonial_limit: number | null;
  customization: boolean;
  hide_branding: boolean;
};
