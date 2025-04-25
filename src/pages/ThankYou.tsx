
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ThankYou = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="w-full text-center">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Thank You!</h1>
            <p className="text-muted-foreground mt-2">
              Your testimonial has been submitted successfully. We appreciate your feedback!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <div className="space-y-4">
              <Button asChild variant="outline">
                <Link to={`/collect/${userId}`}>
                  Submit Another Testimonial
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground pt-4">
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
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
