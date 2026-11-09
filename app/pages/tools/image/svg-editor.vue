<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.image.svg-editor.title') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.image.svg-editor.subtitle') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-2">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.svg-editor.previewTitle') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button @click="loadPreset('star')" class="h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 border border-slate-100 transition flex items-center gap-1">
              <component :is="icons.Star" class="w-3.5 h-3.5" />{{ $t('ui.image.svg-editor.presetStar') }}
            </button>
            <button @click="loadPreset('flower')" class="h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 border border-slate-100 transition flex items-center gap-1">
              <component :is="icons.Sparkles" class="w-3.5 h-3.5" />{{ $t('ui.image.svg-editor.presetFlower') }}
            </button>
            <button @click="loadPreset('gradient')" class="h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 border border-slate-100 transition flex items-center gap-1">
              <component :is="icons.GraduationCap" class="w-3.5 h-3.5" />{{ $t('ui.image.svg-editor.presetGradient') }}
            </button>
          </div>
        </div>
        <div class="aspect-square bg-slate-50 rounded-xl p-8 flex items-center justify-center border border-slate-100">
          <div v-html="svg" class="w-full h-full flex items-center justify-center" />
        </div>
        <div class="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <component :is="icons.Info" class="w-3.5 h-3.5" />
          {{ $t('ui.image.svg-editor.tipText') }}
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <component :is="icons.Code" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.svg-editor.sourceTitle') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <CopyButton :text="svg" :label="$t('common.copy')" />
            <button
              @click="download"
              class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1.5 transition"
            >
              <component :is="icons.Download" class="w-3.5 h-3.5" />
              {{ $t('ui.image.svg-editor.btnDownloadSvg') }}
            </button>
          </div>
        </div>
        <textarea
          v-model="svg"
          class="w-full h-80 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div v-if="svgError" class="text-xs text-red-500 flex items-center gap-1.5">
          <component :is="icons.AlertTriangle" class="w-3.5 h-3.5" />
          {{ svgError }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
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
