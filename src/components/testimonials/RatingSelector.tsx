
import React from "react";
import { Star } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface RatingSelectorProps {
  control: any;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
}

const RatingSelector = ({ control, selectedRating, setSelectedRating }: RatingSelectorProps) => {
  return (
    <FormField
      control={control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rating</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => {
                    setSelectedRating(rating);
                    field.onChange(rating);
                  }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RatingSelector;
