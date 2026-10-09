<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">上传图片识别</h3>
      <!-- Upload zone -->
      <div
        class="relative mb-3"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
      >
        <label
          class="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition"
          :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
        >
          <input type="file" accept="image/*" class="hidden" @change="onFile" />
          <component :is="icons.Scan" class="w-8 h-8 text-slate-300 mb-2" />
          <span class="text-sm text-slate-500">选择含二维码的图片</span>
        </label>
      </div>
      <div v-if="src" class="mt-3">
        <img :src="src" class="max-w-full max-h-40 rounded-lg" />
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">识别结果</h3>
      <div v-if="result" class="space-y-3">
        <div class="text-xs text-slate-500">解码内容</div>
        <pre class="p-3 bg-indigo-50 rounded-lg text-sm font-mono text-indigo-900 break-all whitespace-pre-wrap">{{ result }}</pre>
        <div class="flex items-center gap-2">
          <CopyButton :text="result" label="复制" />
          <a v-if="isUrl" :href="result" target="_blank" class="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200">打开链接</a>
        </div>
      </div>
      <div v-else-if="error" class="p-3 bg-red-50 rounded-lg text-sm text-red-600">{{ error }}</div>
      <div v-else class="h-32 flex items-center justify-center text-slate-400 text-sm">等待上传图片</div>
    </section>

    <canvas ref="canvasRef" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import jsQR from 'jsqr'

const src = ref('')
const result = ref('')
const error = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const dragOver = ref(false)

const isUrl = computed(() => result.value && /^https?:\/\//i.test(result.value))

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return
  const url = URL.createObjectURL(file)
  src.value = url
  result.value = ''
  error.value = ''
  decodeQr(url)
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

async function decodeQr(url: string) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise(res => { img.onload = res; img.src = url })

  const canvas = canvasRef.value || document.createElement('canvas')
  canvasRef.value = canvas
  // 缩放以提升识别率
  const maxDim = 800
  let w = img.width, h = img.height
  if (Math.max(w, h) > maxDim) {
    const ratio = maxDim / Math.max(w, h)
    w = Math.round(w * ratio)
    h = Math.round(h * ratio)
  }
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const imgData = ctx.getImageData(0, 0, w, h)
  const code = jsQR(imgData.data, w, h)
  if (code) result.value = code.data
  else error.value = '未识别到二维码'
}
</script>
