<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.bmi.weightLabel') }}</label>
          <input v-model.number="weight" type="number" step="0.1" class="w-full h-11 px-3 rounded-lg border border-slate-200 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.bmi.heightLabel') }}</label>
          <input v-model.number="height" type="number" class="w-full h-11 px-3 rounded-lg border border-slate-200 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-5 border border-slate-200 mt-4">
      <div class="text-center mb-5">
        <div class="text-xs text-slate-500">{{ $t('ui.life.bmi.yourBmi') }}</div>
        <div class="text-5xl font-bold font-mono mt-1" :class="statusColor">{{ bmi }}</div>
        <div class="text-sm mt-1 flex items-center justify-center gap-1" :class="statusColor">
          <component :is="statusIcon" class="w-4 h-4" />
          {{ statusText }}
        </div>
      </div>
      <div class="space-y-1">
        <div v-for="r in ranges" :key="r.labelKey" class="flex items-center gap-3 text-xs">
          <div class="w-28 text-slate-500">{{ $t('ui.life.bmi.' + r.labelKey) }}</div>
          <div class="flex-1 h-4 rounded-full" :style="{ background: `linear-gradient(to right, ${r.colors.join(', ')})` }">
            <div
              v-if="bmiVal >= r.min && bmiVal <= r.max"
              class="h-full w-0.5 bg-slate-900 rounded"
              :style="{ marginLeft: `calc(${((bmiVal - r.min) / (r.max - r.min)) * 100}% - 1px)` }"
            ></div>
          </div>
          <div class="w-16 text-right font-mono text-slate-500">{{ r.min }}-{{ r.max }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const weight = ref(70)
const height = ref(175)

const bmiVal = computed(() => {
  const m = height.value / 100
  if (!m) return 0
  return weight.value / (m * m)
})
const bmi = computed(() => bmiVal.value.toFixed(1))

const ranges = [
  { labelKey: 'rangeUnder', min: 0, max: 18.5, colors: ['#93c5fd', '#93c5fd'] },
  { labelKey: 'rangeNormal', min: 18.5, max: 24, colors: ['#86efac', '#86efac'] },
  { labelKey: 'rangeOver', min: 24, max: 28, colors: ['#fde047', '#fde047'] },
  { labelKey: 'rangeObese', min: 28, max: 40, colors: ['#fca5a5', '#fca5a5'] },
]

const statusCode = computed(() => {
  const v = bmiVal.value
  if (v < 18.5) return 'under'
  if (v < 24) return 'normal'
  if (v < 28) return 'over'
  return 'obese'
})
const statusText = computed(() => t('ui.life.bmi.range' + statusCode.value.charAt(0).toUpperCase() + statusCode.value.slice(1)))
const statusColor = computed(() => {
  const c = statusCode.value
  return c === 'normal' ? 'text-green-600' : c === 'under' ? 'text-blue-500' : c === 'over' ? 'text-yellow-600' : 'text-red-500'
})
const statusIcon = computed(() => {
  const c = statusCode.value
  if (c === 'normal') return icons.CheckCircle
  if (c === 'under') return icons.TrendingDown
  return icons.TrendingUp
})
</script>
