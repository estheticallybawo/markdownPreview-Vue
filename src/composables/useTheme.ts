// composables/useTheme.ts
import { ref, onMounted, watch, computed, type Ref, type ComputedRef } from 'vue';

interface ThemeContext {
  isDarkMode: Ref<boolean>;
  toggleTheme: () => void;
  theme: ComputedRef<'dark' | 'light'>;
}

export function useTheme(): ThemeContext {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const isDarkMode = ref<boolean>(getInitialTheme());

  const theme = computed(() => isDarkMode.value ? 'dark' : 'light');

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
  };

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  // Apply theme on mount and when it changes
  onMounted(applyTheme);
  watch(isDarkMode, applyTheme, { immediate: true });

  return {
    isDarkMode,
    toggleTheme,
    theme,
  };
}