<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">综合单位换算</h3>
      <span class="text-xs text-slate-400">长度 / 重量 / 面积 / 体积 / 时间</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="block text-xs text-slate-500 mb-1">类别</label>
          <select v-model="category" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">数量</label>
          <input v-model.number="value" type="number" step="any" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">从</label>
          <select v-model="from" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white font-mono">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">到</label>
          <select v-model="to" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white font-mono">
            <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200 mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-slate-500">转换结果</span>
        <CopyButton :text="result" label="复制" />
      </div>
      <div class="text-3xl font-bold text-indigo-600 font-mono">{{ result }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ value }} {{ from }} = {{ result }} {{ to }}</div>
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        <div v-for="u in currentUnits" :key="u" class="p-2 rounded bg-slate-50 font-mono border border-slate-100">
          <span class="text-slate-500">{{ u }}:</span> {{ convertFromBase(baseValue, u).toPrecision(6) }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

type UnitSystem = Record<string, { factor: number }>
const categories: { id: string; label: string; units: string[]; baseFactor: (u: string) => number }[] = [
  {
    id: 'length', label: '长度', units: ['mm', 'cm', 'm', 'km', '英寸', '英尺', '英里', '里', '公里'],
    baseFactor: u => ({ mm: 0.001, cm: 0.01, m: 1, km: 1000, 英寸: 0.0254, 英尺: 0.3048, 英里: 1609.34, 里: 500, 公里: 1000 }[u] || 1),
  },
  {
    id: 'weight', label: '重量', units: ['g', 'kg', '吨', '磅', '盎司', '斤'],
    baseFactor: u => ({ g: 0.001, kg: 1, 吨: 1000, 磅: 0.453592, 盎司: 0.0283495, 斤: 0.5 }[u] || 1),
  },
  {
    id: 'area', label: '面积', units: ['m²', 'km²', '公顷', '英亩', '平方英尺'],
    baseFactor: u => ({ 'm²': 1, 'km²': 1e6, 公顷: 1e4, 英亩: 4046.86, 平方英尺: 0.092903 }[u] || 1),
  },
  {
    id: 'volume', label: '体积', units: ['ml', 'L', 'm³', '加仑(美)'],
    baseFactor: u => ({ ml: 0.001, L: 1, 'm³': 1000, '加仑(美)': 3.78541 }[u] || 1),
  },
  {
    id: 'time', label: '时间', units: ['ms', '秒', '分', '时', '天', '周'],
    baseFactor: u => ({ ms: 0.001, 秒: 1, 分: 60, 时: 3600, 天: 86400, 周: 604800 }[u] || 1),
  },
]

const category = ref('length')
const currentUnits = computed(() => categories.find(c => c.id === category.value)!.units)
const value = ref(1000)
const from = ref('m')
const to = ref('km')

watch(category, () => {
  from.value = currentUnits.value[2]
  to.value = currentUnits.value[3]
}, { immediate: true })

function getFactor(u: string) {
  return categories.find(c => c.id === category.value)!.baseFactor(u)
}
const baseValue = computed(() => value.value * getFactor(from.value))
function convertFromBase(base: number, u: string) { return base / getFactor(u) }
const result = computed(() => convertFromBase(baseValue.value, to.value).toPrecision(8).replace(/\.?0+$/, ''))
</script>
