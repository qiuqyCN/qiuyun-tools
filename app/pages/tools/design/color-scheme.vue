<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-3">
      <h3 class="text-sm font-semibold text-slate-700">配色方案生成</h3>
      <div>
        <label class="block text-xs text-slate-500 mb-1">基色</label>
        <input v-model="baseColor" type="color" class="w-full h-10 rounded-lg border border-slate-200" />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">方案类型</label>
        <select v-model="scheme" class="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm">
          <option v-for="s in schemes" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>
      <div class="text-xs text-slate-500">
        <div class="font-medium mb-1">说明</div>
        <div class="text-slate-400">{{ schemes.find(s => s.id === scheme)?.desc }}</div>
      </div>
      <button @click="refresh" class="w-full h-9 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">🔄 重新生成</button>
    </section>

    <section class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">方案预览（{{ schemeColors.length }} 色）</h3>
        <div class="grid grid-cols-5 gap-3">
          <div
            v-for="(c, i) in schemeColors"
            :key="i"
            class="aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer hover:scale-105 transition"
            :style="{ backgroundColor: c }"
            @click="copyHex(c)"
          >
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-white opacity-0 group-hover:opacity-100 transition">{{ c }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">渐变预览</h3>
          <CopyButton :text="schemeColors.join(', ')" label="复制全部 HEX" />
        </div>
        <div class="h-20 rounded-lg" :style="{ background: `linear-gradient(90deg, ${schemeColors.join(', ')})` }"></div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">Tailwind / CSS 变量</h3>
        <pre class="p-3 rounded-lg bg-slate-900 text-indigo-300 text-xs font-mono whitespace-pre-wrap">{{ cssVars }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
