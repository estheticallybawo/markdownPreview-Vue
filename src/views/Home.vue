<!-- src/views/Home.vue -->
<template>
  <div class="home">

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="view-controls">
        <button class="view-button" :class="{ active: viewMode === 'editor' }" @click="viewMode = 'editor'">
          Editor
        </button>
        <button class="view-button" :class="{ active: viewMode === 'split' }" @click="viewMode = 'split'">
          Split
        </button>
        <button class="view-button" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">
          Preview
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">

      <!-- Editor Panel -->
      <div v-if="viewMode === 'editor' || viewMode === 'split'" class="editor-panel">
       
        <Editor
          :model-value="markdown"
          @update:model-value="markdown = $event"
          placeholder="Type markdown here..."
        />
        
      </div>

      <!-- Preview Panel -->
        
     <div v-if="viewMode === 'preview' || viewMode === 'split'" class="preview-panel">
        <Preview :markdown="markdown" :debounce-delay="300" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Editor from '../components/Editor/Editor.vue'; 
import Preview from '../components/Preview/Preview.vue';

type ViewMode = 'editor' | 'split' | 'preview'

const viewMode = ref<ViewMode>('split')
const markdown = ref(`# Welcome to Markdown Editor

## This is a test
- Item 1
- Item 2
- Item 3

**Bold text** and *italic text*`)



</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color, #f5f5f5);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--secondary-bg, white);
  border-bottom: 1px solid var(--border-color, #ddd);
  gap: 16px;
  flex-wrap: wrap;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-button {
  padding: 8px 16px;
  border: 1px solid var(--border-color, #ddd);
  background-color: var(--button-bg, white);
  color: var(--text-color, #333);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

}

.view-button:hover {
  background-color: var(--button-hover-bg, #f0f0f0);
  border-color: var(--border-hover-color, #ccc);
}

.view-button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.file-operations {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  padding: 8px 16px;
  border: 1px solid var(--border-color, #ddd);
  background-color: var(--button-bg, white);
  color: var(--text-color, #333);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.action-button:hover:not(:disabled) {
  background-color: var(--button-hover-bg, #f0f0f0);
  border-color: var(--border-hover-color, #ccc);
}

.content-area {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
  min-height: 0;
}

.editor-panel,
.preview-panel {
  flex: 1;
  height: 100%;
  min-height: 0; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* View modes */
.content-area.editor .preview-panel {
  display: none;
}

.content-area.preview .editor-panel {
  display: none;
}

.content-area.split .editor-panel,
.content-area.split .preview-panel {
  display: flex;
  overflow: hidden;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .view-controls,
  .file-operations {
    width: 100%;
    justify-content: center;
  }

  .view-button,
  .action-button {
    flex: 1;
  }

  .content-area.split {
    flex-direction: column;
  }

  .split .editor-panel,
  .split .preview-panel {
    height: 50%;
    min-height: 200px;
  }
}
</style>