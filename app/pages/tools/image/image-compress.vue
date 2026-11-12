<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Input -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Upload" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-compress.uploadLabel') }}</span>
        </div>
        <!-- Upload zone with preview -->
        <div
          class="relative"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="onDrop"
        >
          <label
            v-if="!original"
            class="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition"
            :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
          >
            <input type="file" accept="image/*" class="hidden" @change="onFile" />
            <component :is="icons.ImageUp" class="w-8 h-8 text-slate-300 mb-2" />
            <span class="text-sm text-slate-500">{{ $t('ui.image.image-compress.uploadHint') }}</span>
          </label>
          <div v-else class="relative group rounded-lg overflow-hidden border border-slate-200">
            <img :src="original.url" class="w-full max-h-48 object-contain bg-slate-50" />
            <button
              @click.stop="clearFile"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
            >
              <component :is="icons.X" class="w-4 h-4" />
            </button>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs text-white">
              {{ original.file.name }} · {{ fmtSize(original.size) }} · {{ original.width }}×{{ original.height }}
            </div>
          </div>
        </div>
        <div v-if="original" class="mt-4 space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.image-compress.qualityLabel', { n: quality }) }}</label>
            <input v-model.number="quality" type="range" min="10" max="100" class="w-full" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.image-compress.maxWidthLabel', { n: maxWidth }) }}</label>
            <input v-model.number="maxWidth" type="range" min="100" :max="original.width" class="w-full" />
          </div>
          <button
            @click="compress"
            class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Minimize2" class="w-4 h-4" />
            {{ $t('ui.image.image-compress.btnCompress') }}
          </button>
        </div>
      </div>

      <!-- Output -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-compress.resultTitle') }}</span>
        </div>
        <div v-if="compressed" class="text-center">
          <img :src="compressed.url" class="max-w-full max-h-80 rounded-lg border border-slate-200 mx-auto shadow-sm" />
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-center gap-4">
              <div>{{ $t('ui.image.image-compress.compressedLabel') }}<span class="font-mono font-semibold text-indigo-600">{{ fmtSize(compressed.size) }}</span></div>
              <div>{{ $t('ui.image.image-compress.reducedLabel') }}<span class="font-mono font-semibold" :class="savedPct < 50 ? 'text-green-600' : 'text-orange-600'">{{ savedPct }}%</span></div>
            </div>
            <div class="text-xs text-slate-400">{{ compressed.width }} × {{ compressed.height }}{{ compressed.width !== original?.width ? $t('ui.image.image-compress.scaledSuffix') : '' }}</div>
          </div>
          <button
            @click="download"
            class="mt-4 h-10 px-6 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 mx-auto transition"
          >
            <component :is="icons.Download" class="w-4 h-4" />
            {{ $t('ui.image.image-compress.btnDownload') }}
          </button>
        </div>
        <div v-else class="h-64 flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50 rounded-lg border border-slate-100">
          <component :is="icons.Image" class="w-8 h-8 text-slate-300" />
          {{ $t('ui.image.image-compress.emptyHint') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const original = ref<{ url: string; size: number; width: number; height: number; file: File } | null>(null)
const compressed = ref<{ url: string; size: number; width: number; height: number; blob: Blob } | null>(null)
const quality = ref(70)
const maxWidth = ref(1920)
const dragOver = ref(false)

const savedPct = computed(() => {
  if (!original.value || !compressed.value) return 0
  return Math.round((1 - compressed.value.size / original.value.size) * 100)
})

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function clearFile() {
  if (original.value) URL.revokeObjectURL(original.value.url)
  original.value = null
  compressed.value = null
  maxWidth.value = 1920
}

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    original.value = { url, size: file.size, width: img.width, height: img.height, file }
    maxWidth.value = img.width
    compressed.value = null
  }
  img.src = url
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

async function compress() {
  if (!original.value) return
  const img = new Image()
  await new Promise(res => {
    img.onload = res
    img.src = original.value!.url
  })
  let w = img.width
  let h = img.height
  if (w > maxWidth.value) {
    h = Math.round(h * (maxWidth.value / w))
    w = maxWidth.value
  }
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  // JPEG 不透明，先填白底避免 PNG 透明区变深色
  const mime = original.value.file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  if (mime === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
  }
  ctx.drawImage(img, 0, 0, w, h)
  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b as Blob), mime, quality.value / 100))
  if (compressed.value) URL.revokeObjectURL(compressed.value.url)
  compressed.value = { url: URL.createObjectURL(blob), size: blob.size, width: w, height: h, blob }
}

function download() {
  if (!compressed.value) return
  const a = document.createElement('a')
  a.href = compressed.value.url
  a.download = 'compressed.' + (original.value?.file.name.split('.').pop() || 'jpg')
  a.click()
}
</script>
