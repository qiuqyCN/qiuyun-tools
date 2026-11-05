<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">PDF 拆分</h3>
      <span class="text-xs text-slate-400">按页码范围、间隔或提取指定页面拆分 PDF</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200 max-w-2xl mx-auto space-y-4">
      <!-- Upload -->
      <div
        @click="$refs.fileRef.click()"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        class="relative flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition"
        :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
      >
        <template v-if="!file">
          <component :is="icons.FileUp" class="w-8 h-8 text-slate-300 mb-2" />
          <span class="text-sm text-slate-500">点击或拖拽一个 PDF 文件</span>
        </template>
        <div v-else class="w-full h-full flex items-center gap-4 px-5">
          <component :is="icons.FileText" class="w-10 h-10 text-indigo-400 shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-slate-700 truncate">{{ file.name }}</div>
            <div class="text-xs text-slate-400 mt-0.5">
              {{ fmtSize(file.size) }} · 共
              <span v-if="pages === null" class="text-slate-300">加载中...</span>
              <span v-else class="font-semibold text-indigo-600">{{ pages }}</span>
              页
            </div>
          </div>
          <button @click.stop="clearFile" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition">
            <component :is="icons.X" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <input ref="fileRef" type="file" accept="application/pdf" class="hidden" @change="onSelect" />

      <!-- Config -->
      <div v-if="file && pages !== null" class="pt-3 border-t border-slate-100 space-y-4">
        <div class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          <component :is="icons.Settings2" class="w-3.5 h-3.5" />
          拆分方式
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="m in modes"
            :key="m.value"
            @click="mode = m.value"
            class="px-3 py-1.5 text-xs rounded-lg border transition"
            :class="mode === m.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-indigo-300'"
          >{{ m.label }}</button>
        </div>

        <div v-if="mode === 'range'">
          <label class="block text-xs text-slate-500 mb-1">页码范围（从 1 开始）</label>
          <input
            v-model="range"
            :placeholder="`例: 1-3, 5, 7-${pages}`"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <div class="mt-1 text-xs text-slate-400">逗号分隔多个范围，每个范围生成一个 PDF</div>
        </div>

        <div v-if="mode === 'every'">
          <label class="block text-xs text-slate-500 mb-1">每 N 页拆分一个文件</label>
          <div class="flex items-center gap-3">
            <input v-model.number="everyN" type="number" min="1" :max="pages" class="w-24 h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono" />
            <span class="text-xs text-slate-500">
              页 / 文件 · 预计生成
              <span class="font-mono font-semibold text-indigo-600">{{ Math.ceil(pages / everyN) }}</span>
              个文件
            </span>
          </div>
        </div>

        <div v-if="mode === 'extract'">
          <label class="block text-xs text-slate-500 mb-1">提取指定页面</label>
          <input
            v-model="extract"
            :placeholder="`例: 1, 3, 5-8`"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <div class="mt-1 text-xs text-slate-400">将这些页面合并为一个新 PDF</div>
        </div>

        <!-- Progress -->
        <div v-if="loading" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span class="flex items-center gap-1"><component :is="icons.Loader2" class="w-3.5 h-3.5 animate-spin" />正在拆分...</span>
            <span class="font-mono">{{ progress }}%</span>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full transition-all duration-200" :style="{ width: progress + '%' }" />
          </div>
        </div>

        <button
          @click="doSplit"
          :disabled="loading || !canSplit"
          class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <component :is="icons.Scissors" class="w-4 h-4" />
          {{ loading ? `拆分中 ${progress}%...` : '开始拆分' }}
        </button>

        <!-- Results -->
        <div v-if="results.length" class="pt-4 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <component :is="icons.CheckCircle" class="w-3.5 h-3.5 text-green-500" />
            拆分结果（{{ results.length }} 个文件）
          </div>
          <div class="space-y-2">
            <div v-for="(r, i) in results" :key="i" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-sm group border border-slate-100">
              <component :is="icons.FileText" class="w-4 h-4 text-indigo-400 shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="text-slate-700 truncate">{{ r.name }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ r.pageCount }} 页 · {{ fmtSize(r.size) }}</div>
              </div>
              <button
                @click="download(r)"
                class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1 transition shrink-0"
              >
                <component :is="icons.Download" class="w-3.5 h-3.5" />
                下载
              </button>
            </div>
          </div>
          <button
            v-if="results.length > 1"
            @click="downloadAll"
            class="w-full h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Download" class="w-4 h-4" />
            下载全部（逐个保存）
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'

const fileRef = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const pages = ref<number | null>(null)
const dragOver = ref(false)

const modes = [
  { value: 'range', label: '按范围拆分' },
  { value: 'every', label: '每 N 页拆分' },
  { value: 'extract', label: '提取指定页面' },
]
const mode = ref<'range' | 'every' | 'extract'>('range')
const range = ref('')
const everyN = ref(5)
const extract = ref('')

const loading = ref(false)
const progress = ref(0)

interface ResultItem {
  name: string
  blob: Blob
  url: string
  pageCount: number
  size: number
}
const results = ref<ResultItem[]>([])

function fmtSize(b: number) {
  return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(2) + ' MB'
}

function parseRange(str: string, max: number): number[] {
  const set = new Set<number>()
  for (const part of str.split(',').map(s => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/)
    if (m) {
      const a = Math.max(1, parseInt(m[1], 10))
      const b = Math.min(max, parseInt(m[2], 10))
      for (let i = a; i <= b; i++) set.add(i)
    } else {
      const n = parseInt(part, 10)
      if (!isNaN(n) && n >= 1 && n <= max) set.add(n)
    }
  }
  return [...set].sort((a, b) => a - b)
}

const canSplit = computed(() => {
  if (!file.value || pages.value === null) return false
  if (mode.value === 'range') return parseRange(range.value, pages.value).length > 0
  if (mode.value === 'every') return everyN.value >= 1 && everyN.value < pages.value
  if (mode.value === 'extract') {
    const ps = parseRange(extract.value, pages.value)
    return ps.length > 0 && ps.length < pages.value
  }
  return false
})

function clearFile() {
  file.value = null
  pages.value = null
  results.value.forEach(r => URL.revokeObjectURL(r.url))
  results.value = []
  range.value = ''
  extract.value = ''
  progress.value = 0
}

async function loadFile(f: File) {
  clearFile()
  file.value = f
  const buf = await f.arrayBuffer()
  try {
    const pdf = await PDFDocument.load(buf)
    pages.value = pdf.getPageCount()
    range.value = `1-${pages.value}`
  } catch (e: any) {
    alert('PDF 加载失败: ' + e?.message)
    clearFile()
  }
}

function onSelect(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f && f.type === 'application/pdf') loadFile(f)
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f && f.type === 'application/pdf') loadFile(f)
}

async function doSplit() {
  if (!file.value || pages.value === null || !canSplit.value) return
  loading.value = true
  progress.value = 0
  results.value.forEach(r => URL.revokeObjectURL(r.url))
  results.value = []

  try {
    const buf = await file.value.arrayBuffer()
    const pdf = await PDFDocument.load(buf)
    const total = pages.value
    const baseName = file.value.name.replace(/\.pdf$/i, '')

    let groups: number[][] = []

    if (mode.value === 'range') {
      for (const part of range.value.split(',').map(s => s.trim()).filter(Boolean)) {
        const pages1 = parseRange(part, total)
        if (pages1.length > 0) groups.push(pages1.map(p => p - 1))
      }
    } else if (mode.value === 'every') {
      const n = everyN.value
      for (let i = 0; i < total; i += n) {
        const g: number[] = []
        for (let j = i; j < Math.min(i + n, total); j++) g.push(j)
        if (g.length > 0) groups.push(g)
      }
    } else if (mode.value === 'extract') {
      const pages1 = parseRange(extract.value, total)
      groups = [pages1.map(p => p - 1)]
    }

    for (let gi = 0; gi < groups.length; gi++) {
      const indices = groups[gi]
      if (indices.length === 0) continue
      const newPdf = await PDFDocument.create()
      const copied = await newPdf.copyPages(pdf, indices)
      copied.forEach(p => newPdf.addPage(p))
      const bytes = await newPdf.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      let name: string
      if (mode.value === 'range') name = `${baseName}_part${gi + 1}.pdf`
      else if (mode.value === 'every') {
        const sp = indices[0] + 1
        const ep = indices[indices.length - 1] + 1
        name = `${baseName}_p${sp}-${ep}.pdf`
      } else name = `${baseName}_pages_${indices.map(i => i + 1).join(',')}.pdf`

      results.value.push({ name, blob, url, pageCount: indices.length, size: blob.size })
      progress.value = Math.round(((gi + 1) / groups.length) * 100)
    }
  } catch (e: any) {
    alert('拆分失败: ' + e?.message)
  } finally {
    loading.value = false
  }
}

function download(r: ResultItem) {
  const a = document.createElement('a')
  a.href = r.url
  a.download = r.name
  a.click()
}

function downloadAll() {
  results.value.forEach((r, i) => setTimeout(() => download(r), i * 200))
}
</script>
