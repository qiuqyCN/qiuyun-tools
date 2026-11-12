<template>
  <div class="space-y-5">
    <!-- Markdown Convert -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-slate-500">{{ $t('ui.document.markdown-convert.inputLabel') }}</span>
              <div class="flex items-center gap-1 ml-3">
                <button v-for="m in modes" :key="m.value" @click="mode = m.value" class="px-2.5 py-1 text-xs rounded-md transition" :class="mode === m.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">{{ m.label }}</button>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="input = exampleMd" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="input = ''" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <textarea
            v-model="input"
            :placeholder="$t('ui.document.markdown-convert.placeholder')"
            class="w-full h-[440px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.document.markdown-convert.btnConvert') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">
              {{ mode === 'html' ? $t('ui.document.markdown-convert.outputHtmlLabel') : $t('ui.document.markdown-convert.outputTextLabel') }}
            </span>
            <CopyButton :text="output" :label="$t('common.copy')" />
          </div>
          <div v-if="input" class="h-[440px] overflow-auto rounded-lg bg-slate-50 border border-slate-100">
            <div v-if="mode === 'html'" class="prose max-w-none p-3" v-html="previewHtml" />
            <pre v-else class="p-3 text-xs font-mono text-slate-700 whitespace-pre-wrap">{{ output }}</pre>
          </div>
          <div
            v-else
            class="p-3 rounded-lg h-[440px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileText" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.document.markdown-convert.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const modes = [
  { value: 'html', label: '→ HTML' },
  { value: 'text', label: t('ui.document.markdown-convert.modeText') },
]
const mode = ref<'html' | 'text'>('html')
const input = ref(t('ui.document.markdown-convert.defaultInput'))

const exampleMd = t('ui.document.markdown-convert.exampleContent')

const outputHtml = computed(() => marked.parse(input.value) as string)

// 预览专用：h1 降级为 h2，避免与页面主标题重复；outputHtml 保持原始输出，不影响复制/导出
const previewHtml = computed(() =>
  outputHtml.value.replace(/<h1[^>]*>/g, '<h2>').replace(/<\/h1>/g, '</h2>'),
)

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
