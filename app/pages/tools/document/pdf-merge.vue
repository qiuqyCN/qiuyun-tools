<template>
  <div class="max-w-2xl mx-auto">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">PDF 合并（前端基础版）</h3>
      <div
        @click="$refs.fileRef.click()"
        @dragover.prevent
        @drop.prevent="onDrop"
        class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition"
      >
        <component :is="icons.Upload" class="w-8 h-8 text-slate-300 mb-2" />
        <span class="text-sm text-slate-500">点击或拖拽 PDF 文件到此处（支持多选）</span>
      </div>
      <input ref="fileRef" type="file" accept="application/pdf" multiple class="hidden" @change="onSelect" />
      <div v-if="files.length" class="mt-4 space-y-2">
        <div v-for="(f, i) in files" :key="i" class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-sm">
          <span class="w-5 text-slate-400 font-mono">{{ i + 1 }}</span>
          <span class="flex-1 truncate text-slate-700">{{ f.name }}</span>
          <span class="text-xs text-slate-400">{{ fmtSize(f.size) }}</span>
          <button v-if="i > 0" @click="moveUp(i)" class="text-xs text-slate-400 hover:text-indigo-600">↑</button>
          <button v-if="i < files.length - 1" @click="moveDown(i)" class="text-xs text-slate-400 hover:text-indigo-600">↓</button>
          <button @click="files.splice(i, 1)" class="text-xs text-red-400 hover:text-red-600">删除</button>
        </div>
      </div>
      <div class="mt-4 text-xs text-slate-500">
        ⚠️ 大文件合并可能消耗较多内存，建议不超过 10 个文件 / 共 20MB 以内
      </div>
      <button
        @click="merge"
        :disabled="files.length < 2 || loading"
        class="w-full mt-4 h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >{{ loading ? '合并中...' : `合并 ${files.length} 个 PDF` }}</button>
      <div v-if="resultUrl" class="mt-4 text-center">
        <button @click="download" class="h-9 px-6 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">下载合并后的 PDF</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { PDFDocument } from 'pdf-lib'

const fileRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const loading = ref(false)
const resultUrl = ref('')
let resultBlob: Blob | null = null

function fmtSize(b: number) {
  return (b / 1024 / 1024).toFixed(2) + ' MB'
}

function onSelect(e: Event) {
  const fs = (e.target as HTMLInputElement).files
  if (!fs) return
  files.value.push(...Array.from(fs))
}

function onDrop(e: DragEvent) {
  const fs = e.dataTransfer?.files
  if (!fs) return
  files.value.push(...Array.from(fs).filter(f => f.type === 'application/pdf'))
}

function moveUp(i: number) { [files.value[i - 1], files.value[i]] = [files.value[i], files.value[i - 1]] }
function moveDown(i: number) { [files.value[i + 1], files.value[i]] = [files.value[i], files.value[i + 1]] }

async function merge() {
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
    resultBlob = new Blob([bytes], { type: 'application/pdf' })
    resultUrl.value = URL.createObjectURL(resultBlob)
  } catch (e: any) {
    alert('合并失败: ' + e?.message)
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
