import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const state = ref(initialValue)
  
  const toggle = () => {
    state.value = !state.value
  }
  
  const setTrue = () => {
    state.value = true
  }
  
  const setFalse = () => {
    state.value = false
  }
  
  return {
    state,
    toggle,
    setTrue,
    setFalse
  }
}