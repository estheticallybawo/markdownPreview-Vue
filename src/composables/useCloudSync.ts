// src/composables/useCloudSync.ts
import { ref, type Ref } from 'vue';
import {
  saveMarkdownToAPI,
  loadMarkdownFromAPI,
  listMarkdownDocuments,
  deleteMarkdownFromAPI,
  updateMarkdownInAPI,
} from '../lib/api';
import { type APIResponse, type CloudDocument, parseAPIError } from '../types/api';
import { ApplicationError, ErrorType } from '../types/errors';
import { logger } from '../services/logger';
import { useErrorHandler } from './useErrorHandler';

export interface UseCloudSyncReturn {
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  cloudDocuments: Ref<CloudDocument[]>;
  lastSyncTime: Ref<string | null>;

  saveToCloud: (
    title: string,
    content: string,
    tags?: string
  ) => Promise<APIResponse>;
  loadFromCloud: (documentId: string | number) => Promise<APIResponse>;
  listCloudDocuments: (limit?: number) => Promise<APIResponse>;
  deleteFromCloud: (documentId: string | number) => Promise<APIResponse>;
  updateInCloud: (
    documentId: string | number,
    title: string,
    content: string,
    tags?: string
  ) => Promise<APIResponse>;
  refreshCloudDocuments: () => Promise<APIResponse>;
  clearError: () => void;
}

export function useCloudSync(): UseCloudSyncReturn {
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const cloudDocuments = ref<CloudDocument[]>([]);
  const lastSyncTime = ref<string | null>(null);

  const clearError = () => {
    error.value = null;
  };

  /**
   * Validate input parameters
   */
  const validateSaveInput = (
    title: string,
    content: string
  ): boolean => {
    if (!title?.trim()) {
      error.value = 'Document title is required';
      return false;
    }

    if (!content?.trim()) {
      error.value = 'Document content cannot be empty';
      return false;
    }

    if (title.length > 255) {
      error.value = 'Document title cannot exceed 255 characters';
      return false;
    }

    return true;
  };

  /**
   * Save document to cloud
   */
  const saveToCloud = async (
    title: string,
    content: string,
    tags: string = ''
  ): Promise<APIResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate input
      if (!validateSaveInput(title, content)) {
        return { success: false, message: error.value || 'Validation failed' };
      }

      logger.info('Saving document to cloud', { title });

      const result = await saveMarkdownToAPI(title, content, tags);

      if (result.success) {
        lastSyncTime.value = new Date().toISOString();
        logger.info('Document saved successfully', { title });
        return result;
      } else {
        const errorMsg =
          result.message || 'Failed to save document to cloud';
        error.value = errorMsg;
        logger.warn('Save failed', { title, message: errorMsg });
        return result;
      }
    } catch (err: any) {
      const appError = parseAPIError(err);
      error.value = appError.message;
      logger.error('Save error', appError);
      return { success: false, message: appError.message };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Load document from cloud
   */
  const loadFromCloud = async (
    documentId: string | number
  ): Promise<APIResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!documentId) {
        throw new ApplicationError(
          ErrorType.VALIDATION_ERROR,
          'Document ID is required'
        );
      }

      logger.info('Loading document from cloud', { documentId });

      const result = await loadMarkdownFromAPI(documentId);

      if (result.success) {
        lastSyncTime.value = new Date().toISOString();
        logger.info('Document loaded successfully', { documentId });
        return result;
      } else {
        const errorMsg =
          result.message || 'Failed to load document from cloud';
        error.value = errorMsg;
        logger.warn('Load failed', { documentId, message: errorMsg });
        return result;
      }
    } catch (err: any) {
      const appError = parseAPIError(err);
      error.value = appError.message;
      logger.error('Load error', appError);
      return { success: false, message: appError.message };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * List all cloud documents
   */
  const listCloudDocuments = async (limit: number = 10): Promise<APIResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (limit < 1 || limit > 100) {
        limit = 10;
      }

      logger.info('Fetching cloud documents', { limit });

      const result = await listMarkdownDocuments(limit);

      if (result.success) {
        // Validate documents array
        cloudDocuments.value = Array.isArray(result.data) ? result.data : [];
        lastSyncTime.value = new Date().toISOString();
        logger.info('Documents fetched successfully', {
          count: cloudDocuments.value.length,
        });
        return result;
      } else {
        const errorMsg =
          result.message || 'Failed to fetch cloud documents';
        error.value = errorMsg;
        cloudDocuments.value = [];
        logger.warn('Fetch failed', { message: errorMsg });
        return result;
      }
    } catch (err: any) {
      const appError = parseAPIError(err);
      error.value = appError.message;
      cloudDocuments.value = [];
      logger.error('Fetch error', appError);
      return { success: false, message: appError.message };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete document from cloud
   */
  const deleteFromCloud = async (
    documentId: string | number
  ): Promise<APIResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!documentId) {
        throw new ApplicationError(
          ErrorType.VALIDATION_ERROR,
          'Document ID is required'
        );
      }

      logger.info('Deleting document from cloud', { documentId });

      const result = await deleteMarkdownFromAPI(documentId);

      if (result.success) {
        // Remove from local state
        cloudDocuments.value = cloudDocuments.value.filter(
          (doc) => doc.id !== documentId
        );
        lastSyncTime.value = new Date().toISOString();
        logger.info('Document deleted successfully', { documentId });
        return result;
      } else {
        const errorMsg =
          result.message || 'Failed to delete document from cloud';
        error.value = errorMsg;
        logger.warn('Delete failed', { documentId, message: errorMsg });
        return result;
      }
    } catch (err: any) {
      const appError = parseAPIError(err);
      error.value = appError.message;
      logger.error('Delete error', appError);
      return { success: false, message: appError.message };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update document in cloud
   */
  const updateInCloud = async (
    documentId: string | number,
    title: string,
    content: string,
    tags: string = ''
  ): Promise<APIResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validate input
      if (!validateSaveInput(title, content)) {
        return { success: false, message: error.value || 'Validation failed' };
      }

      if (!documentId) {
        throw new ApplicationError(
          ErrorType.VALIDATION_ERROR,
          'Document ID is required'
        );
      }

      logger.info('Updating document in cloud', { documentId, title });

      const result = await updateMarkdownInAPI(
        documentId,
        title,
        content,
        tags
      );

      if (result.success) {
        lastSyncTime.value = new Date().toISOString();
        logger.info('Document updated successfully', { documentId });
        return result;
      } else {
        const errorMsg =
          result.message || 'Failed to update document in cloud';
        error.value = errorMsg;
        logger.warn('Update failed', { documentId, message: errorMsg });
        return result;
      }
    } catch (err: any) {
      const appError = parseAPIError(err);
      error.value = appError.message;
      logger.error('Update error', appError);
      return { success: false, message: appError.message };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh cloud documents list
   */
  const refreshCloudDocuments = () => {
    return listCloudDocuments();
  };

  return {
    isLoading,
    error,
    cloudDocuments,
    lastSyncTime,
    saveToCloud,
    loadFromCloud,
    listCloudDocuments,
    deleteFromCloud,
    updateInCloud,
    refreshCloudDocuments,
    clearError,
  };
}
