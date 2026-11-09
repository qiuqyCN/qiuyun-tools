<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.life/unit-convert.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.life.unit-convert.pageDesc') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.unit-convert.labelCategory') }}</label>
          <select v-model="category" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white">
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ $t(c.labelKey) }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.unit-convert.labelAmount') }}</label>
          <input v-model.number="value" type="number" step="any" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.unit-convert.labelFrom') }}</label>
          <select v-model="from" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white font-mono">
            <option v-for="u in currentUnits" :key="u.id" :value="u.id">{{ unitLabel(u) }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.unit-convert.labelTo') }}</label>
          <select v-model="to" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white font-mono">
            <option v-for="u in currentUnits" :key="u.id" :value="u.id">{{ unitLabel(u) }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200 mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.unit-convert.resultLabel') }}</span>
        <CopyButton :text="result" :label="$t('common.copy')" />
      </div>
      <div class="text-3xl font-bold text-indigo-600 font-mono">{{ result }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ value }} {{ fromLabel }} = {{ result }} {{ toLabel }}</div>
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
        <div v-for="u in currentUnits" :key="u.id" class="p-2 rounded bg-slate-50 font-mono border border-slate-100">
          <span class="text-slate-500">{{ unitLabel(u) }}:</span> {{ convertFromBase(baseValue, u.id).toPrecision(6) }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

interface Unit { id: string; label?: string; labelKey?: string }
const categories: { id: string; labelKey: string; units: Unit[]; baseFactor: (u: string) => number }[] = [
  {
    id: 'length', labelKey: 'ui.life.unit-convert.catLength',
    units: [
      { id: 'mm', label: 'mm' },
      { id: 'cm', label: 'cm' },
      { id: 'm', label: 'm' },
      { id: 'km', label: 'km' },
      { id: 'in', labelKey: 'unitInch' },
      { id: 'ft', labelKey: 'unitFoot' },
      { id: 'mi', labelKey: 'unitMile' },
      { id: 'li', labelKey: 'unitLi' },
      { id: 'kmCn', labelKey: 'unitKilometerCn' },
    ],
    baseFactor: u => ({ mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.34, li: 500, kmCn: 1000 }[u] || 1),
  },
  {
    id: 'weight', labelKey: 'ui.life.unit-convert.catWeight',
    units: [
      { id: 'g', label: 'g' },
      { id: 'kg', label: 'kg' },
      { id: 'ton', labelKey: 'unitTon' },
      { id: 'lb', labelKey: 'unitPound' },
      { id: 'oz', labelKey: 'unitOunce' },
      { id: 'jin', labelKey: 'unitJin' },
    ],
    baseFactor: u => ({ g: 0.001, kg: 1, ton: 1000, lb: 0.453592, oz: 0.0283495, jin: 0.5 }[u] || 1),
  },
  {
    id: 'area', labelKey: 'ui.life.unit-convert.catArea',
    units: [
      { id: 'm2', label: 'm²' },
      { id: 'km2', label: 'km²' },
      { id: 'ha', labelKey: 'unitHectare' },
      { id: 'acre', labelKey: 'unitAcre' },
      { id: 'sqft', labelKey: 'unitSqFoot' },
    ],
    baseFactor: u => ({ m2: 1, km2: 1e6, ha: 1e4, acre: 4046.86, sqft: 0.092903 }[u] || 1),
  },
  {
    id: 'volume', labelKey: 'ui.life.unit-convert.catVolume',
    units: [
      { id: 'ml', label: 'ml' },
      { id: 'L', label: 'L' },
      { id: 'm3', label: 'm³' },
      { id: 'galUs', labelKey: 'unitGallonUs' },
    ],
    baseFactor: u => ({ ml: 0.001, L: 1, m3: 1000, galUs: 3.78541 }[u] || 1),
  },
  {
    id: 'time', labelKey: 'ui.life.unit-convert.catTime',
    units: [
      { id: 'ms', label: 'ms' },
      { id: 's', labelKey: 'unitSecond' },
      { id: 'min', labelKey: 'unitMinute' },
      { id: 'h', labelKey: 'unitHour' },
      { id: 'day', labelKey: 'unitDay' },
      { id: 'week', labelKey: 'unitWeek' },
    ],
    baseFactor: u => ({ ms: 0.001, s: 1, min: 60, h: 3600, day: 86400, week: 604800 }[u] || 1),
  },
]

const category = ref('length')
const currentUnits = computed(() => categories.find(c => c.id === category.value)!.units)
const value = ref(1000)
const from = ref('m')
const to = ref('km')

watch(category, () => {
  from.value = currentUnits.value[2].id
  to.value = currentUnits.value[3].id
}, { immediate: true })

function unitLabel(u: Unit) {
  return u.label ?? t('ui.life.unit-convert.' + u.labelKey)
}
const fromLabel = computed(() => unitLabel(currentUnits.value.find(u => u.id === from.value)!))
const toLabel = computed(() => unitLabel(currentUnits.value.find(u => u.id === to.value)!))

function getFactor(u: string) {
  return categories.find(c => c.id === category.value)!.baseFactor(u)
}
const baseValue = computed(() => value.value * getFactor(from.value))
function convertFromBase(base: number, u: string) { return base / getFactor(u) }
const result = computed(() => convertFromBase(baseValue.value, to.value).toPrecision(8).replace(/\.?0+$/, ''))
</script>
