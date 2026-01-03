<template>
  <form @submit.prevent="handleSubmit" class="saveForm">
    <h3 class="formTitle">Save to Cloud</h3>

    <input v-model="title" type="text" placeholder="Document title" class="formInput" required />

    <input v-model="tags" type="text" placeholder="Tags (comma-separated)" class="formInput" />

    <div class="formButtons">
      <button type="submit" class="saveButton" :disabled="isLoading || !title.trim()">
        <CloudUpload :class="['buttonIcon', { spinning: isLoading }]" />
        {{ isLoading ? 'Saving...' : 'Save Document' }}
      </button>

      <button type="button" class="cancelButton" @click="handleCancel" :disabled="isLoading">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloudUpload } from 'lucide-vue-next'

interface Props {
  defaultTitle?: string
  isLoading?: boolean
}

interface Emits {
  (e: 'save', title: string, tags: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  defaultTitle: 'Untitled Document',
  isLoading: false,
})

const emit = defineEmits<Emits>()

const title = ref(props.defaultTitle)
const tags = ref('')

const handleSubmit = () => {
  if (title.value.trim()) {
    emit('save', title.value, tags.value)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.saveForm {
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
}

.formTitle {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.formInput {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.formInput:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.formInput::placeholder {
  color: var(--color-text-secondary);
}

.formButtons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.saveButton {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.saveButton:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.saveButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancelButton {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancelButton:hover:not(:disabled) {
  background: var(--color-hover);
}

.cancelButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.buttonIcon {
  width: 1rem;
  height: 1rem;
}

.spinning {
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
</style>
