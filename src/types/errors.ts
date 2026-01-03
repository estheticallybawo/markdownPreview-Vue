/**
 * Custom error types for the application
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType
  message: string
  statusCode?: number
  details?: Record<string, any>
  timestamp: string
}

export class ApplicationError extends Error {
  type: ErrorType
  statusCode?: number
  details?: Record<string, any>
  timestamp: string

  constructor(
    type: ErrorType,
    message: string,
    statusCode?: number,
    details?: Record<string, any>,
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
    Object.setPrototypeOf(this, ApplicationError.prototype)
  }

  toJSON(): AppError {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    }
  }
}

/**
 * Error messages mapping
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ErrorType.VALIDATION_ERROR]: 'Invalid input. Please check your data and try again.',
  [ErrorType.NOT_FOUND]: 'Resource not found.',
  [ErrorType.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ErrorType.SERVER_ERROR]: 'Server error. Please try again later.',
  [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred.',
}

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: AppError | Error | string): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof ApplicationError) {
    return ERROR_MESSAGES[error.type] || error.message
  }

  return ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR]
}
