<template>
  <button
    :class="['button', variant, size, className]"
    @click="handleClick"
    :disabled="disabled"
    :type="type"
    ref="buttonRef"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = defineProps<ButtonProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonRef = ref<HTMLButtonElement | null>(null);

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

// Expose ref for parent components
defineExpose({
  buttonRef,
});
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 6px;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.025em;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  text-decoration: none;
  outline: none;
}

.button:focus-visible {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

.button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Size Variants */
.default {
  height: 40px;
  padding: 0 16px;
}

.sm {
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
}

.lg {
  height: 44px;
  padding: 0 20px;
  font-size: 16px;
}

/* Style Variants */
.button.default {
  background-color: #007acc;
  color: white;
}

.button.default:hover {
  background-color: #005a9e;
}

.button.ghost {
  background-color: transparent;
  color: #333;
}

.button.ghost:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button.outline {
  background-color: transparent;
  color: #007acc;
  border: 1px solid #03395e;
  padding: 10px;
}

.button.outline:hover {
  background-color: #007acc;
  color: white;
}

.button.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.button.secondary:hover {
  background-color: #e5e7eb;
}

.button.destructive {
  background-color: #dc2626;
  color: white;
}

.button.destructive:hover {
  background-color: #b91c1c;
}

/* Dark mode variants */
[data-theme='dark'] .button.ghost {
  color: #f3f4f6;
}

[data-theme='dark'] .button.ghost:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .button.outline {
  color: #60a5fa;
  border-color: #60a5fa;
}

[data-theme='dark'] .button.outline:hover {
  background-color: #60a5fa;
  color: #1f2937;
}

[data-theme='dark'] .button.secondary {
  background-color: #374151;
  color: #f3f4f6;
}

[data-theme='dark'] .button.secondary:hover {
  background-color: #4b5563;
}

/* Add missing variants if needed */
.button.link {
  background-color: transparent;
  color: #007acc;
  text-decoration: underline;
  padding: 0;
  height: auto;
}

.button.link:hover {
  color: #005a9e;
  text-decoration: none;
}

/* For icon size */
.icon {
  width: 40px;
  height: 40px;
  padding: 0;
  justify-content: center;
}
</style>