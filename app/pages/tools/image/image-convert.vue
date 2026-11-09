<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.image.image-convert.title') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.image.image-convert.subtitle') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Upload" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-convert.uploadLabel') }}</span>
        </div>
        <!-- Upload zone -->
        <div
          class="relative mb-4"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="onDrop"
        >
          <label
            v-if="!src"
            class="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition"
            :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
          >
            <input type="file" accept="image/*" class="hidden" @change="onFile" />
            <component :is="icons.ImageUp" class="w-8 h-8 text-slate-300 mb-2" />
            <span class="text-sm text-slate-500">{{ $t('ui.image.image-convert.uploadHint') }}</span>
          </label>
          <div v-else class="relative group rounded-lg overflow-hidden border border-slate-200">
            <img :src="src" class="w-full h-40 object-contain bg-slate-50" />
            <button
              @click.stop="clearFile"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
            >
              <component :is="icons.X" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-if="src">
          <div class="text-xs font-medium text-slate-500 mb-2">{{ $t('ui.image.image-convert.targetFormatLabel') }}</div>
          <div class="flex gap-2">
            <button
              v-for="f in formats"
              :key="f.value"
              @click="target = f.value"
              class="px-3 py-1.5 text-xs rounded-lg border transition"
              :class="target === f.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-indigo-300'"
            >{{ f.label }}</button>
          </div>
          <div class="mt-3">
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.image-convert.qualityLabel', { n: quality }) }}</label>
            <input v-model.number="quality" type="range" min="10" max="100" class="w-full" />
          </div>
          <button
            @click="convert"
            class="w-full mt-3 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.image.image-convert.btnConvert') }}
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-convert.resultTitle') }}</span>
        </div>
        <div v-if="src && !result" class="text-center">
          <img :src="src" class="max-w-full max-h-64 rounded-lg border border-slate-200 mx-auto bg-slate-50" />
          <div class="text-xs text-slate-400 mt-2">{{ $t('ui.image.image-convert.originalPreview') }}</div>
        </div>
        <div v-if="result" class="text-center">
          <img :src="result.url" class="max-w-full max-h-80 rounded-lg border border-indigo-200 bg-indigo-50 mx-auto shadow-sm" />
          <div class="mt-3 flex justify-center gap-3 items-center">
            <span class="text-xs text-indigo-600 font-mono">{{ fmtSize(result.size) }}</span>
            <button
              @click="download"
              class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1 transition"
            >
              <component :is="icons.Download" class="w-3.5 h-3.5" />
              {{ $t('ui.image.image-convert.btnDownload') }}
            </button>
          </div>
        </div>
        <div v-if="!result && !src" class="h-60 flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50 rounded-lg border border-slate-100">
          <component :is="icons.Image" class="w-8 h-8 text-slate-300" />
          {{ $t('ui.image.image-convert.emptyHint') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const formats = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/gif', label: 'GIF' },
]

const src = ref('')
const target = ref('image/png')
const quality = ref(90)
const result = ref<{ url: string; size: number; blob: Blob } | null>(null)
const dragOver = ref(false)

function fmtSize(b: number) {
  return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(2) + ' MB'
}

function clearFile() {
  if (src.value.startsWith('blob:')) URL.revokeObjectURL(src.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
  src.value = ''
  result.value = null
}

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return
  src.value = URL.createObjectURL(file)
  result.value = null
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

async function convert() {
  if (!src.value) return
  const img = new Image()
  await new Promise(res => { img.onload = res; img.src = src.value })
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  // JPG 不透明，先填白
  if (target.value === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)
  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b as Blob), target.value, quality.value / 100))
  if (result.value) URL.revokeObjectURL(result.value.url)
  result.value = { url: URL.createObjectURL(blob), size: blob.size, blob }
}

function download() {
  if (!result.value) return
  const a = document.createElement('a')
  a.href = result.value.url // 复用已有 URL，不再 createObjectURL
  const ext = target.value.split('/')[1]
  a.download = 'converted.' + ext
  a.click()
}
</script>
