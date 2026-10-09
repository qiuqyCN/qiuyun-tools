<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">图片水印</h3>
      <label class="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400">
        <input type="file" accept="image/*" class="hidden" @change="onFile" />
        <span class="text-sm text-slate-500">选择底图</span>
      </label>
      <div v-if="baseImg" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-500 mb-1">水印文字</label>
          <input v-model="text" class="w-full h-9 px-2 rounded-lg border border-slate-200" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-500 mb-1">字号: {{ fontSize }}</label>
            <input v-model.number="fontSize" type="range" min="10" max="100" class="w-full" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">透明度: {{ opacity }}</label>
            <input v-model.number="opacity" type="range" min="10" max="100" class="w-full" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">旋转: {{ angle }}°</label>
            <input v-model.number="angle" type="range" min="-90" max="90" class="w-full" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">颜色</label>
            <input v-model="color" type="color" class="w-full h-9 rounded-lg border border-slate-200" />
          </div>
        </div>
        <div>
          <label class="block text-slate-500 mb-1">位置</label>
          <select v-model="position" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white">
            <option value="center">居中</option>
            <option value="tl">左上</option>
            <option value="tr">右上</option>
            <option value="bl">左下</option>
            <option value="br">右下</option>
            <option value="tile">平铺</option>
          </select>
        </div>
        <button @click="apply" class="w-full h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">应用水印</button>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">预览</h3>
      <div class="flex-1 flex items-center justify-center">
        <img v-if="resultUrl" :src="resultUrl" class="max-w-full max-h-96 rounded-lg border border-slate-200" />
        <canvas v-else ref="canvasRef" class="max-w-full max-h-96 rounded-lg border border-slate-200 hidden"></canvas>
        <div v-if="!resultUrl && !baseImg" class="h-40 flex items-center text-slate-400 text-sm">等待上传</div>
      </div>
      <button v-if="resultUrl" @click="download" class="mt-4 h-9 px-4 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">下载</button>
    </section>
  </div>
</template>

<script setup lang="ts">
const baseImg = ref<HTMLImageElement | null>(null)
const text = ref('Watermark')
const fontSize = ref(48)
const opacity = ref(50)
const angle = ref(-30)
const color = ref('#ffffff')
const position = ref('tile')
const resultUrl = ref('')

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => { baseImg.value = img; resultUrl.value = '' }
  img.src = url
}

function apply() {
  if (!baseImg.value) return
  const canvas = document.createElement('canvas')
  canvas.width = baseImg.value.width
  canvas.height = baseImg.value.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(baseImg.value, 0, 0)
  ctx.globalAlpha = opacity.value / 100
  ctx.fillStyle = color.value
  ctx.font = `bold ${fontSize.value}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const w = canvas.width, h = canvas.height
  const rad = (angle.value * Math.PI) / 180

  function drawOne(x: number, y: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rad)
    ctx.fillText(text.value, 0, 0)
    ctx.restore()
  }

  if (position.value === 'tile') {
    const tw = ctx.measureText(text.value).width + 60
    for (let y = h / 2; y < h + fontSize.value; y += fontSize.value * 2) {
      for (let x = w / 2; x < w + tw; x += tw) {
        drawOne(x, y)
        drawOne(x - tw, y - fontSize.value * 2)
      }
    }
  } else {
    const pad = 40
    const map: Record<string, [number, number]> = {
      center: [w / 2, h / 2],
      tl: [fontSize.value + pad, fontSize.value + pad],
      tr: [w - fontSize.value - pad, fontSize.value + pad],
      bl: [fontSize.value + pad, h - fontSize.value - pad],
      br: [w - fontSize.value - pad, h - fontSize.value - pad],
    }
    const [x, y] = map[position.value] || map.center
    drawOne(x, y)
  }

  resultUrl.value = canvas.toDataURL('image/png')
}

function download() {
  if (!resultUrl.value) return
  const a = document.createElement('a')
  a.href = resultUrl.value
  a.download = 'watermarked.png'
  a.click()
}
</script>
