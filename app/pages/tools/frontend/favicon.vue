<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.favicon.textLabel') }}</label>
            <input v-model="text" maxlength="2" class="w-full h-10 px-3 text-lg rounded-lg border border-slate-200 font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.favicon.bgColorLabel') }}</label>
              <input v-model="bgColor" type="color" class="w-full h-10 rounded-lg border border-slate-200" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.favicon.fgColorLabel') }}</label>
              <input v-model="fgColor" type="color" class="w-full h-10 rounded-lg border border-slate-200" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.favicon.fieldRadius', { radius }) }}</label>
              <input v-model.number="radius" type="range" min="0" max="100" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.favicon.fieldShadow', { shadow }) }}</label>
              <input v-model.number="shadow" type="range" min="0" max="30" class="w-full" />
            </div>
          </div>
        </div>
        <div class="flex gap-6 items-center justify-center">
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <canvas ref="canvasRef" width="256" height="256" class="rounded-lg border border-slate-200" />
          </div>
          <div class="space-y-2 text-center">
            <button
              @click="download('png')"
              class="w-32 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <component :is="icons.Download" class="w-4 h-4" />
              {{ $t('ui.frontend.favicon.btnDownloadPng') }}
            </button>
            <button
              @click="download('ico')"
              class="w-32 h-10 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center justify-center gap-1.5 transition"
            >
              <component :is="icons.Download" class="w-4 h-4" />
              {{ $t('ui.frontend.favicon.btnDownloadIco') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const text = ref('Q')
const bgColor = ref('#6366f1')
const fgColor = ref('#ffffff')
const radius = ref(20)
const shadow = ref(4)
const canvasRef = ref<HTMLCanvasElement | null>(null)

function draw() {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 256, 256)
  // rounded rect
  const r = radius.value * 2.56
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = shadow.value * 4
  ctx.shadowOffsetY = shadow.value
  ctx.fillStyle = bgColor.value
  roundRect(ctx, 10, 10, 236, 236, r)
  ctx.fill()
  ctx.restore()
  // text
  ctx.fillStyle = fgColor.value
  ctx.font = 'bold 128px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.value.slice(0, 2) || '?', 128, 140)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

watch([text, bgColor, fgColor, radius, shadow], draw, { immediate: true })

async function download(format: 'png' | 'ico') {
  const c = canvasRef.value
  if (!c) return
  const mime = format === 'ico' ? 'image/x-icon' : 'image/png'
  const blob: Blob = await new Promise(res => c.toBlob(b => res(b as Blob), 'image/png'))
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'favicon.' + format
  a.click()
}
</script>
