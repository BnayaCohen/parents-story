
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionProps {
  question: {
    text: string;
    options: string[];
    correctAnswer: number;
    displayOptions: Array<{
      text: string;
      index: number;
    }>;
  };
  onAnswer: (answer: number) => void;
  selectedAnswer?: number;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl mt-8 px-6 py-5 border-2 shadow-md"
      dir="rtl"
    >
      <h3 className="text-lg font-bold mb-2 font-serif text-green-700 dark:text-green-300">בואו נחשוב על זה...</h3>
      <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">{question.text}</p>
      
      <div className="flex flex-col gap-3 mt-4">
        {question.displayOptions.map((option) => (
          <Button 
            key={option.index}
            onClick={() => onAnswer(option.index)}
            disabled={selectedAnswer !== undefined}
            className={`
              justify-start text-right
              ${selectedAnswer === option.index
                ? option.index === question.correctAnswer
                  ? "bg-green-200 text-green-800 border-2 border-green-400 dark:bg-green-700 dark:text-green-100"
                  : "bg-red-200 text-red-800 border-2 border-red-400 dark:bg-red-700 dark:text-red-100"
                : "bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 hover:border-green-400 dark:bg-green-800/30 dark:text-green-300 dark:border-green-700"} 
              rounded-xl
            `}
          >
            {selectedAnswer === option.index && (
              option.index === question.correctAnswer 
                ? <CheckCircle className="h-4 w-4 ml-2 flex-shrink-0" /> 
                : <XCircle className="h-4 w-4 ml-2 flex-shrink-0" />
            )}
            <span>{option.text}</span>
            {selectedAnswer !== undefined && option.index === question.correctAnswer && selectedAnswer !== option.index && (
              <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
            )}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default Question;
