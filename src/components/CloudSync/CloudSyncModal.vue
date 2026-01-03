<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal" @click.self="closeModal">
      <div class="modalContent">
        <div class="modalHeader">
          <h2 class="modalTitle">
            <Cloud class="titleIcon" />
            Cloud Sync
          </h2>
          <button class="closeButton" @click="closeModal" aria-label="Close modal">×</button>
        </div>

        <div class="modalBody">
          <div class="actionButtons">
            <button class="actionButton" @click="$emit('refresh')" :disabled="isLoading">
              <RefreshCw :class="['buttonIcon', { spinning: isLoading }]" />
              Refresh
            </button>

            <button class="actionButton" @click="$emit('toggleSaveForm')" :disabled="isLoading">
              <CloudUpload class="buttonIcon" />
              {{ showSaveForm ? 'Hide Save Form' : 'New Document' }}
            </button>
          </div>

          <CloudSyncSaveForm
            v-if="showSaveForm"
            :default-title="documentTitle"
            :is-loading="isLoading"
            @save="(title, tags) => $emit('save', title, tags)"
            @cancel="$emit('toggleSaveForm')"
          />

          <CloudSyncDocumentsList
            :documents="documents"
            :is-loading="isLoading"
            :last-sync-time="lastSyncTime"
            @load="(documentId, title) => $emit('load', documentId, title)"
            @delete="(documentId, title) => $emit('delete', documentId, title)"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Cloud, CloudUpload, RefreshCw } from 'lucide-vue-next'
import CloudSyncSaveForm from './CloudSyncSaveForm.vue'
import CloudSyncDocumentsList from './CloudSyncDocumentsList.vue'

interface CloudDocument {
  id: string | number
  title: string
  preview?: string
  createdAt?: string
}

interface Props {
  isOpen: boolean
  isLoading?: boolean
  documentTitle?: string
  documents?: CloudDocument[]
  lastSyncTime?: string | null
  showSaveForm?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'refresh'): void
  (e: 'toggleSaveForm'): void
  (e: 'save', title: string, tags: string): void
  (e: 'load', documentId: string | number, title: string): void
  (e: 'delete', documentId: string | number, title: string): void
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  documentTitle: 'Untitled Document',
  documents: () => [],
  lastSyncTime: null,
  showSaveForm: false,
})


const closeModal = () => {
  emit('close')
}

const emit = defineEmits<Emits>()
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modalContent {
  background: var(--color-background);
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border);
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  flex-shrink: 0;
}

.modalTitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.titleIcon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary);
}

.closeButton {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeButton:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.modalBody {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.actionButtons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.actionButton:hover:not(:disabled) {
  background: var(--color-hover);
  border-color: var(--color-primary);
}

.actionButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.buttonIcon {
  width: 1rem;
  height: 1rem;
}

.buttonIcon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .modal {
    padding: 0;
  }

  .modalContent {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modalBody {
    max-height: calc(100vh - 60px);
  }

  .actionButtons {
    flex-direction: column;
  }

  .actionButton {
    width: 100%;
  }
}
</style>
