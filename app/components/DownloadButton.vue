<template>
  <button
    @click="download"
    :disabled="disabled"
    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    <component :is="icons.Download" class="w-3.5 h-3.5" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    content: string | Blob
    filename: string
    mime?: string
    label?: string
    disabled?: boolean
  }>(),
  { label: '下载', mime: 'text/plain', disabled: false },
)

function download() {
  const blob =
    typeof props.content === 'string'
      ? new Blob([props.content], { type: props.mime })
      : props.content
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
