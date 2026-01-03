<template>
  <div :class="['editor-container', { focused }]">
    <div class="header">
      <h2 class="title">Markdown Editor</h2>
      <div class="stats">
        <span class="stat">{{ props.modelValue.length }} characters</span>
        <span class="stat">{{ lineCount }} lines</span>
      </div>
    </div>

    <textarea
      ref="textareaRef"
      class="textarea"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="handleInput"
      @keydown.tab.prevent="handleTab"
      @focus="focused = true"
      @blur="focused = false"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start typing your markdown here...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const focused = ref(false)

const lineCount = computed(() => {
  return props.modelValue.split('\n').length
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleTab = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const newValue = props.modelValue.substring(0, start) + '  ' + props.modelValue.substring(end)
  emit('update:modelValue', newValue)

  // Set cursor position after the inserted spaces
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2
  }, 0)
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  overflow: hidden;
}

.editor-container.focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--secondary-bg);
  flex-shrink: 0;
}

.title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.stat {
  color: var(--text-secondary);
}

.textarea {
  flex: 1;
  padding: 16px;
  border: none;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  overflow: auto;
}

.textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.textarea:focus {
  outline: none;
}

/* Scrollbar styling */
.textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.textarea::-webkit-scrollbar-track {
  background: transparent;
}

.textarea::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.textarea::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Responsive design */
@media (max-width: 768px) {
  .editor-container {
    border-radius: 0;
  }

  .header {
    padding: 8px 12px;
  }

  .title {
    font-size: 14px;
  }

  .textarea {
    padding: 12px;
    font-size: 16px;
  }
}
</style>
