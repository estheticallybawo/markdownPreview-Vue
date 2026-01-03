<template>
  <Transition name="slideIn">
    <div v-if="notification" :class="['notification', notification.type]">
      <component :is="iconComponent" :class="['notificationIcon']" />
      <span>{{ notification.message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, AlertCircle } from 'lucide-vue-next'

interface Notification {
  type: 'success' | 'error'
  message: string
}

interface Props {
  notification: Notification | null
}

const props = defineProps<Props>()

const iconComponent = computed(() => {
  const type = props.notification?.type || 'error'
  const icons: Record<'success' | 'error', typeof CheckCircle> = {
    success: CheckCircle,
    error: AlertCircle,
  }
  return icons[type]
})
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  z-index: 1001;
  max-width: 400px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.notification.success {
  background: #10b981;
  color: white;
}

.notification.error {
  background: #ef4444;
  color: white;
}

.notificationIcon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .notification {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
