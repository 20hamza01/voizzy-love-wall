
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Testimonial } from "@/types";

interface RecentTestimonialsProps {
  testimonials: Testimonial[];
}

export function RecentTestimonials({ testimonials }: RecentTestimonialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <span>Recent Testimonials</span>
        </CardTitle>
        <CardDescription>Latest testimonials submitted to your form</CardDescription>
      </CardHeader>
      <CardContent>
        {testimonials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Button asChild variant="outline">
              <Link to="/testimonials">Collect Testimonials</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{testimonial.client_name}</h4>
                    {testimonial.client_role && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.client_role}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{testimonial.content}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      testimonial.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : testimonial.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testimonial.status.charAt(0).toUpperCase() +
                      testimonial.status.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/testimonials">View all testimonials</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
