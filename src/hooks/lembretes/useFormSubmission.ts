
import { useState } from 'react';

/**
 * Hook to track form submission count
 * This is a simple counter to track how many times a form has been submitted
 */
export function useFormSubmission() {
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);
  
  const incrementFormSubmissionCount = () => {
    setFormSubmissionCount(prev => prev + 1);
  };
  
  return {
    formSubmissionCount,
    incrementFormSubmissionCount
  };
}
