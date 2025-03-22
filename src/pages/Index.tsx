
import React from 'react';
import LoginForm from '@/components/LoginForm';
import StoryContainer from '@/components/StoryContainer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const IndexContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 dark:from-green-950 dark:via-emerald-950 dark:to-lime-950">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full glass-card p-6 rounded-xl backdrop-blur-sm"
          >
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full backdrop-blur-sm"
          >
            <StoryContainer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
