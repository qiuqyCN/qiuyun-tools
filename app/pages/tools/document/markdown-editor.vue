<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex h-[calc(100vh-180px)] gap-4">
      <div class="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col">
        <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-100">
          <component :is="icons.Edit3" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.document.markdown-editor.editorLabel') }}</span>
          <div class="ml-auto flex items-center gap-1">
            <button v-for="b in toolbar" :key="b.label" @click="insert(b.cmd)" class="px-2 py-1 rounded hover:bg-slate-100 font-mono text-xs text-slate-600 transition">{{ b.label }}</button>
          </div>
        </div>
        <textarea
          v-model="md"
          ref="editorRef"
          @keydown.tab.prevent="handleTab"
          :placeholder="$t('ui.document.markdown-editor.placeholder')"
          class="flex-1 w-full p-4 text-sm font-mono resize-none focus:outline-none"
        />
      </div>
      <div class="flex-1 bg-white rounded-xl border border-slate-200 p-5 overflow-auto">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.document.markdown-editor.previewLabel') }}</span>
        </div>
        <div class="prose max-w-none" v-html="html" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { marked } from 'marked'

const { t } = useI18n()

const md = ref(t('ui.document.markdown-editor.defaultContent'))
const editorRef = ref<HTMLTextAreaElement | null>(null)

marked.setOptions({ breaks: true, gfm: true })
// 预览区 h1 降级为 h2，避免与 ToolLayout 输出的页面主标题重复
const html = computed(() =>
  (marked.parse(md.value) as string).replace(/<h1[^>]*>/g, '<h2>').replace(/<\/h1>/g, '</h2>'),
)

const toolbar = [
  { label: 'B', cmd: 'bold' },
  { label: 'I', cmd: 'italic' },
  { label: 'H', cmd: 'heading' },
  { label: 'link', cmd: 'link' },
  { label: 'list', cmd: 'list' },
  { label: 'code', cmd: 'code' },
]

function insert(cmd: string) {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart, end = el.selectionEnd
  const text = md.value
  const sel = text.substring(start, end)
  const templates: Record<string, [string, string, number]> = {
    bold: ['**', '**', 2],
    italic: ['*', '*', 1],
    heading: ['\n## ', '\n', 4],
    link: ['[', '](url)', 1],
    list: ['\n- ', '\n', 3],
    code: ['\n```\n', '\n```\n', 4],
  }
  const [pre, post, move] = templates[cmd] || ['', '', 0]
  md.value = text.substring(0, start) + pre + sel + post + text.substring(end)
  nextTick(() => { el.focus(); el.selectionStart = start + move; el.selectionEnd = start + move + sel.length })
}

function handleTab() {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart, end = el.selectionEnd
  md.value = md.value.substring(0, start) + '  ' + md.value.substring(end)
  nextTick(() => { el.selectionStart = el.selectionEnd = start + 2 })
}
</script>

<style>
.prose h1 { font-size: 1.875rem; font-weight: 700; margin: 0.75rem 0; }
.prose h2 { font-size: 1.5rem; font-weight: 600; margin: 0.625rem 0; }
.prose h3 { font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0; }
.prose p { margin: 0.5rem 0; line-height: 1.7; }
.prose ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
.prose ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
.prose blockquote { border-left: 3px solid #c7d2fe; padding-left: 0.75rem; color: #64748b; margin: 0.5rem 0; }
.prose code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 0.875rem; }
.prose pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
.prose pre code { background: transparent; padding: 0; color: inherit; }
.prose a { color: #4f46e5; text-decoration: underline; }
.prose table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
.prose th, .prose td { border: 1px solid #e2e8f0; padding: 0.375rem 0.75rem; }
.prose img { max-width: 100%; border-radius: 8px; }
</style>
