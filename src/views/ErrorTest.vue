<template>
  <div class="container">
    <h1 class="title">Error Boundary Test</h1>
    <p class="description">
      This page is used to test the ErrorBoundary component. Click the button below to trigger an error.
    </p>
    <button 
      class="error-button"
      @click="triggerError"
    >
      Trigger Test Error
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showError = ref(false);

const triggerError = () => {
  showError.value = true;
};

// Throw error when showError is true
if (showError.value) {
  throw new Error('This is a test error for ErrorBoundary testing!');
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.description {
  font-size: 1.1rem;
 color: var(--color-text-primary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-button:hover {
  background-color: #b91c1c;
}

.error-button:focus {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}
</style>