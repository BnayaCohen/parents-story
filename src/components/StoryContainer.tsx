
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogOut, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoryData } from '@/context/StoryDataContext';
import { useToast } from '@/components/ui/use-toast';
import StoryView from './StoryView';
import QuestionsView from './QuestionsView';

const StoryContainer: React.FC = () => {
  // Story viewing state
  const [showQuestions, setShowQuestions] = useState(false);
  
  const { username, logout } = useAuth();
  const { storyData, isLoading, error } = useStoryData();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="w-full max-w-2xl mx-auto p-8 text-center" dir="rtl">טוען נתוני סיפור...</div>;
  }

  if (error || !storyData) {
    toast({
      variant: "destructive",
      title: "שגיאה בטעינת נתוני הסיפור",
      description: error?.message || "אנא נסה לרענן את העמוד",
    });
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center text-red-600" dir="rtl">
        כשל בטעינת נתוני הסיפור. אנא רענן את העמוד.
      </div>
    );
  }

  const { pages, questions, mainImage, selectedQuestions = [] } = storyData.storyPart1;

  // Create a mapping of question IDs to question names
  const questionNames: Record<string, string> = {};
  if (selectedQuestions && selectedQuestions.length > 0) {
    // Use the question IDs directly as the names
    selectedQuestions.forEach((qId) => {
      questionNames[qId] = qId;
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          שלום, {username}!
        </motion.div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 border-2 rounded-full font-medium"
        >
          <LogOut className="h-4 w-4 ml-2" />
          התנתק
        </Button>
      </div>

      {!showQuestions ? (
        <StoryView 
          title={storyData.storyPart1.title}
          pages={pages}
          onComplete={() => setShowQuestions(true)}
        />
      ) : (
        <QuestionsView 
          title={storyData.storyPart1.title}
          mainImage={mainImage || pages[0].image}
          questions={questions}
          questionNames={questionNames}
          selectedQuestions={selectedQuestions}
        />
      )}
    </div>
  );
};

export default StoryContainer;
