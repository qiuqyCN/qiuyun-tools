<template>
  <div class="max-w-xl mx-auto space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">BMI 计算器</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">体重 (kg)</label>
          <input v-model.number="weight" type="number" step="0.1" class="w-full h-11 px-3 rounded-lg border border-slate-200 font-mono text-lg" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">身高 (cm)</label>
          <input v-model.number="height" type="number" class="w-full h-11 px-3 rounded-lg border border-slate-200 font-mono text-lg" />
        </div>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="text-center mb-5">
        <div class="text-xs text-slate-500">你的 BMI</div>
        <div class="text-5xl font-bold font-mono mt-1" :class="statusColor">{{ bmi }}</div>
        <div class="text-sm mt-1" :class="statusColor">{{ statusText }}</div>
      </div>
      <div class="space-y-1">
        <div v-for="r in ranges" :key="r.label" class="flex items-center gap-3 text-xs">
          <div class="w-28 text-slate-500">{{ r.label }}</div>
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
    </section>
  </div>
</template>

<script setup lang="ts">
const weight = ref(70)
const height = ref(175)

const bmiVal = computed(() => {
  const m = height.value / 100
  if (!m) return 0
  return weight.value / (m * m)
})
const bmi = computed(() => bmiVal.value.toFixed(1))

const ranges = [
  { label: '偏瘦', min: 0, max: 18.5, colors: ['#93c5fd', '#93c5fd'] },
  { label: '正常', min: 18.5, max: 24, colors: ['#86efac', '#86efac'] },
  { label: '偏胖', min: 24, max: 28, colors: ['#fde047', '#fde047'] },
  { label: '肥胖', min: 28, max: 40, colors: ['#fca5a5', '#fca5a5'] },
]

const statusText = computed(() => {
  const v = bmiVal.value
  if (v < 18.5) return '偏瘦'
  if (v < 24) return '正常'
  if (v < 28) return '偏胖'
  return '肥胖'
})
const statusColor = computed(() => {
  const t = statusText.value
  return t === '正常' ? 'text-green-600' : t === '偏瘦' ? 'text-blue-500' : t === '偏胖' ? 'text-yellow-600' : 'text-red-500'
})
</script>
