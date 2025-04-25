
import React from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/usePlans";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentTestimonials } from "@/components/dashboard/RecentTestimonials";
import { EmbedWidget } from "@/components/dashboard/EmbedWidget";

const Dashboard = () => {
  const { stats, testimonials, loading } = useTestimonials();
  const { user } = useAuth();
  const { currentPlan } = usePlans();
  const [embedCode, setEmbedCode] = React.useState("");

  React.useEffect(() => {
    if (user) {
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
        <StatsCard
          title="Total Testimonials"
          description="All-time testimonials collected"
          value={stats.total}
          limit={currentPlan?.testimonial_limit}
        />
        <StatsCard
          title="Pending Review"
          description="Testimonials awaiting approval"
          value={stats.pending}
        />
        <StatsCard
          title="Approved"
          description="Published testimonials"
          value={stats.approved}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentTestimonials testimonials={testimonials} />
        {user && <EmbedWidget userId={user.id} embedCode={embedCode} />}
      </div>
    </div>
  );
};

export default Dashboard;
