
import React from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LogOut, BookOpen, Brain, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStoryData } from '@/context/StoryDataContext';
import { useToast } from '@/components/ui/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReviewForm from '@/components/ReviewForm';

const SummaryContent: React.FC = () => {
  const { username, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  
  const userAnswers = location.state?.userAnswers || {};
  const selectedQuestions = location.state?.selectedQuestions || [];
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
  
  // Count correct answers
  const correctAnswersCount = Object.entries(userAnswers).reduce((count, [questionId, selectedAnswer]) => {
    const question = storyData.storyPart1.questions[questionId];
    if (question && selectedAnswer === question.correctAnswer) {
      return count + 1;
    }
    return count;
  }, 0);
  
  // Generate a personalized summary based on correct answers
  const getSummary = () => {
    console.log(selectedQuestions);
    
    const totalQuestions = selectedQuestions.length;
    if (correctAnswersCount === totalQuestions) {
      return storyData.summary.feedback.excellent;
    } else if (correctAnswersCount >= totalQuestions * 0.75) {
      return storyData.summary.feedback.veryGood;
    } else if (correctAnswersCount >= totalQuestions * 0.5) {
      return storyData.summary.feedback.good;
    } else if (correctAnswersCount >= totalQuestions * 0.25) {
      return storyData.summary.feedback.needsImprovement;
    } else {
      return storyData.summary.feedback.beginner;
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          הסיכום שלך, {username}!
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl mb-6 border-2 border-green-200 dark:border-green-800 shadow-lg"
      >
        <h1 className="text-2xl font-serif mb-6 text-green-800 dark:text-green-300 font-bold flex items-center justify-center gap-2">
          <Brain className="h-6 w-6" />
          {storyData.summary.title}
        </h1>
        
        <div className="space-y-6">
          {selectedQuestions.map((questionId, index) => {
            const question = storyData.storyPart1.questions[questionId];
            if (!question) return null;
            
            const selectedAnswer = userAnswers[questionId];
            const isCorrect = selectedAnswer === question.correctAnswer;
            
            // Get all options except the selected and correct ones
            const otherOptions = question.options
              .map((option, idx) => ({ text: option, index: idx }))
              .filter(option => 
                option.index !== selectedAnswer && 
                option.index !== question.correctAnswer
              )
              .slice(0, 3); // Limit to 3 other options to keep the UI clean
            
            return (
              <motion.div 
                key={questionId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/60 dark:bg-white/10 p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">שאלה {index + 1}: {questionId}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {question.text}
                </p>
                
                <div className={`flex items-center gap-2 ${
                  isCorrect 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {isCorrect ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                  <span className="font-medium">
                    התשובה שלך: {selectedAnswer !== undefined ? question.options[selectedAnswer] : "לא ענית"}
                    {!isCorrect && selectedAnswer !== undefined && (
                      <span className="mr-2 text-green-600 dark:text-green-400">
                        (התשובה הנכונה: {question.options[question.correctAnswer]})
                      </span>
                    )}
                  </span>
                </div>
                
                {otherOptions.length > 0 && (
                  <Collapsible className="mt-3">
                    <CollapsibleTrigger className="flex items-center text-sm text-green-700 dark:text-green-400 font-medium">
                      <Info className="h-4 w-4 ml-1" />
                      אפשרויות נוספות
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-1">
                      {otherOptions.map((option) => (
                        <div key={option.index} className="text-sm text-gray-600 dark:text-gray-400 pr-6">
                          • {option.text}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 mb-6"
      >
        <h2 className="text-xl font-serif text-green-800 dark:text-green-300 mb-3">משוב אישי</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {getSummary()}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 mb-6"
      >
        <h2 className="text-xl font-serif text-green-800 dark:text-green-300 mb-3">שתף את חוויתך</h2>
        <ReviewForm username={username} />
      </motion.div>
      
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
        >
          חזרה להתחלה
        </Button>
      </div>
    </div>
  );
};

const Summary: React.FC = () => {
  return (
    <AuthProvider>
      <SummaryContent />
    </AuthProvider>
  );
};

export default Summary;
