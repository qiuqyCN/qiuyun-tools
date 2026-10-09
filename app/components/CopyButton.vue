<template>
  <button
    @click="copy"
    :disabled="disabled"
    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    <component :is="copied ? icons.Check : icons.Copy" class="w-3.5 h-3.5" />
    {{ copied ? '已复制' : label }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as icons from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    disabled?: boolean
  }>(),
  { label: '复制', disabled: false },
)

const copied = ref(false)

async function copy() {
  if (!props.text) return
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = props.text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
}
</script>
