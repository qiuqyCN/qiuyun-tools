<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="bg-white rounded-xl p-4 border border-slate-200 max-w-2xl mx-auto">
      <!-- Upload -->
      <div
        @click="$refs.fileRef.click()"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        class="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition"
        :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
      >
        <component :is="icons.Upload" class="w-8 h-8 text-slate-300 mb-2" />
        <span class="text-sm text-slate-500">{{ $t('ui.document.pdf-merge.uploadHint') }}</span>
      </div>
      <input ref="fileRef" type="file" accept="application/pdf" multiple class="hidden" @change="onSelect" />

      <!-- File list -->
      <div v-if="files.length" class="mt-4 space-y-2">
        <div v-for="(f, i) in files" :key="i" class="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-sm group border border-slate-100">
          <span class="w-5 text-slate-400 font-mono text-center">{{ i + 1 }}</span>
          <span class="flex-1 truncate text-slate-700">{{ f.name }}</span>
          <span class="text-xs text-slate-400">{{ fmtSize(f.size) }}</span>
          <button v-if="i > 0" @click="moveUp(i)" class="opacity-40 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 w-6 h-6 flex items-center justify-center rounded hover:bg-white transition">
            <component :is="icons.ChevronUp" class="w-4 h-4" />
          </button>
          <button v-if="i < files.length - 1" @click="moveDown(i)" class="opacity-40 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 w-6 h-6 flex items-center justify-center rounded hover:bg-white transition">
            <component :is="icons.ChevronDown" class="w-4 h-4" />
          </button>
          <button @click="files.splice(i, 1)" class="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded hover:bg-white transition">
            <component :is="icons.X" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="mt-3 text-xs text-slate-500 flex items-start gap-1.5 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <component :is="icons.AlertCircle" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
        <span>{{ $t('ui.document.pdf-merge.warning') }}</span>
      </div>

      <button
        @click="doMerge"
        :disabled="files.length < 2 || loading"
        class="w-full mt-4 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        <component :is="icons.Merge" class="w-4 h-4" />
        {{ loading ? $t('ui.document.pdf-merge.btnMerging') : $t('ui.document.pdf-merge.btnMerge', { count: files.length }) }}
      </button>

      <div v-if="resultUrl" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between">
        <div class="flex items-center gap-2 text-green-700 text-sm">
          <component :is="icons.CheckCircle" class="w-4 h-4" />
          {{ $t('ui.document.pdf-merge.successMsg', { size: fmtSize(resultBlob!.size) }) }}
        </div>
        <button
          @click="download"
          class="h-9 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-medium shadow-sm flex items-center gap-1.5 transition"
        >
          <component :is="icons.Download" class="w-3.5 h-3.5" />
          {{ $t('ui.document.pdf-merge.btnDownload') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'

const { t } = useI18n()

const fileRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const loading = ref(false)
const resultUrl = ref('')
let resultBlob: Blob | null = null
const dragOver = ref(false)

function fmtSize(b: number) {
  return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(2) + ' MB'
}

function onSelect(e: Event) {
  const fs = (e.target as HTMLInputElement).files
  if (fs) files.value.push(...Array.from(fs))
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const fs = e.dataTransfer?.files
  if (fs) files.value.push(...Array.from(fs).filter(f => f.type === 'application/pdf'))
}

function moveUp(i: number) { [files.value[i - 1], files.value[i]] = [files.value[i], files.value[i - 1]] }
function moveDown(i: number) { [files.value[i + 1], files.value[i]] = [files.value[i], files.value[i + 1]] }

async function doMerge() {
  loading.value = true
  try {
    const merged = await PDFDocument.create()
    for (const f of files.value) {
      const buf = await f.arrayBuffer()
      const pdf = await PDFDocument.load(buf)
      const indices = pdf.getPageIndices()
      const copied = await merged.copyPages(pdf, indices)
      copied.forEach(p => merged.addPage(p))
    }
    const bytes = await merged.save()
    if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
    resultBlob = new Blob([bytes], { type: 'application/pdf' })
    resultUrl.value = URL.createObjectURL(resultBlob)
  } catch (e: any) {
    alert(`${t('ui.document.pdf-merge.errMergeFailed')}: ${e?.message}`)
  } finally {
    loading.value = false
  }
}

function download() {
  if (!resultBlob) return
  const a = document.createElement('a')
  a.href = resultUrl.value
  a.download = 'merged.pdf'
  a.click()
}
</script>
