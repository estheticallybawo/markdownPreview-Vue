import { ref, type Ref } from 'vue';
import {
  ApplicationError,
  ErrorType,
  getUserFriendlyMessage,
} from '../types/errors';
import { logger } from '../services/logger';

interface UseErrorHandlerReturn {
  error: Ref<ApplicationError | null>;
  hasError: Ref<boolean>;
  errorMessage: Ref<string>;
  setError: (error: ApplicationError | Error | string) => void;
  clearError: () => void;
  handleError: (
    error: any,
    context?: string
  ) => ApplicationError;
}

/**
 * Composable for centralized error handling
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const error = ref<ApplicationError | null>(null);
  const hasError = ref(false);
  const errorMessage = ref('');

  const setError = (err: ApplicationError | Error | string) => {
    if (typeof err === 'string') {
      error.value = new ApplicationError(
        ErrorType.UNKNOWN_ERROR,
        err
      );
    } else if (err instanceof ApplicationError) {
      error.value = err;
    } else {
      error.value = new ApplicationError(
        ErrorType.UNKNOWN_ERROR,
        err.message || 'An unexpected error occurred'
      );
    }

    hasError.value = true;
    errorMessage.value = getUserFriendlyMessage(error.value);
  };

  const clearError = () => {
    error.value = null;
    hasError.value = false;
    errorMessage.value = '';
  };

  const handleError = (
    err: any,
    context: string = 'Unknown operation'
  ): ApplicationError => {
    let appError: ApplicationError;

    if (err instanceof ApplicationError) {
      appError = err;
    } else if (err instanceof Error) {
      appError = new ApplicationError(
        ErrorType.UNKNOWN_ERROR,
        err.message
      );
    } else {
      appError = new ApplicationError(
        ErrorType.UNKNOWN_ERROR,
        String(err)
      );
    }

    logger.error(`${context}: ${appError.message}`, appError);
    setError(appError);
    return appError;
  };

  return {
    error,
    hasError,
    errorMessage,
    setError,
    clearError,
    handleError,
  };
}