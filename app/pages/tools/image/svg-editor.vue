<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">SVG 预览</h3>
        <div class="flex items-center gap-2 text-xs">
          <button @click="loadPreset('star')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">⭐ 星形</button>
          <button @click="loadPreset('flower')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">🌸 花朵</button>
          <button @click="loadPreset('gradient')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">🌈 渐变</button>
        </div>
      </div>
      <div class="aspect-square bg-slate-50 rounded-lg p-8 flex items-center justify-center">
        <div v-html="svg" class="w-full h-full flex items-center justify-center" />
      </div>
      <div class="mt-3 text-xs text-slate-400">
        提示：这是一个简单的 SVG 源代码编辑器，支持预览和导出
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-700">SVG 源码</h3>
        <div class="flex items-center gap-2">
          <CopyButton :text="svg" label="复制" />
          <button @click="download" class="h-8 px-3 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700">下载 SVG</button>
        </div>
      </div>
      <textarea
        v-model="svg"
        class="w-full h-80 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div v-if="svgError" class="text-xs text-red-500">{{ svgError }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
const svg = ref(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#6366f1" />
  <circle cx="100" cy="100" r="60" fill="#a855f7" />
  <circle cx="100" cy="100" r="40" fill="#ec4899" />
  <circle cx="100" cy="100" r="20" fill="#f59e0b" />
</svg>`)
const svgError = ref('')

function loadPreset(name: string) {
  const presets: Record<string, string> = {
    star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="100,10 125,75 195,75 140,115 160,180 100,140 40,180 60,115 5,75 75,75" fill="#f59e0b" stroke="#d97706" stroke-width="3"/>
</svg>`,
    flower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="60" r="35" fill="#f472b6"/>
  <circle cx="60" cy="100" r="35" fill="#f472b6"/>
  <circle cx="140" cy="100" r="35" fill="#f472b6"/>
  <circle cx="100" cy="140" r="35" fill="#f472b6"/>
  <circle cx="100" cy="100" r="30" fill="#fbbf24"/>
</svg>`,
    gradient: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g1)" rx="20"/>
  <circle cx="60" cy="60" r="30" fill="#ffffff" opacity="0.3"/>
  <circle cx="150" cy="140" r="40" fill="#ffffff" opacity="0.2"/>
</svg>`,
  }
  svg.value = presets[name] || ''
}

function download() {
  const blob = new Blob([svg.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'editor.svg'
  a.click()
  URL.revokeObjectURL(url)
}
</script>
