<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">图片压缩</h3>
      <label
        class="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition"
      >
        <input type="file" accept="image/*" class="hidden" @change="onFile" />
        <component :is="icons.Upload" class="w-8 h-8 text-slate-300 mb-2" />
        <span class="text-sm text-slate-500">点击或拖拽上传图片</span>
      </label>
      <div v-if="original" class="mt-4 space-y-3">
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>原始大小: <span class="font-mono text-slate-700">{{ fmtSize(original.size) }}</span></div>
          <div>尺寸: <span class="font-mono text-slate-700">{{ original.width }} × {{ original.height }}</span></div>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">压缩质量: {{ quality }}%</label>
          <input v-model.number="quality" type="range" min="10" max="100" class="w-full" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">最大宽度 (px): {{ maxWidth }}</label>
          <input v-model.number="maxWidth" type="range" min="100" :max="original.width" class="w-full" />
        </div>
        <button @click="compress" class="w-full h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">开始压缩</button>
      </div>
    </section>

    <!-- Output -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">压缩结果</h3>
      <div v-if="compressed" class="text-center">
        <img :src="compressed.url" class="max-w-full max-h-80 rounded-lg border border-slate-200 mx-auto" />
        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-center gap-4">
            <div>压缩后: <span class="font-mono font-semibold text-indigo-600">{{ fmtSize(compressed.size) }}</span></div>
            <div>缩减: <span class="font-mono font-semibold" :class="savedPct < 50 ? 'text-green-600' : 'text-orange-600'">{{ savedPct }}%</span></div>
          </div>
          <div class="text-xs text-slate-400">{{ compressed.width }} × {{ compressed.height }}{{ compressed.width !== original?.width ? ' (缩放)' : '' }}</div>
        </div>
        <button @click="download" class="mt-4 h-10 px-6 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">下载图片</button>
      </div>
      <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">等待上传图片</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const original = ref<{ url: string; size: number; width: number; height: number; file: File } | null>(null)
const compressed = ref<{ url: string; size: number; width: number; height: number; blob: Blob } | null>(null)
const quality = ref(70)
const maxWidth = ref(1920)

const savedPct = computed(() => {
  if (!original.value || !compressed.value) return 0
  return Math.round((1 - compressed.value.size / original.value.size) * 100)
})

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    original.value = { url, size: file.size, width: img.width, height: img.height, file }
    maxWidth.value = img.width
    compressed.value = null
  }
  img.src = url
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
  ctx.drawImage(img, 0, 0, w, h)
  const mime = original.value.file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b as Blob), mime, quality.value / 100))
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
