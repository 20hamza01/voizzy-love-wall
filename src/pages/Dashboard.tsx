
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/usePlans";
import { Link } from "react-router-dom";
import { BarChart, Share2, Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const { stats, testimonials, loading } = useTestimonials();
  const { user } = useAuth();
  const { currentPlan } = usePlans();
  const [embedCode, setEmbedCode] = React.useState("");

  React.useEffect(() => {
    if (user) {
      // Generate embed code for the widget
      const code = `<iframe
  src="${window.location.origin}/embed/${user.id}"
  width="300"
  height="400"
  style="border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);"
  title="Voizzy Testimonials"
></iframe>`;
      setEmbedCode(code);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-voizzy-blue">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{user?.company_name ? `, ${user.company_name}` : ''}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your testimonials and get insights from your wall of love.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Testimonials</CardTitle>
            <CardDescription>All-time testimonials collected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            {currentPlan?.testimonial_limit && (
              <p className="text-muted-foreground text-sm mt-1">
                {stats.total}/{currentPlan.testimonial_limit} limit reached
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Review</CardTitle>
            <CardDescription>Testimonials awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Approved</CardTitle>
            <CardDescription>Published testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              <span>Testimonial Widget</span>
            </CardTitle>
            <CardDescription>Embed the widget on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Collection Form Link</h4>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={`${window.location.origin}/collect/${user?.id}`}
                    className="flex-1 text-sm bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/collect/${user?.id}`);
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Embed Widget</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="sm">
                      Get Embed Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Embed Voizzy Widget</DialogTitle>
                      <DialogDescription>
                        Copy and paste this code into your website to display your testimonials.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-sm overflow-auto whitespace-pre-wrap">{embedCode}</pre>
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(embedCode);
                        toast.success("Embed code copied to clipboard");
                      }}
                    >
                      Copy Code
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

export default Dashboard;
