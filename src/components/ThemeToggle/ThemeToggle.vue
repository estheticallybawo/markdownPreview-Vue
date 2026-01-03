<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="`Switch to ${isDarkMode ? 'light' : 'dark'} mode`"
    :title="`Switch to ${isDarkMode ? 'light' : 'dark'} mode`"
  >
    <span class="label">
      {{ isDarkMode ? 'Light' : 'Dark' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../../composables/useTheme';

const { isDarkMode, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background-color: var(--button-bg);
  color: var(--text-color);
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.theme-toggle:hover {
  background-color: var(--button-hover-bg);
  border-color: var(--border-hover-color);
}

.theme-toggle:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.label {
  font-weight: 600;
}
.icon {
  font-size: 16px;
}

.label {
  font-weight: 600;
}

</style>