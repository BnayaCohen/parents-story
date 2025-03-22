
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StoryViewProps {
  title: string;
  pages: Array<{
    image: string;
    content: string;
  }>;
  onComplete: () => void;
}

const StoryView: React.FC<StoryViewProps> = ({ title, pages, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const isLastPage = currentPage === pages.length - 1;

  const handleNextPage = () => {
    if (isAnimating) return;

    if (currentPage < pages.length - 1) {
      setIsAnimating(true);
      setDirection(1);
      setTimeout(() => {
        setCurrentPage(prevPage => prevPage + 1);
        setIsAnimating(false);
      }, 500); // Match the animation duration
    } else {
      onComplete();
    }
  };

  // Page transition variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -300 : 300, // Reversed for RTL
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth feeling
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? -300 : 300, // Reversed for RTL
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
      dir="rtl"
    >
      <Card className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-2xl overflow-hidden border-2 border-amber-200 dark:border-amber-800 shadow-lg">
        <h1 className="text-2xl font-serif mb-4 text-amber-800 dark:text-amber-300 font-bold">
          {title}
        </h1>

        <div className="flex flex-col items-center relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <div className="h-72 justify-self-center mb-6 overflow-hidden rounded-lg bg-amber-100 dark:bg-amber-800/30">
                <img
                  src={pages[currentPage].image}
                  alt={`איור סיפור ${currentPage + 1}`}
                  className="h-full m-auto object-fill"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>

              <p className="text-base leading-relaxed mb-8 font-medium text-center">
                {pages[currentPage].content}
              </p>
            </motion.div>
          </AnimatePresence>

          <Button
            onClick={handleNextPage}
            disabled={isAnimating}
            className={`
              ${isAnimating ? 'opacity-50' : 'opacity-100'} 
              transition-all duration-300 
              bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full
              transform hover:scale-105 active:scale-95
            `}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isLastPage ? "הצג שאלות" : "המשך"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StoryView;
