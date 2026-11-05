<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">配色方案生成</h3>
      <span class="text-xs text-slate-400">基于色轮理论自动生成和谐配色方案</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="text-xs font-medium text-slate-500 mb-1">配色配置</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">基色</label>
          <input v-model="baseColor" type="color" class="w-full h-10 rounded-lg border border-slate-200 cursor-pointer" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">方案类型</label>
          <select v-model="scheme" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
            <option v-for="s in schemes" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
        </div>
        <div class="text-xs p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="font-medium text-slate-600 mb-1 flex items-center gap-1">
            <component :is="icons.Lightbulb" class="w-3.5 h-3.5" />
            说明
          </div>
          <div class="text-slate-400">{{ schemes.find(s => s.id === scheme)?.desc }}</div>
        </div>
        <button
          @click="refresh"
          class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
        >
          <component :is="icons.RefreshCw" class="w-4 h-4" />
          重新生成
        </button>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-3">
            <component :is="icons.Palette" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">方案预览（{{ schemeColors.length }} 色）</span>
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
              <span class="text-xs font-medium text-slate-500">渐变预览</span>
            </div>
            <CopyButton :text="schemeColors.join(', ')" label="复制全部 HEX" />
          </div>
          <div class="h-20 rounded-lg shadow-sm border border-slate-100" :style="{ background: `linear-gradient(90deg, ${schemeColors.join(', ')})` }"></div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.CurlyBraces" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">Tailwind / CSS 变量</span>
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

const baseColor = ref('#6366f1')
const scheme = ref('analogous')

const schemes = [
  { id: 'analogous', label: '类似色', desc: '色相环上相邻的颜色，和谐统一' },
  { id: 'complementary', label: '互补色', desc: '色相环上正对的颜色，对比强烈' },
  { id: 'triadic', label: '三色方案', desc: '色相环上等距三角，丰富平衡' },
  { id: 'tetradic', label: '四色方案', desc: '色相环上矩形四角，变化丰富' },
  { id: 'monochromatic', label: '单色调', desc: '同色相不同明度，统一雅致' },
]

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
