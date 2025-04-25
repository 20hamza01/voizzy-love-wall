
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Star } from "lucide-react";

const formSchema = z.object({
  client_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  client_role: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, {
    message: "Testimonial must be at least 10 characters.",
  }),
});

const CollectTestimonial = () => {
  const { userId } = useParams<{ userId: string }>();
  const { createTestimonial } = useTestimonials();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      client_role: "",
      rating: 5,
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) return;
    
    try {
      setSubmitting(true);
      await createTestimonial({
        client_name: values.client_name,
        client_role: values.client_role || undefined,
        rating: values.rating,
        content: values.content,
      });
      navigate(`/collect/${userId}/thank-you`);
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      setSubmitting(false);
    }
  };

  const handleRatingClick = (selected: number) => {
    setRating(selected);
    form.setValue("rating", selected);
  };

  // Update form when rating changes
  React.useEffect(() => {
    form.setValue("rating", rating);
  }, [rating, form]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid testimonial collection URL</h1>
          <p className="text-muted-foreground mt-2">
            The URL you've visited doesn't include a valid user ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-voizzy-blue">Voizzy</h1>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Share Your Feedback</CardTitle>
            <CardDescription className="text-center">
              We appreciate your testimonial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
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
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO at Company" {...field} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={() => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={28}
                              className={`cursor-pointer ${
                                (hoveredRating || rating) >= star
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                          className="h-32"
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
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Testimonial"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <p className="text-xs text-muted-foreground">
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CollectTestimonial;
