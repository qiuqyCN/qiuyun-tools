<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

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
          <span class="text-sm text-slate-500">{{ $t('ui.document.pdf-split.uploadHint') }}</span>
        </template>
        <div v-else class="w-full h-full flex items-center gap-4 px-5">
          <component :is="icons.FileText" class="w-10 h-10 text-indigo-400 shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-slate-700 truncate">{{ file.name }}</div>
            <div class="text-xs text-slate-400 mt-0.5">
              {{ fmtSize(file.size) }} · {{ $t('ui.document.pdf-split.totalPagesLabel') }}
              <span v-if="pages === null" class="text-slate-300">{{ $t('common.loading') }}</span>
              <span v-else class="font-semibold text-indigo-600">{{ pages }}</span>
              {{ $t('ui.document.pdf-split.pageUnit') }}
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
          {{ $t('ui.document.pdf-split.splitModeLabel') }}
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
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.document.pdf-split.pageRangeLabel') }}</label>
          <input
            v-model="range"
            :placeholder="$t('ui.document.pdf-split.pageRangePlaceholder', { max: pages })"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <div class="mt-1 text-xs text-slate-400">{{ $t('ui.document.pdf-split.pageRangeHint') }}</div>
          <div class="mt-2">
            <div class="text-[11px] text-slate-400 mb-1.5">{{ $t('ui.document.pdf-split.quickPresetLabel') }}</div>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="p in rangePresets" :key="p.key" @click="applyRangePreset(p)" class="px-2.5 py-1 text-[11px] rounded-md border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition">
                {{ $t(p.labelKey, p.interp) }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="mode === 'every'">
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.document.pdf-split.everyNLabel') }}</label>
          <div class="flex items-center gap-3">
            <input v-model.number="everyN" type="number" min="1" :max="pages" class="w-24 h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono" />
            <span class="text-xs text-slate-500">
              {{ $t('ui.document.pdf-split.everyUnit') }} · {{ $t('ui.document.pdf-split.everyEstimate') }}
              <span class="font-mono font-semibold text-indigo-600">{{ Math.ceil(pages / everyN) }}</span>
              {{ $t('ui.document.pdf-split.filesUnit') }}
            </span>
          </div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <button
              v-for="p in everyPresets"
              :key="p.n"
              @click="everyN = p.n"
              class="px-2.5 py-1 text-[11px] rounded-md border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition"
            >{{ $t(p.labelKey) }}</button>
          </div>
        </div>

        <div v-if="mode === 'extract'">
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.document.pdf-split.extractLabel') }}</label>
          <input
            v-model="extract"
            :placeholder="$t('ui.document.pdf-split.extractPlaceholder')"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <div class="mt-1 text-xs text-slate-400">{{ $t('ui.document.pdf-split.extractHint') }}</div>
        </div>

        <!-- Progress -->
        <div v-if="loading" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span class="flex items-center gap-1"><component :is="icons.Loader2" class="w-3.5 h-3.5 animate-spin" />{{ $t('ui.document.pdf-split.splittingLabel') }}</span>
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
          {{ loading ? $t('ui.document.pdf-split.btnSplitting', { progress }) : $t('ui.document.pdf-split.btnSplit') }}
        </button>

        <!-- Results -->
        <div v-if="results.length" class="pt-4 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <component :is="icons.CheckCircle" class="w-3.5 h-3.5 text-green-500" />
            {{ $t('ui.document.pdf-split.resultsLabel', { count: results.length }) }}
          </div>
          <div class="space-y-2">
            <div v-for="(r, i) in results" :key="i" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-sm group border border-slate-100">
              <component :is="icons.FileText" class="w-4 h-4 text-indigo-400 shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="text-slate-700 truncate">{{ r.name }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ r.pageCount }} {{ $t('ui.document.pdf-split.pageUnit') }} · {{ fmtSize(r.size) }}</div>
              </div>
              <button
                @click="download(r)"
                class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1 transition shrink-0"
              >
                <component :is="icons.Download" class="w-3.5 h-3.5" />
                {{ $t('ui.document.pdf-split.btnDownload') }}
              </button>
            </div>
          </div>
          <button
            v-if="results.length > 1"
            @click="downloadAll"
            class="w-full h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Download" class="w-4 h-4" />
            {{ $t('ui.document.pdf-split.btnDownloadAll') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'

const { t } = useI18n()

const fileRef = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const pages = ref<number | null>(null)
const dragOver = ref(false)

const modes = [
  { value: 'range', label: t('ui.document.pdf-split.modeRange') },
  { value: 'every', label: t('ui.document.pdf-split.modeEvery') },
  { value: 'extract', label: t('ui.document.pdf-split.modeExtract') },
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

const rangePresets = computed(() => {
  const total = pages.value
  if (!total || total < 3) return []
  const mid = Math.ceil(total / 2)
  const oneThird = Math.ceil(total / 3)
  const twoThirds = Math.ceil((total * 2) / 3)
  const oneFourth = Math.ceil(total / 4)
  const twoFourths = Math.ceil(total / 2)
  const threeFourths = Math.ceil((total * 3) / 4)
  const mk = (gen: () => string) => gen()
  return [
    { key: 'half', labelKey: 'ui.document.pdf-split.quickHalf', interp: {}, gen: mk(() => `1-${mid}, ${mid + 1}-${total}`) },
    { key: 'thirds', labelKey: 'ui.document.pdf-split.quickThirds', interp: {}, gen: mk(() => `1-${oneThird}, ${oneThird + 1}-${twoThirds}, ${twoThirds + 1}-${total}`) },
    {
      key: 'fourths', labelKey: 'ui.document.pdf-split.quickFourths', interp: {},
      gen: mk(() => `1-${oneFourth}, ${oneFourth + 1}-${twoFourths}, ${twoFourths + 1}-${threeFourths}, ${threeFourths + 1}-${total}`),
    },
  ]
})

function applyRangePreset(p: { gen: string }) {
  mode.value = 'range'
  range.value = p.gen
}

const everyPresets = computed(() => {
  const total = pages.value
  const all: { n: number; labelKey: string }[] = [
    { n: 5, labelKey: 'ui.document.pdf-split.quickEvery5' },
    { n: 10, labelKey: 'ui.document.pdf-split.quickEvery10' },
    { n: 20, labelKey: 'ui.document.pdf-split.quickEvery20' },
  ]
  return all.filter(p => !total || p.n < total)
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
    alert(`${t('ui.document.pdf-split.errLoadFailed')}: ${e?.message}`)
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
    alert(`${t('ui.document.pdf-split.errSplitFailed')}: ${e?.message}`)
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
