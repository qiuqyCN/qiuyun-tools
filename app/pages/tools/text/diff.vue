<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">文本对比</h3>
      <span class="text-xs text-slate-400">逐行/逐词对比两段文本差异</span>
    </div>

    <!-- 两个输入 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">原始文本 A</span>
          <span class="text-[11px] text-red-400">A 有 B 无 = 删除</span>
        </div>
        <textarea
          v-model="textA"
          placeholder="粘贴或输入第一段文本..."
          class="w-full h-52 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">原始文本 B</span>
          <span class="text-[11px] text-green-500">B 有 A 无 = 新增</span>
        </div>
        <textarea
          v-model="textB"
          placeholder="粘贴或输入第二段文本..."
          class="w-full h-52 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
    </div>

    <!-- 输出 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-slate-500">对比结果</span>
        <label class="flex items-center gap-1 text-xs text-slate-500">
          <input v-model="wordDiff" type="checkbox" class="rounded" />按单词粒度
        </label>
      </div>
      <div v-if="diffHtml" class="p-4 bg-slate-50 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[400px] border border-slate-100" v-html="diffHtml" />
      <div
        v-else
        class="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2"
      >
        <component :is="icons.FileDiff" class="w-8 h-8 text-slate-300" />
        <span>在上方粘贴文本，差异将实时显示</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
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
