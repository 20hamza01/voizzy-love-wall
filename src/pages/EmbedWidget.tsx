
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Star } from "lucide-react";

const EmbedWidget = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getApprovedTestimonials } = useTestimonials();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // Get approved testimonials for this user
      const fetchTestimonials = async () => {
        try {
          const approvedTestimonials = await getApprovedTestimonials(userId);
          setTestimonials(approvedTestimonials);
        } catch (error) {
          console.error("Error fetching testimonials:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTestimonials();
    }
  }, [userId, getApprovedTestimonials]);

  // Auto rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  const handleNext = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-voizzy-blue">Loading...</div>
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-center text-muted-foreground">No testimonials available yet</p>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="bg-voizzy-blue text-white p-4">
        <h2 className="font-medium text-lg">Wall of Love</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="testimonial-card animate-bubble-pop">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{currentTestimonial.client_name}</h3>
              {currentTestimonial.client_role && (
                <p className="text-sm text-muted-foreground">
                  {currentTestimonial.client_role}
                </p>
              )}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < currentTestimonial.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm">{currentTestimonial.content}</p>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="border-t p-3 flex justify-between items-center">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <div className="flex space-x-1">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`block w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-voizzy-blue" : "bg-gray-200"
                }`}
              ></span>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            →
          </button>
        </div>
      )}

      <div className="border-t text-center p-2">
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
      </div>
    </div>
  );
};

export default EmbedWidget;
