
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import data from '../data/storyData.json';

// Define types for our story data
export interface StoryData {
  storyPart1: {
    title: string;
    mainImage?: string;
    pages: Array<{
      image: string;
      content: string;
    }>;
    questions: Record<string, {
      text: string;
      options: string[];
      correctAnswer: number;
    }>;
    selectedQuestions?: string[]; // Added to store the randomly selected questions
  };
  summary: {
    title: string;
    feedback: {
      excellent: string;
      veryGood: string;
      good: string;
      needsImprovement: string;
      beginner: string;
    };
  };
}

interface StoryDataContextType {
  storyData: StoryData | null;
  isLoading: boolean;
  error: Error | null;
  fetchFromGoogleDrive: (fileId: string) => Promise<void>;
}

const StoryDataContext = createContext<StoryDataContextType | undefined>(undefined);

export const useStoryData = () => {
  const context = useContext(StoryDataContext);
  if (context === undefined) {
    throw new Error('useStoryData must be used within a StoryDataProvider');
  }
  return context;
};

interface StoryDataProviderProps {
  children: ReactNode;
}

export const StoryDataProvider: React.FC<StoryDataProviderProps> = ({ children }) => {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to select random questions
  const selectRandomQuestions = (data: StoryData): StoryData => {
    // Get all question keys
    const allQuestionKeys = Object.keys(data.storyPart1.questions);
    
    // We need exactly 4 random questions
    const numQuestionsToSelect = Math.min(4, allQuestionKeys.length);
    
    // Randomly select question keys
    const selectedKeys: string[] = [];
    const tempKeys = [...allQuestionKeys];
    
    for (let i = 0; i < numQuestionsToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * tempKeys.length);
      selectedKeys.push(tempKeys[randomIndex]);
      tempKeys.splice(randomIndex, 1);
    }
    
    // Set the selected questions in the data
    return {
      ...data,
      storyPart1: {
        ...data.storyPart1,
        selectedQuestions: selectedKeys
      }
    };
  };

  // Function to fetch data from a local JSON file
  const fetchLocalData = async () => {
    try {
      // const response = await fetch('/src/data/storyData.json');
      // if (!response.ok) {
      //   throw new Error('Failed to fetch story data');
      // }
      const dataWithRandomQuestions = selectRandomQuestions(data);
      setStoryData(dataWithRandomQuestions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching story data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch data from Google Drive
  const fetchFromGoogleDrive = async (fileId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Google Drive API endpoint for public files
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from Google Drive: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the data structure
      if (!validateStoryData(data)) {
        throw new Error('Invalid data format from Google Drive');
      }
      
      const dataWithRandomQuestions = selectRandomQuestions(data);
      setStoryData(dataWithRandomQuestions);
      console.log('Successfully loaded data from Google Drive');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching from Google Drive:', err);
      
      // Fallback to local data if Google Drive fails
      console.log('Falling back to local data...');
      await fetchLocalData();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate the data structure
  const validateStoryData = (data: any): data is StoryData => {
    return (
      data &&
      data.storyPart1 &&
      typeof data.storyPart1.title === 'string' &&
      Array.isArray(data.storyPart1.pages) &&
      data.storyPart1.pages.every((page: any) => 
        typeof page.image === 'string' && 
        typeof page.content === 'string'
      ) &&
      data.storyPart1.questions &&
      Object.values(data.storyPart1.questions).every((q: any) => 
        typeof q.text === 'string' &&
        Array.isArray(q.options) &&
        typeof q.correctAnswer === 'number'
      ) &&
      data.summary &&
      typeof data.summary.title === 'string' &&
      data.summary.feedback &&
      typeof data.summary.feedback.excellent === 'string' &&
      typeof data.summary.feedback.veryGood === 'string' &&
      typeof data.summary.feedback.good === 'string' &&
      typeof data.summary.feedback.needsImprovement === 'string' &&
      typeof data.summary.feedback.beginner === 'string'
    );
  };

  // On initial mount, fetch local data
  useEffect(() => {
    fetchLocalData();
  }, []);

  return (
    <StoryDataContext.Provider value={{ storyData, isLoading, error, fetchFromGoogleDrive }}>
      {children}
    </StoryDataContext.Provider>
  );
};
