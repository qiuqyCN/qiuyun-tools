<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">渐变生成器</h3>
      <div>
        <label class="block text-xs text-slate-500 mb-1">类型</label>
        <select v-model="type" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
          <option value="linear">线性渐变</option>
          <option value="radial">径向渐变</option>
          <option value="conic">圆锥渐变</option>
        </select>
      </div>
      <div v-if="type === 'linear'">
        <label class="block text-xs text-slate-500 mb-1">角度: {{ angle }}°</label>
        <input v-model.number="angle" type="range" min="0" max="360" class="w-full" />
      </div>
      <div v-else-if="type === 'radial'">
        <label class="block text-xs text-slate-500 mb-1">位置</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>X <input v-model.number="cx" type="range" min="0" max="100" class="w-full" /></div>
          <div>Y <input v-model.number="cy" type="range" min="0" max="100" class="w-full" /></div>
        </div>
      </div>

      <!-- stops -->
      <div>
        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>颜色停靠点</span>
          <button v-if="stops.length < 6" @click="addStop" class="text-indigo-600 hover:underline">+ 添加</button>
        </div>
        <div v-for="(s, i) in stops" :key="i" class="flex items-center gap-2 mb-2">
          <input v-model="s.color" type="color" class="w-8 h-8 rounded cursor-pointer" />
          <input v-model.number="s.pos" type="range" min="0" max="100" class="flex-1" />
          <span class="text-xs text-slate-400 w-8">{{ s.pos }}%</span>
          <button v-if="stops.length > 2" @click="stops.splice(i, 1)" class="text-xs text-red-400">×</button>
        </div>
      </div>
    </section>

    <section class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">预览</h3>
        <div class="h-48 rounded-xl" :style="{ background: css }"></div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>CSS</span>
          <CopyButton :text="css" label="复制" />
        </div>
        <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ 'background: ' + css + ';' }}</pre>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">预设</h3>
        <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
          <button
            v-for="p in presets"
            :key="p.name"
            @click="applyPreset(p)"
            class="h-16 rounded-lg hover:ring-2 hover:ring-indigo-400 transition"
            :style="{ background: p.css }"
            :title="p.name"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
