<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.frontend/color-scheme.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.frontend.color-scheme.pageDesc') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('ui.frontend.color-scheme.configLabel') }}</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.color-scheme.baseColorLabel') }}</label>
          <input v-model="baseColor" type="color" class="w-full h-10 rounded-lg border border-slate-200 cursor-pointer" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.color-scheme.schemeTypeLabel') }}</label>
          <select v-model="scheme" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="s in schemes" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
        </div>
        <div class="text-xs p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="font-medium text-slate-600 mb-1 flex items-center gap-1">
            <component :is="icons.Lightbulb" class="w-3.5 h-3.5" />
            {{ $t('ui.frontend.color-scheme.hintLabel') }}
          </div>
          <div class="text-slate-400">{{ schemes.find(s => s.id === scheme)?.desc }}</div>
        </div>
        <button
          @click="refresh"
          class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
        >
          <component :is="icons.RefreshCw" class="w-4 h-4" />
          {{ $t('ui.frontend.color-scheme.btnRefresh') }}
        </button>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-3">
            <component :is="icons.Palette" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.color-scheme.previewCount', { count: schemeColors.length }) }}</span>
          </div>
          <div class="grid grid-cols-5 gap-3">
            <div
              v-for="(c, i) in schemeColors"
              :key="i"
              class="aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer hover:scale-105 transition shadow-sm"
              :style="{ backgroundColor: c }"
              @click="copyHex(c)"
            >
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white opacity-0 group-hover:opacity-100 transition">{{ c }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <component :is="icons.GripVertical" class="w-4 h-4 text-indigo-400" />
              <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.color-scheme.gradientPreviewLabel') }}</span>
            </div>
            <CopyButton :text="schemeColors.join(', ')" :label="$t('ui.frontend.color-scheme.btnCopyAll')" />
          </div>
          <div class="h-20 rounded-lg shadow-sm border border-slate-100" :style="{ background: `linear-gradient(90deg, ${schemeColors.join(', ')})` }"></div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.CurlyBraces" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.color-scheme.cssVarsLabel') }}</span>
          </div>
          <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ cssVars }}</pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import chroma from 'chroma-js'

const { t } = useI18n()
const baseColor = ref('#6366f1')
const scheme = ref('analogous')

const schemes = computed(() => [
  { id: 'analogous', label: t('ui.frontend.color-scheme.schemeAnalogous'), desc: t('ui.frontend.color-scheme.descAnalogous') },
  { id: 'complementary', label: t('ui.frontend.color-scheme.schemeComplementary'), desc: t('ui.frontend.color-scheme.descComplementary') },
  { id: 'triadic', label: t('ui.frontend.color-scheme.schemeTriadic'), desc: t('ui.frontend.color-scheme.descTriadic') },
  { id: 'tetradic', label: t('ui.frontend.color-scheme.schemeTetradic'), desc: t('ui.frontend.color-scheme.descTetradic') },
  { id: 'monochromatic', label: t('ui.frontend.color-scheme.schemeMonochromatic'), desc: t('ui.frontend.color-scheme.descMonochromatic') },
])

const schemeColors = computed(() => {
  const base = chroma(baseColor.value)
  switch (scheme.value) {
    case 'complementary': {
      return chroma.scale([base, base.set('hsl.h', '+180')]).mode('lch').colors(5)
    }
    case 'triadic': {
      const h = base.hsl()[0]
      return [base.set('hsl.h', h), base.set('hsl.h', h + 120), base.set('hsl.h', h + 240), base.brighten(0.3), base.darken(0.3)]
        .map(c => c.hex())
    }
    case 'tetradic': {
      const h = base.hsl()[0]
      return [0, 90, 180, 270].map(o => base.set('hsl.h', h + o).hex())
    }
    case 'monochromatic': {
      return chroma.scale([base.darken(0.6), base, base.brighten(0.7)]).mode('lch').colors(5)
    }
    case 'analogous':
    default: {
      const h = base.hsl()[0]
      return [-30, -15, 0, 15, 30].map(o => base.set('hsl.h', h + o).hex())
    }
  }
})

const cssVars = computed(() => {
  const lines = [':root {']
  schemeColors.value.forEach((c, i) => {
    lines.push(`  --color-${['primary', 'secondary', 'accent', 'neutral', 'highlight'][i] || i}: ${c};`)
  })
  lines.push('}')
  return lines.join('\n')
})

function refresh() { /* chroma 自动是数学的，不用刷新 */ }
function copyHex(c: string) { navigator.clipboard.writeText(c) }
</script>
