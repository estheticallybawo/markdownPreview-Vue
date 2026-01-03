<template>
  <div class="preview-container">
    <div class="header">
      <h3 class="title">Preview</h3>
      <div class="stats">
        <span class="stat">
          {{ wordCount }} words
        </span>
        <span class="stat">
          {{ readingTime }} min read
        </span>
        <span v-if="isLoading" class="loading-indicator">
          Updating...
        </span>
      </div>
    </div>
    <div class="content">
      <div 
        v-if="htmlContent" 
        class="markdown"
        v-html="htmlContent"/>
      <div v-else class="empty-state">
        <p>Start typing in the editor to see a preview of your markdown.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
// FIXED: Correct import path for your folder structure
import { createDebouncedParser } from '../../lib/markdownParser';

interface Props {
  markdown: string;
  debounceDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  debounceDelay: 300,
});

const htmlContent = ref('');
const isLoading = ref(false);
let debouncedParser: ReturnType<typeof createDebouncedParser>;

// Initialize debounced parser
const initializeParser = () => {
  debouncedParser = createDebouncedParser(props.debounceDelay);
};

// Calculate word count
const wordCount = computed(() => {
  if (!props.markdown) return 0;
  return props.markdown.trim().split(/\s+/).filter(word => word.length > 0).length;
});

// Calculate reading time
const readingTime = computed(() => {
  return Math.max(1, Math.ceil(wordCount.value / 200));
});

// Parse markdown function
const parseMarkdown = () => {
  if (!props.markdown) {
    htmlContent.value = '';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  
  // Use debounced parser
  debouncedParser(props.markdown, (parsedHTML: string) => {
    htmlContent.value = parsedHTML;
    isLoading.value = false;
  });
};

// Initialize parser on component mount
onMounted(() => {
  initializeParser();
  parseMarkdown(); // Parse initial content
});

// Watch for markdown changes
watch(
  () => props.markdown,
  () => {
    parseMarkdown();
  }
);

// Cleanup on unmount
onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
/* Your existing CSS remains the same */
.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  overflow: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--secondary-bg);
  border-radius: 6px 6px 0 0;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
}

.stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
}

.loading-indicator {
  font-size: 12px;
  color: var(--accent-color);
  font-weight: 500;
  font-style: italic;
}

.content {
  flex: 1;
  padding: 16px;
  overflow: auto;
  min-height: 0;
}

.markdown {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

.markdown :deep() h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 1em 0 0.5em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown :deep() h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1.2em 0 0.5em 0;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown :deep() h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em 0;
}

.markdown :deep() p {
  margin: 0 0 1em 0;
}

.markdown :deep() ul,
.markdown :deep() ol {
  margin: 0 0 1em 1.5em;
  padding-left: 1.5em;
}

.markdown :deep() li {
  margin: 0.25em 0;
}

.markdown :deep() code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
  background-color: var(--secondary-bg);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.markdown :deep() pre {
  background-color: var(--secondary-bg);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown :deep() pre code {
  background-color: transparent;
  padding: 0;
}

.markdown :deep() blockquote {
  border-left: 4px solid var(--accent-color);
  margin: 1em 0;
  padding-left: 1em;
  color: var(--text-secondary);
  font-style: italic;
}

.markdown :deep() a {
  color: var(--accent-color);
  text-decoration: none;
}

.markdown :deep() a:hover {
  text-decoration: underline;
}

.markdown :deep() table {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown :deep() th,
.markdown :deep() td {
  border: 1px solid var(--border-color);
  padding: 0.5em 1em;
  text-align: left;
}

.markdown :deep() th {
  background-color: var(--secondary-bg);
  font-weight: 600;
}

.markdown :deep() img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  padding: 2em;
}

/* Scrollbar styling */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: var(--secondary-bg);
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: var(--border-hover-color);
}

/* Dark mode scrollbar */
[data-theme='dark'] .content::-webkit-scrollbar-track {
  background: #1f2937;
}

[data-theme='dark'] .content::-webkit-scrollbar-thumb {
  background: #4b5563;
}

[data-theme='dark'] .content::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .stats {
    gap: 12px;
  }
}
</style>