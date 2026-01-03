import { onUnmounted, ref, watch } from "vue";

interface UseThrottledAutosaveReturn {
  forceSave: () => void
}

// Alternative: Simplified version for ref values
export function useThrottledAutosave<T>(
  value: { value: T },
  saveFunction: (value: T) => void,
  options: { delay?: number; enabled?: boolean } = {}
): UseThrottledAutosaveReturn {
  const { delay = 2000, enabled = true } = options
  
  const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
  const lastSaved = ref<T>(value.value)
  const isFirstRun = ref(true)
  const saveFunctionRef = ref(saveFunction)

  watch(
    () => value.value,
    () => {
      if (isFirstRun.value) {
        isFirstRun.value = false
        lastSaved.value = value.value
        return
      }

      if (!enabled || typeof saveFunctionRef.value !== 'function') {
        return
      }

      // Clear existing timeout
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
      }

      // Set new timeout
      timeoutId.value = setTimeout(() => {
        // Only save if value has actually changed
        if (value.value !== lastSaved.value) {
          saveFunctionRef.value(value.value)
          lastSaved.value = value.value
        }
      }, delay)
    },
    { immediate: false }
  )

  // Update the ref when saveFunction changes
  watch(
    () => saveFunction,
    (newFn) => {
      saveFunctionRef.value = newFn
    },
    { immediate: true }
  )

  // Force save function
  const forceSave = () => {
    if (enabled && typeof saveFunctionRef.value === 'function') {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value)
        timeoutId.value = null
      }
      
      saveFunctionRef.value(value.value)
      lastSaved.value = value.value
    }
  }

  // Cleanup
  onUnmounted(() => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
  })

  return { forceSave }
}