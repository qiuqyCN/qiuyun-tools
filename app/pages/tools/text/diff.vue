<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">原始文本 A</h3>
      <textarea
        v-model="textA"
        placeholder="粘贴或输入第一段文本..."
        class="w-full h-52 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">原始文本 B</h3>
      <textarea
        v-model="textB"
        placeholder="粘贴或输入第二段文本..."
        class="w-full h-52 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
  </div>

  <section class="bg-white rounded-xl border border-slate-200 p-5 mt-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-slate-700">对比结果</h3>
      <div class="flex items-center gap-3 text-xs">
        <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-100 border border-red-200"></span>A 有 B 无</span>
        <span class="inline-flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-100 border border-green-200"></span>B 有 A 无</span>
        <label class="flex items-center gap-1"><input v-model="wordDiff" type="checkbox" class="rounded" />按单词粒度</label>
      </div>
    </div>
    <div v-if="diffHtml" class="p-4 bg-slate-50 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[400px]" v-html="diffHtml" />
    <div v-else class="py-12 text-center text-slate-400">等待输入文本...</div>
  </section>
</template>

<script setup lang="ts">
import { diffLines, diffWords } from 'diff'

const textA = ref('')
const textB = ref('')
const wordDiff = ref(false)

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const diffHtml = computed(() => {
  if (!textA.value && !textB.value) return ''
  const fn = wordDiff.value ? diffWords : diffLines
  const changes = fn(textA.value, textB.value)
  return changes
    .map(part => {
      const text = escapeHtml(part.value)
      if (part.added) return `<span class="bg-green-100 text-green-800">${text}</span>`
      if (part.removed) return `<span class="bg-red-100 text-red-800 line-through">${text}</span>`
      return `<span>${text}</span>`
    })
    .join('')
})
</script>
