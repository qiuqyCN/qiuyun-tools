<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.frontend/gradient.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.frontend.gradient.pageDesc') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('ui.frontend.gradient.configLabel') }}</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.gradient.typeLabel') }}</label>
          <select v-model="type" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="linear">{{ $t('ui.frontend.gradient.typeLinear') }}</option>
            <option value="radial">{{ $t('ui.frontend.gradient.typeRadial') }}</option>
            <option value="conic">{{ $t('ui.frontend.gradient.typeConic') }}</option>
          </select>
        </div>
        <div v-if="type === 'linear'">
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.gradient.fieldAngle', { angle }) }}</label>
          <input v-model.number="angle" type="range" min="0" max="360" class="w-full" />
        </div>
        <div v-else-if="type === 'radial'">
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.frontend.gradient.positionLabel') }}</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>X {{ cx }}% <input v-model.number="cx" type="range" min="0" max="100" class="w-full" /></div>
            <div>Y {{ cy }}% <input v-model.number="cy" type="range" min="0" max="100" class="w-full" /></div>
          </div>
        </div>

        <!-- stops -->
        <div class="pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{{ $t('ui.frontend.gradient.stopsLabel') }}</span>
            <button v-if="stops.length < 6" @click="addStop" class="text-indigo-500 hover:text-indigo-600 hover:underline flex items-center gap-0.5">
              <component :is="icons.Plus" class="w-3 h-3" />{{ $t('ui.frontend.gradient.btnAddStop') }}
            </button>
          </div>
          <div v-for="(s, i) in stops" :key="i" class="flex items-center gap-2 mb-2">
            <input v-model="s.color" type="color" class="w-8 h-8 rounded cursor-pointer" />
            <input v-model.number="s.pos" type="range" min="0" max="100" class="flex-1" />
            <span class="text-xs text-slate-400 w-8">{{ s.pos }}%</span>
            <button v-if="stops.length > 2" @click="stops.splice(i, 1)" class="text-xs text-red-400 hover:text-red-500">
              <component :is="icons.X" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.gradient.previewLabel') }}</span>
          </div>
          <div class="h-48 rounded-xl shadow-sm border border-slate-100" :style="{ background: css }"></div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span class="flex items-center gap-1"><component :is="icons.Code" class="w-3.5 h-3.5" />CSS</span>
            <CopyButton :text="css" :label="$t('common.copy')" />
          </div>
          <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ 'background: ' + css + ';' }}</pre>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.Sparkles" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.frontend.gradient.presetsLabel') }}</span>
          </div>
          <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
            <button
              v-for="p in presets"
              :key="p.name"
              @click="applyPreset(p)"
              class="h-16 rounded-lg hover:ring-2 hover:ring-indigo-400 transition border border-slate-100"
              :style="{ background: p.css }"
              :title="p.name"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const type = ref<'linear' | 'radial' | 'conic'>('linear')
const angle = ref(135)
const cx = ref(50)
const cy = ref(50)
const stops = ref([{ color: '#6366f1', pos: 0 }, { color: '#a855f7', pos: 50 }, { color: '#ec4899', pos: 100 }])

const presets = [
  { name: 'Indigo-Pink', css: 'linear-gradient(135deg, #6366f1, #ec4899)' },
  { name: 'Ocean', css: 'linear-gradient(135deg, #0ea5e9, #14b8a6)' },
  { name: 'Sunset', css: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { name: 'Forest', css: 'linear-gradient(135deg, #10b981, #065f46)' },
  { name: 'Night', css: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' },
  { name: 'Fire', css: 'radial-gradient(circle, #fbbf24, #ef4444)' },
  { name: 'Sky', css: 'linear-gradient(135deg, #38bdf8, #fef3c7)' },
  { name: 'Violet', css: 'linear-gradient(135deg, #7c3aed, #db2777)' },
]

const css = computed(() => {
  const sorted = [...stops.value].sort((a, b) => a.pos - b.pos)
  const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(', ')
  if (type.value === 'linear') return `linear-gradient(${angle.value}deg, ${stopStr})`
  if (type.value === 'radial') return `radial-gradient(circle at ${cx.value}% ${cy.value}%, ${stopStr})`
  return `conic-gradient(from ${angle.value}deg at ${cx.value}% ${cy.value}%, ${stopStr})`
})

function addStop() {
  stops.value.push({ color: '#ffffff', pos: 50 })
}

function applyPreset(p: { css: string }) {
  // 从预设 CSS 中提取简单值
  const match = p.css.match(/#[0-9a-fA-F]{6}/g)
  if (match && match.length >= 2) {
    stops.value = match.map((c, i) => ({ color: c, pos: Math.round((i / (match.length - 1)) * 100) }))
    type.value = p.css.includes('radial') ? 'radial' : 'linear'
  }
}
</script>
