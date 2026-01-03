<template>
  <div class="documentsList">
    <div class="listHeader">
      <h3 class="listTitle">Cloud Documents</h3>
      <div v-if="lastSyncTime" class="syncTime">
        <Clock :class="['clockIcon']" />
        <span>Last sync: {{ formatDate(lastSyncTime) }}</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <RefreshCw class="spinning" />
      <span>Loading documents...</span>
    </div>

    <div v-else-if="!documents.length" class="emptyState">
      <FileText :class="['emptyIcon']" />
      <p>No documents in cloud</p>
      <p class="emptySubtext">Save your first document to get started</p>
    </div>

    <div v-else class="documents">
      <div v-for="doc in documents" :key="doc.id" class="documentItem">
        <div class="documentInfo">
          <h4 class="documentTitle">{{ doc.title }}</h4>
          <p v-if="doc.preview" class="documentPreview">{{ doc.preview }}</p>
          <p v-if="doc.createdAt" class="documentDate">
            {{ formatDate(doc.createdAt) }}
          </p>
        </div>

        <div class="documentActions">
          <button
            class="loadButton"
            @click="$emit('load', doc.id, doc.title)"
            :disabled="isLoading"
            title="Load document"
          >
            <CloudDownload :class="['actionIcon']" />
          </button>

          <button
            class="deleteButton"
            @click="$emit('delete', doc.id, doc.title)"
            :disabled="isLoading"
            title="Delete document"
          >
            <Trash2 :class="['actionIcon']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloudDownload, Trash2, FileText, Clock, RefreshCw } from 'lucide-vue-next'

interface CloudDocument {
  id: string | number
  title: string
  preview?: string
  createdAt?: string
}

interface Props {
  documents: CloudDocument[]
  isLoading?: boolean
  lastSyncTime?: string | null
}

interface Emits {
  (e: 'load', documentId: string | number, title: string): void
  (e: 'delete', documentId: string | number, title: string): void
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  lastSyncTime: null,
})

defineEmits<Emits>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.documentsList {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.listHeader {
  margin-bottom: 1.5rem;
}

.listTitle {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.syncTime {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.clockIcon {
  width: 0.875rem;
  height: 0.875rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.loading .spinning {
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

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--color-text-secondary);
}

.emptyIcon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.emptyState p {
  margin: 0.5rem 0;
  text-align: center;
}

.emptySubtext {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.documents {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.documentItem {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.documentItem:hover {
  border-color: var(--color-primary);
  background: var(--color-hover);
}

.documentInfo {
  flex: 1;
  min-width: 0;
}

.documentTitle {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  word-break: break-word;
}

.documentPreview {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.documentDate {
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.documentActions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.loadButton,
.deleteButton {
  padding: 0.5rem;
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadButton:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.deleteButton:hover:not(:disabled) {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.loadButton:disabled,
.deleteButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actionIcon {
  width: 1rem;
  height: 1rem;
}
</style>
