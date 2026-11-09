<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.life/mortgage.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.life.mortgage.pageDesc') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.mortgage.paramsLabel') }}</span>
        <button @click="loadExample" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.amountLabel') }}</label>
          <input v-model.number="amount" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.rateLabel') }}</label>
          <input v-model.number="rate" type="number" step="0.01" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.yearsLabel') }}</label>
          <input v-model.number="years" type="number" class="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.methodLabel') }}</label>
          <select v-model="method" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white">
            <option value="equal">{{ $t('ui.life.mortgage.methodEqual') }}</option>
            <option value="principal">{{ $t('ui.life.mortgage.methodPrincipal') }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200 mt-4">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.mortgage.resultTitle') }}</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div class="text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.monthlyPaymentLabel') }}</div>
          <div class="text-lg font-bold text-indigo-600 font-mono">{{ fmt(monthlyPayment) }}</div>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.totalInterestLabel') }}</div>
          <div class="text-lg font-bold text-slate-700 font-mono">{{ fmt(totalInterest) }}</div>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.totalPaymentLabel') }}</div>
          <div class="text-lg font-bold text-slate-700 font-mono">{{ fmt(totalPayment) }}</div>
        </div>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="text-xs text-slate-500 mb-1">{{ $t('ui.life.mortgage.monthsLabel') }}</div>
          <div class="text-lg font-bold text-slate-700 font-mono">{{ monthsText }}</div>
        </div>
      </div>
      <div v-if="method === 'principal'" class="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
        <component :is="icons.Info" class="w-3.5 h-3.5" />
        {{ principalNote }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

function loadExample() {
  amount.value = 100
  rate.value = 3.45
  years.value = 30
}

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

function fmt(v: number) { return t('ui.life.mortgage.moneyValue', { v: v.toFixed(2) }) }

const monthsText = computed(() => t('ui.life.mortgage.monthsValue', { n: months.value }))
const principalNote = computed(() =>
  t('ui.life.mortgage.principalNote', { first: fmt(firstMonth.value), last: fmt(lastMonth.value) }),
)
</script>
