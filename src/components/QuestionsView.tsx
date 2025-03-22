import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import StoryButton from './StoryButton';
import Question from './Question';

interface QuestionsViewProps {
  title: string;
  mainImage: string;
  questions: Record<string, {
    text: string;
    options: string[];
    correctAnswer: number;
  }>;
  questionNames: Record<string, string>;
  selectedQuestions: string[];
}

interface DisplayQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  displayOptions: Array<{
    text: string;
    index: number;
  }>;
}

const QuestionsView: React.FC<QuestionsViewProps> = ({
  title,
  mainImage,
  questions,
  questionNames,
  selectedQuestions
}) => {
  const navigate = useNavigate();

  // Question states
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [processedQuestions, setProcessedQuestions] = useState<Record<string, DisplayQuestion>>({});

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Process questions to include random selection of options
  useEffect(() => {
    const processed: Record<string, DisplayQuestion> = {};

    selectedQuestions.forEach((qId) => {
      const question = questions[qId];
      if (!question) return;

      const correctOption = question.options[question.correctAnswer];

      // Create array of all options except the correct one
      const otherOptions = question.options
        .filter((_, index) => index !== question.correctAnswer)
        .map((text, index) => ({
          text,
          originalIndex: index < question.correctAnswer ? index : index + 1
        }));

      // Randomly select 3 other options
      const selectedOtherOptions = shuffleArray(otherOptions).slice(0, 3);

      // Add the correct option
      const allOptions = [
        ...selectedOtherOptions,
        { text: correctOption, originalIndex: question.correctAnswer }
      ];

      // Shuffle all options
      const shuffledOptions = shuffleArray(allOptions);

      // Create the display options with correct mapping to original indices
      const displayOptions = shuffledOptions.map(option => ({
        text: option.text,
        index: option.originalIndex
      }));

      processed[qId] = {
        ...question,
        displayOptions
      };
    });

    setProcessedQuestions(processed);
  }, [questions, selectedQuestions]);

  const handleButtonClick = (questionId: string) => {
    if (questionId === selectedQuestions[currentStep]) {
      setActiveQuestion(questionId);
    }
  };

  const handleAnswer = (answer: number) => {
    if (activeQuestion !== null) {
      // Save this answer
      setUserAnswers(prev => ({ ...prev, [activeQuestion]: answer }));

      // Mark this question as completed
      if (!completedQuestions.includes(activeQuestion)) {
        setCompletedQuestions(prev => [...prev, activeQuestion]);
      }

      // If this was the last question, navigate to the summary page
      if (currentStep === selectedQuestions.length - 1) {
        // navigate('/summary', { state: { userAnswers: { ...userAnswers, [activeQuestion]: answer }, selectedQuestions } });
      } else {
        // Otherwise, advance to the next question if it's not already completed
        const nextStep = currentStep + 1;
        if (nextStep < selectedQuestions.length) {
          setCurrentStep(nextStep);
          setTimeout(() => {
            setActiveQuestion(selectedQuestions[nextStep]);
          }, 500); // Small delay before showing next question
        }
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl mb-6 border-2 border-green-200 dark:border-green-800 shadow-lg"
        dir="rtl"
      >
        <h1 className="text-2xl font-serif mb-4 text-green-800 dark:text-green-300 font-bold">
          {title}
        </h1>

        <div className="h-72 justify-self-center mb-6 overflow-hidden rounded-lg bg-green-100 dark:bg-amber-800/30">
          <img
            src={mainImage}
            alt={`איור מרכזי של הסיפור`}
            className="h-full m-auto object-fill"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-lg font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800/40 p-3 rounded-lg">
          <BookOpen className="h-5 w-5" />
          עכשיו שקראת את הסיפור, בוא נבדוק את ההבנה שלך עם השאלות האלה.
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-5 justify-center mb-6" dir="rtl">
        {selectedQuestions.map((qId, index) => {
          const isCompleted = completedQuestions.includes(qId);
          const isActive = activeQuestion === qId;
          const isDisabled = index !== currentStep;
          const questionName = questionNames[qId] || `שאלה ${index + 1}`;

          return (
            <motion.div
              key={qId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="relative"
            >
              <StoryButton
                onClick={() => handleButtonClick(qId)}
                active={isActive || isCompleted}
                disabled={isDisabled && !isCompleted}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 ml-1" />
                ) : (
                  <span className="ml-1">{index + 1}</span>
                )}
                {questionName}
              </StoryButton>

              {index < selectedQuestions.length - 1 && (
                <ArrowLeft className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-green-600 dark:text-green-400 h-4 w-4" />
              )}
            </motion.div>
          );
        })}
      </div>

      {activeQuestion !== null && processedQuestions[activeQuestion] && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-6 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 rounded-xl"
            dir="rtl"
          >
            <Question
              question={processedQuestions[activeQuestion]}
              onAnswer={handleAnswer}
              selectedAnswer={userAnswers[activeQuestion]}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {completedQuestions.length === selectedQuestions.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
          dir="rtl"
        >
          <Button
            onClick={() => navigate('/summary', { state: { userAnswers, selectedQuestions } })}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transform hover:scale-105 transition-transform"
          >
            צפה בסיכום שלך
          </Button>
        </motion.div>
      )}
    </>
  );
};

export default QuestionsView;
