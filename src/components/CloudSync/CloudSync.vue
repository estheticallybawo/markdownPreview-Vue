<template>
  <div>
    <!-- Cloud Sync Button -->
    <button class="cloudButton" @click="toggleModal">
      <Cloud class="icon" />
      Cloud Sync
    </button>

    <!-- Modal -->
    <CloudSyncModal
      :is-open="isOpen"
      :is-loading="isLoading"
      :document-title="documentTitle"
      :documents="cloudDocuments"
      :last-sync-time="lastSyncTime"
      :show-save-form="showSaveForm"
      @close="closeModal"
      @refresh="handleRefresh"
      @toggleSaveForm="toggleSaveForm"
      @save="handleSaveToCloud"
      @load="handleLoadFromCloud"
      @delete="handleDeleteFromCloud"
    />

    <!-- Notification -->
    <CloudSyncNotification :notification="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { Cloud } from 'lucide-vue-next'
import { useCloudSync } from '../../composables/useCloudSync'
import { useErrorHandler } from '../../composables/useErrorHandler'
import { logger } from '../../services/logger'
import CloudSyncModal from './CloudSyncModal.vue'
import CloudSyncNotification from './CloudSyncNotification.vue'

interface Notification {
  type: 'success' | 'error'
  message: string
}

interface Props {
  currentContent: string
  documentTitle?: string
}

interface Emits {
  (e: 'contentLoad', content: string, title: string): void
}

const props = withDefaults(defineProps<Props>(), {
  documentTitle: 'Untitled Document',
})

const emit = defineEmits<Emits>()

const {
  isLoading,
  error,
  cloudDocuments,
  lastSyncTime,
  saveToCloud,
  loadFromCloud,
  deleteFromCloud,
  refreshCloudDocuments,
  clearError,
} = useCloudSync()

const isOpen = ref(false)
const showSaveForm = ref(false)
const notification = ref<Notification | null>(null)
let notificationTimer: number | null = null

// Load documents when modal opens
watch(isOpen, (newValue) => {
  if (newValue) {
    logger.info('Cloud sync modal opened')
    refreshCloudDocuments()
  }
})

// Show error notifications
watch(
  () => error.value,
  (newError) => {
    if (newError) {
      notification.value = { type: 'error', message: newError }
      clearNotificationAfterDelay()
      clearError()
    }
  },
)

const toggleModal = () => {
  isOpen.value = !isOpen.value
}

const closeModal = () => {
  isOpen.value = false
  showSaveForm.value = false
}

const toggleSaveForm = () => {
  showSaveForm.value = !showSaveForm.value
}

const clearNotificationAfterDelay = () => {
  if (notificationTimer) {
    window.clearTimeout(notificationTimer)
  }
  notificationTimer = window.setTimeout(() => {
    notification.value = null
  }, 5000)
}

const handleRefresh = async () => {
  try {
    await refreshCloudDocuments()
    notification.value = {
      type: 'success',
      message: 'Documents refreshed successfully',
    }
  } catch (err) {
    logger.error('Refresh failed', err as Error)
  }
  clearNotificationAfterDelay()
}

const handleSaveToCloud = async (title: string, tags: string) => {
  if (!props.currentContent.trim()) {
    notification.value = {
      type: 'error',
      message: 'Cannot save empty document',
    }
    clearNotificationAfterDelay()
    return
  }

  try {
    const result = await saveToCloud(title, props.currentContent, tags)

    if (result.success) {
      notification.value = {
        type: 'success',
        message: 'Document saved to cloud successfully',
      }
      showSaveForm.value = false
      await refreshCloudDocuments()
    }
  } catch (err) {
    logger.error('Save operation failed', err as Error)
  }
  clearNotificationAfterDelay()
}

const handleLoadFromCloud = async (documentId: string | number, title: string) => {
  try {
    const result = await loadFromCloud(documentId)

    if (result.success) {
      emit('contentLoad', result.data?.content || '', result.data?.title || title)
      notification.value = {
        type: 'success',
        message: `Loaded "${title}" successfully`,
      }
      closeModal()
    }
  } catch (err) {
    logger.error('Load operation failed', err as Error)
  }
  clearNotificationAfterDelay()
}

const handleDeleteFromCloud = async (documentId: string | number, title: string) => {
  if (window.confirm(`Are you sure you want to delete "${title}" from the cloud?`)) {
    try {
      const result = await deleteFromCloud(documentId)

      if (result.success) {
        notification.value = {
          type: 'success',
          message: `Deleted "${title}" successfully`,
        }
        await refreshCloudDocuments()
      }
    } catch (err) {
      logger.error('Delete operation failed', err as Error)
    }
    clearNotificationAfterDelay()
  }
}

// Cleanup on unmount
onBeforeUnmount(() => {
  if (notificationTimer) {
    window.clearTimeout(notificationTimer)
  }
})
</script>

<style scoped>
.cloudButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.cloudButton:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.cloudButton:active {
  transform: translateY(0);
}

.icon {
  width: 1rem;
  height: 1rem;
}
</style>
