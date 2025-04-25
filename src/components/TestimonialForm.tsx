
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RatingSelector from "./testimonials/RatingSelector";
import { testimonialFormSchema, TestimonialFormData } from "./testimonials/schemas/testimonialFormSchema";

type TestimonialFormProps = {
  onSubmit: (values: TestimonialFormData) => Promise<void>;
  isSubmitting: boolean;
  showBranding?: boolean;
  themeColor?: string;
  logoUrl?: string;
};

const TestimonialForm = ({
  onSubmit,
  isSubmitting,
  showBranding = true,
  themeColor,
  logoUrl,
}: TestimonialFormProps) => {
  const [selectedRating, setSelectedRating] = React.useState(0);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      client_name: "",
      client_role: "",
      rating: 0,
      content: "",
    },
  });

  const handleSubmit = async (values: TestimonialFormData) => {
    await onSubmit(values);
    form.reset();
    setSelectedRating(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {logoUrl && (
        <div className="mb-6 flex justify-center">
          <img src={logoUrl} alt="Company Logo" className="h-12 w-auto" />
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold" style={themeColor ? { color: themeColor } : {}}>
          Share Your Experience
        </h1>
        <p className="text-muted-foreground mt-2">
          We value your feedback! Please share your experience with us.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="CEO, Marketing Director, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <RatingSelector
            control={form.control}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Testimonial</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your experience..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            style={themeColor ? { backgroundColor: themeColor } : {}}
          >
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </Form>

      {showBranding && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by{" "}
          <a
            href="/"
            className="text-voizzy-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Voizzy
          </a>
        </p>
      )}
    </div>
  );
};

export default TestimonialForm;
