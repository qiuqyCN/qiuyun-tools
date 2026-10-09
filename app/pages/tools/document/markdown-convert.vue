<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center gap-2 mb-3">
        <button v-for="m in modes" :key="m.value" @click="mode = m.value" class="px-3 py-1.5 text-xs rounded-md transition" :class="mode === m.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">{{ m.label }}</button>
      </div>
      <textarea
        v-model="input"
        placeholder="# Hello\n\n输入 Markdown..."
        class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">输出</h3>
        <CopyButton :text="output" label="复制" />
      </div>
      <div v-if="mode === 'html'" class="prose max-w-none h-[440px] overflow-auto p-3 rounded-lg bg-slate-50" v-html="outputHtml" />
      <pre v-else class="w-full h-[440px] p-3 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-auto whitespace-pre-wrap">{{ output }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const modes = [
  { value: 'html', label: '→ HTML' },
  { value: 'text', label: '→ 纯文本' },
]
const mode = ref<'html' | 'text'>('html')
const input = ref('# Hello\n\n这是 **加粗** 文本')

const outputHtml = computed(() => marked.parse(input.value) as string)

const output = computed(() => {
  if (!input.value) return ''
  if (mode.value === 'html') return outputHtml.value
  // 纯文本：去 Markdown 语法
  return input.value
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .trim()
})
</script>
