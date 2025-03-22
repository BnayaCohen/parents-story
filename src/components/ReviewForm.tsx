
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  username: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ username }) => {
  const [review, setReview] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!review.trim()) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אנא הזן משוב לפני השליחה",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending the review
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "תודה על המשוב שלך!",
      description: "המשוב שלך התקבל בהצלחה.",
      className: "bg-green-50 text-green-800 border-green-200",
    });
    
    setReview('');
    setIsSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review" className="block font-medium text-green-700 dark:text-green-300 mb-2">
          המשוב שלך
        </label>
        <Textarea
          id="review"
          placeholder="שתף את המחשבות והתובנות שלך על הסיפור והמשימות..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-[120px] bg-white/80 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 focus:border-green-400 focus:ring-green-400"
          dir="rtl"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSending}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSending ? "שולח..." : "שלח משוב"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
