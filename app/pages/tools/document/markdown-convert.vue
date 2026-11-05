<template>
  <div class="space-y-5">
    <!-- Markdown Convert -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">Markdown 格式转换</h3>
        <span class="text-xs text-slate-400">Markdown 语法转 HTML 或纯文本</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-slate-500">Markdown 输入</span>
              <div class="flex items-center gap-1 ml-3">
                <button v-for="m in modes" :key="m.value" @click="mode = m.value" class="px-2.5 py-1 text-xs rounded-md transition" :class="mode === m.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">{{ m.label }}</button>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="input = exampleMd" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
              <button @click="input = ''" class="text-xs text-slate-400 hover:text-slate-600">清空</button>
            </div>
          </div>
          <textarea
            v-model="input"
            placeholder="# Hello\n\n输入 Markdown..."
            class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            实时转换
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">
              {{ mode === 'html' ? 'HTML 输出' : '纯文本输出' }}
            </span>
            <CopyButton :text="output" label="复制" />
          </div>
          <div v-if="input" class="h-[440px] overflow-auto rounded-lg bg-slate-50 border border-slate-100">
            <div v-if="mode === 'html'" class="prose max-w-none p-3" v-html="outputHtml" />
            <pre v-else class="p-3 text-xs font-mono text-slate-700 whitespace-pre-wrap">{{ output }}</pre>
          </div>
          <div
            v-else
            class="p-3 rounded-lg h-[440px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileText" class="w-6 h-6 text-slate-300" />
            <span>在左侧粘贴 Markdown，点击转换</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import * as icons from 'lucide-vue-next'

const modes = [
  { value: 'html', label: '→ HTML' },
  { value: 'text', label: '→ 纯文本' },
]
const mode = ref<'html' | 'text'>('html')
const input = ref('# Hello\n\n这是 **加粗** 文本')

const exampleMd = `# 标题

## 二级标题

这是一段包含 **粗体** 和 *斜体* 的文本。

- 列表项 1
- 列表项 2
- 列表项 3

> 这是一段引用文字

\`\`\`js
console.log('Hello World')
\`\`\`

[链接示例](https://example.com)`

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
