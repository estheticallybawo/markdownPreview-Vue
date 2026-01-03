<template>
  <slot v-if="!hasError" />
  <div v-else class="errorBoundary">
    <div class="errorContainer">
      <AlertCircle class="errorIcon" />
      <h1 class="errorTitle">Oops! Something went wrong</h1>
      <p class="errorMessage">
        We're sorry, but an unexpected error occurred while rendering this component.
      </p>

      <div v-if="isDevelopment" class="errorDetails">
        <details>
          <summary>Error Details (Development Only)</summary>
          <pre class="errorStack">{{ formatError() }}</pre>
        </details>
      </div>

      <div class="errorActions">
        <button class="retryButton" @click="handleRetry">Try Again</button>
        <button class="homeButton" @click="goHome">Go to Home</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { logger } from '../services/logger'
import { ApplicationError } from '../types/errors'

interface Props {
  fallback?: any
}

withDefaults(defineProps<Props>(), {
  fallback: null,
})

const hasError = ref(false)
const error = ref<Error | null>(null)
const errorInfo = ref<string>('')
const isDevelopment = import.meta.env.DEV

const handleRetry = () => {
  hasError.value = false
  error.value = null
  errorInfo.value = ''
}

const goHome = () => {
  window.location.href = '/'
}

const formatError = (): string => {
  if (!error.value) return ''

  let message = `Error: ${error.value.message}\n`
  message += `Context: ${errorInfo.value}\n`

  if (error.value instanceof ApplicationError) {
    message += `Type: ${error.value.type}\n`
    if (error.value.statusCode) {
      message += `Status: ${error.value.statusCode}\n`
    }
  }

  if (error.value.stack) {
    message += `\nStack Trace:\n${error.value.stack}`
  }

  return message
}

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  error.value = err as Error
  errorInfo.value = info

  // Log the error
  if (err instanceof ApplicationError) {
    logger.error(`Error Boundary: ${info}`, err)
  } else {
    logger.error(`Error Boundary: ${info}`, err as Error)
  }

  // Return false to prevent error from propagating further
  return false
})
</script>

<style scoped>
.errorBoundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.errorContainer {
  max-width: 600px;
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.errorIcon {
  width: 4rem;
  height: 4rem;
  color: #dc2626;
  margin: 0 auto 1rem;
}

.errorTitle {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.errorMessage {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.errorDetails {
  margin: 2rem 0;
  text-align: left;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.errorDetails summary {
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  user-select: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.errorDetails summary:hover {
  background-color: #f0f0f0;
}

.errorStack {
  background-color: #1f2937;
  color: #10b981;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: 0.75rem;
}

.errorActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.retryButton,
.homeButton {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.retryButton {
  background-color: #3b82f6;
  color: white;
}

.retryButton:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.homeButton {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.homeButton:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

@media (max-width: 640px) {
  .errorContainer {
    padding: 2rem;
  }

  .errorTitle {
    font-size: 1.5rem;
  }

  .errorActions {
    flex-direction: column;
  }

  .retryButton,
  .homeButton {
    width: 100%;
  }
}
</style>
