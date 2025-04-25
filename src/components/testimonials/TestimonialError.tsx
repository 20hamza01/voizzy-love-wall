
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface TestimonialErrorProps {
  message: string;
}

export default function TestimonialError({ message }: TestimonialErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
