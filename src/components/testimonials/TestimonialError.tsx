
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TestimonialErrorProps {
  message: string;
}

export default function TestimonialError({ message }: TestimonialErrorProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      <Button 
        variant="outline" 
        onClick={() => window.location.href = '/dashboard'}
        className="mt-4"
      >
        Return to Dashboard
      </Button>
    </div>
  );
}
