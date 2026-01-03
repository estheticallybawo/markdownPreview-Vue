import { ApplicationError, ErrorType } from './errors'

/**
 * Generic API response wrapper
 */
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  statusCode?: number
  timestamp?: string
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Paginated API response
 */
export interface PaginatedAPIResponse<T = any> extends APIResponse<T> {
  meta?: PaginationMeta
}

/**
 * Cloud document type
 */
export interface CloudDocument {
  id: string | number
  title: string
  content?: string
  preview?: string
  tags?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Validated cloud document (with required fields)
 */
export interface ValidatedCloudDocument extends Required<Pick<CloudDocument, 'id' | 'title'>> {
  content?: string
  preview?: string
  tags?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Request error details
 */
export interface RequestErrorDetails {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

/**
 * Parse API error response and convert to ApplicationError
 */
export const parseAPIError = (error: any): ApplicationError => {
  // Network error (no response)
  if (error.message === 'Network Error' || !error.response) {
    return new ApplicationError(
      ErrorType.NETWORK_ERROR,
      'Unable to connect to server. Please check your internet connection.',
    )
  }

  const { status, data } = error.response
  const message = data?.message || data?.error || 'An error occurred'

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return new ApplicationError(
        ErrorType.VALIDATION_ERROR,
        message || 'Invalid input provided',
        status,
        data?.errors,
      )

    case 401:
      return new ApplicationError(ErrorType.UNAUTHORIZED, message || 'Unauthorized access', status)

    case 404:
      return new ApplicationError(ErrorType.NOT_FOUND, message || 'Resource not found', status)

    case 500:
    case 502:
    case 503:
    case 504:
      return new ApplicationError(
        ErrorType.SERVER_ERROR,
        message || 'Server error. Please try again later.',
        status,
      )

    default:
      return new ApplicationError(ErrorType.UNKNOWN_ERROR, message, status)
  }
}

/**
 * Validate API response structure
 */
export const validateAPIResponse = <T = any>(response: any): APIResponse<T> => {
  if (!response || typeof response !== 'object') {
    throw new ApplicationError(ErrorType.SERVER_ERROR, 'Invalid response format from server')
  }

  if (typeof response.success !== 'boolean') {
    throw new ApplicationError(ErrorType.SERVER_ERROR, 'Invalid response: missing success field')
  }

  return response as APIResponse<T>
}
