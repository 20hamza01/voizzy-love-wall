
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTestimonials } from "@/hooks/useTestimonials";
import { usePlans } from "@/hooks/usePlans";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const Testimonials = () => {
  const { testimonials, loading, updateTestimonialStatus, deleteTestimonial } = useTestimonials();
  const { user } = useAuth();
  const { currentPlan } = usePlans();
  const [testimonialToDelete, setTestimonialToDelete] = React.useState<string | null>(null);

  const confirmDeleteTestimonial = async () => {
    if (testimonialToDelete) {
      await deleteTestimonial(testimonialToDelete);
      setTestimonialToDelete(null);
    }
  };

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
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground mt-2">
          Manage and moderate your testimonials
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <Button asChild>
            <Link to={`/collect/${user?.id}`} target="_blank">
              Open Collection Form
            </Link>
          </Button>
        </div>
        {currentPlan?.testimonial_limit && testimonials.length >= currentPlan.testimonial_limit && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm">
            You've reached your limit of {currentPlan.testimonial_limit} testimonials.{" "}
            <Link to="/settings" className="font-medium underline">
              Upgrade your plan
            </Link>{" "}
            to add more.
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>
            View and manage all your collected testimonials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No testimonials yet</p>
              <Button asChild>
                <Link to={`/collect/${user?.id}`} target="_blank">
                  Get your first testimonial
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden md:table-cell">Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">
                      <div>
                        {testimonial.client_name}
                        {testimonial.client_role && (
                          <div className="text-xs text-muted-foreground">
                            {testimonial.client_role}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex">
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
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <div className="line-clamp-2 text-sm">
                        {testimonial.content}
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {testimonial.status !== "approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateTestimonialStatus(testimonial.id, "approved")
                              }
                            >
                              Approve
                            </DropdownMenuItem>
                          )}
                          {testimonial.status !== "rejected" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateTestimonialStatus(testimonial.id, "rejected")
                              }
                            >
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-500"
                              >
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Testimonial
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this testimonial? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => deleteTestimonial(testimonial.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Testimonials;
