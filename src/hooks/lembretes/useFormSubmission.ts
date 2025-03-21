
import { useState } from 'react';

/**
 * Custom hook to track the number of form submissions
 * 
 * @returns {Object} Object containing the submission count and increment function
 */
export function useFormSubmission() {
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);
  
  /**
   * Increments the form submission count
   */
  const incrementFormSubmissionCount = () => {
    setFormSubmissionCount(prev => prev + 1);
  };
  
  return {
    formSubmissionCount,
    incrementFormSubmissionCount
  };
}
