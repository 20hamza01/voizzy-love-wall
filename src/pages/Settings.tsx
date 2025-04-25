
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/hooks/usePlans";
import { useAuth } from "@/hooks/useAuth";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const profileFormSchema = z.object({
  email: z.string().email(),
  company_name: z.string().min(1, "Company name is required"),
});

const Settings = () => {
  const { user } = useAuth();
  const { plans, currentPlan, upgradePlan } = usePlans();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user?.email || "",
      company_name: user?.company_name || "",
    },
  });

  // Update form when user changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        company_name: user.company_name || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsUpdating(true);
      // In a real app, this would call an API to update the user's profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local storage with new profile info
      if (user) {
        const updatedUser = {
          ...user,
          company_name: values.company_name,
        };
        localStorage.setItem("voizzy_user", JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully");
      setIsUpdating(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and subscription
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="plan">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can't change your email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed on your testimonial widget.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the {currentPlan?.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-medium text-xl">
                    {currentPlan?.name}{" "}
                    {currentPlan?.id !== "free" && (
                      <span className="text-md font-normal text-muted-foreground">
                        (${currentPlan?.price}/month)
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    {currentPlan?.features.map((feature, index) => (
                      <div className="flex items-center" key={index}>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>
                  Choose the plan that's right for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 ${
                        plan.id === currentPlan?.id
                          ? "border-voizzy-blue bg-voizzy-blue bg-opacity-5"
                          : "border-border"
                      }`}
                    >
                      <div className="font-medium text-lg">{plan.name}</div>
                      <div className="flex items-baseline mt-2">
                        <span className="text-2xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {plan.description}
                      </div>
                      <div className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <div className="flex items-center text-sm" key={index}>
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Button
                          className="w-full"
                          variant={
                            plan.id === currentPlan?.id ? "outline" : "default"
                          }
                          disabled={plan.id === currentPlan?.id}
                          onClick={() => upgradePlan(plan.id)}
                        >
                          {plan.id === currentPlan?.id
                            ? "Current Plan"
                            : "Upgrade"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
