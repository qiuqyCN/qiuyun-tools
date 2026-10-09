<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">综合单位换算</h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="block text-xs text-slate-500 mb-1">类别</label>
          <select v-model="category" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">数量</label>
          <input v-model.number="value" type="number" step="any" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
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
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">转换结果</h3>
      <div class="text-3xl font-bold text-indigo-600 font-mono">{{ result }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ value }} {{ from }} = {{ result }} {{ to }}</div>
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        <div v-for="u in currentUnits" :key="u" class="p-2 rounded bg-slate-50 font-mono">
          <span class="text-slate-500">{{ u }}:</span> {{ convertFromBase(baseValue, u).toPrecision(6) }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
