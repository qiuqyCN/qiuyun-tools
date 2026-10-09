<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">房贷计算器</h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="block text-xs text-slate-500 mb-1">贷款金额 (万元)</label>
          <input v-model.number="amount" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">年利率 (%)</label>
          <input v-model.number="rate" type="number" step="0.01" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">贷款年限 (年)</label>
          <input v-model.number="years" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">还款方式</label>
          <select v-model="method" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white">
            <option value="equal">等额本息</option>
            <option value="principal">等额本金</option>
          </select>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">计算结果</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <Stat label="月供" :value="fmt(monthlyPayment)" />
        <Stat label="总利息" :value="fmt(totalInterest)" />
        <Stat label="还款总额" :value="fmt(totalPayment)" />
        <Stat label="还款月数" :value="months + ' 月'" />
      </div>
      <div v-if="method === 'principal'" class="mt-4 text-xs text-slate-500">
        首月月供 {{ fmt(firstMonth) }}，末月月供 {{ fmt(lastMonth) }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const amount = ref(100)
const rate = ref(3.45)
const years = ref(30)
const method = ref<'equal' | 'principal'>('equal')

const principal = computed(() => amount.value * 10000)
const months = computed(() => years.value * 12)
const monthlyRate = computed(() => rate.value / 100 / 12)

const monthlyPayment = computed(() => {
  if (method.value === 'equal') {
    const m = monthlyRate.value
    const n = months.value
    if (m === 0) return principal.value / n
    return (principal.value * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1)
  } else {
    return firstMonth.value // 等额本金首月最高
  }
})

const firstMonth = computed(() => {
  const base = principal.value / months.value
  return base + principal.value * monthlyRate.value
})
const lastMonth = computed(() => {
  const base = principal.value / months.value
  return base + base * monthlyRate.value
})

const totalPayment = computed(() => {
  if (method.value === 'equal') return monthlyPayment.value * months.value
  // 等额本金求和
  let sum = 0
  const base = principal.value / months.value
  for (let i = 0; i < months.value; i++) {
    sum += base + (principal.value - base * i) * monthlyRate.value
  }
  return sum
})

const totalInterest = computed(() => totalPayment.value - principal.value)

function fmt(v: number) { return v.toFixed(2) + ' 元' }
</script>
