<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">二维码生成</h3>
      <textarea
        v-model="text"
        placeholder="输入文字 / URL..."
        class="w-full h-28 p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label class="block text-slate-500 mb-1">尺寸: {{ size }}</label>
          <input v-model.number="size" type="range" min="100" max="500" step="10" class="w-full" />
        </div>
        <div>
          <label class="block text-slate-500 mb-1">容错级别</label>
          <select v-model="level" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white">
            <option value="L">低 (7%)</option>
            <option value="M">中 (15%)</option>
            <option value="Q">较高 (25%)</option>
            <option value="H">高 (30%)</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-500 mb-1">前景色</label>
          <input v-model="fgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200" />
        </div>
        <div>
          <label class="block text-slate-500 mb-1">背景色</label>
          <input v-model="bgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200" />
        </div>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">预览</h3>
      <div class="flex-1 flex items-center justify-center" :style="{ backgroundColor: bgColor }">
        <canvas ref="canvasRef"></canvas>
      </div>
      <div v-if="text" class="mt-4 flex items-center gap-2">
        <button @click="download" class="h-9 px-4 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">下载 PNG</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const text = ref('https://github.com')
const size = ref(200)
const level = ref('M')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const canvasRef = ref<HTMLCanvasElement | null>(null)

watch([text, size, level, fgColor, bgColor], () => {
  if (!canvasRef.value) return
  QRCode.toCanvas(
    canvasRef.value,
    text.value,
    {
      width: size.value,
      errorCorrectionLevel: level.value as any,
      color: { dark: fgColor.value, light: bgColor.value },
      margin: 2,
    },
    err => { if (err) console.error(err) },
  )
}, { immediate: true })

function download() {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvasRef.value.toDataURL()
  link.click()
}
</script>
