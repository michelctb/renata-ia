
import { useState, useEffect } from 'react';

/**
 * Hook to handle form submission effects.
 * Triggers data reload when form submissions occur.
 * 
 * @param {Function} loadLembretes - Function to reload lembretes data
 * @returns {Object} Object containing submission state and handlers
 * @property {number} formSubmissionCount - Counter for tracking form submissions
 * @property {Function} incrementFormSubmissionCount - Function to increment the submission counter
 */
export function useFormSubmission(loadLembretes: () => Promise<void>) {
  const [formSubmissionCount, setFormSubmissionCount] = useState(0);

  // Effect for form submissions to avoid race conditions
  useEffect(() => {
    if (formSubmissionCount > 0) {
      console.log('Form submission detected, reloading lembretes');
      loadLembretes();
    }
  }, [formSubmissionCount, loadLembretes]);

  const incrementFormSubmissionCount = () => {
    console.log('Incrementing form submission counter to trigger reload');
    setFormSubmissionCount(prev => prev + 1);
  };

  return {
    formSubmissionCount,
    incrementFormSubmissionCount
  };
}
