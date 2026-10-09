<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">图片格式转换</h3>
      <label class="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition">
        <input type="file" accept="image/*" class="hidden" @change="onFile" />
        <component :is="icons.Upload" class="w-8 h-8 text-slate-300 mb-2" />
        <span class="text-sm text-slate-500">点击或拖拽上传图片</span>
      </label>
      <div v-if="src" class="mt-4">
        <div class="text-xs text-slate-500 mb-1">目标格式</div>
        <div class="flex gap-2">
          <button
            v-for="f in formats"
            :key="f.value"
            @click="target = f.value"
            class="px-3 py-1.5 text-xs rounded-md border transition"
            :class="target === f.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'"
          >{{ f.label }}</button>
        </div>
        <div class="mt-3">
          <label class="block text-xs text-slate-500 mb-1">质量: {{ quality }}%</label>
          <input v-model.number="quality" type="range" min="10" max="100" class="w-full" />
        </div>
        <button @click="convert" class="w-full mt-3 h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">转换</button>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">结果</h3>
      <div v-if="src" class="text-center">
        <img :src="src" class="max-w-full max-h-48 rounded-lg border border-slate-200 mx-auto" />
        <div class="text-xs text-slate-400 mt-2">原图</div>
      </div>
      <div v-if="result" class="text-center mt-6">
        <img :src="result.url" class="max-w-full max-h-48 rounded-lg border border-indigo-200 bg-indigo-50 mx-auto" />
        <div class="mt-3 flex justify-center gap-3 items-center">
          <span class="text-xs text-indigo-600 font-mono">{{ fmtSize(result.size) }}</span>
          <button @click="download" class="h-8 px-4 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">下载</button>
        </div>
      </div>
      <div v-if="!result && !src" class="h-60 flex items-center justify-center text-slate-400 text-sm">等待上传</div>
    </section>
  </div>
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
let resultBlob: Blob | null = null

function fmtSize(b: number) {
  return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(2) + ' MB'
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  src.value = URL.createObjectURL(file)
  result.value = null
}

async function convert() {
  if (!src.value) return
  const img = new Image()
  await new Promise(res => { img.onload = res; img.src = src.value })
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  // JPG 不透明，需要先填白
  if (target.value === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)
  resultBlob = await new Promise(res => canvas.toBlob(b => res(b as Blob), target.value, quality.value / 100))
  result.value = { url: URL.createObjectURL(resultBlob), size: resultBlob.size, blob: resultBlob }
}

function download() {
  if (!resultBlob) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(resultBlob)
  const ext = target.value.split('/')[1]
  a.download = 'converted.' + ext
  a.click()
}
</script>
