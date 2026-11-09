<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.life/date-calc.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.life.date-calc.pageDesc') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Diff -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.date-calc.diffTitle') }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.date-calc.startDateLabel') }}</label>
            <input v-model="start1" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.date-calc.endDateLabel') }}</label>
            <input v-model="end1" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
          </div>
        </div>
        <div class="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-100">
          <div class="text-3xl font-bold text-indigo-600 font-mono">{{ diffDays }}</div>
          <div class="text-xs text-slate-500 mt-1">{{ diffSummary }}</div>
        </div>
      </div>

      <!-- Add/Subtract -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.date-calc.addSubTitle') }}</span>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.date-calc.baseDateLabel') }}</label>
          <input v-model="baseDate" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="op" class="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="+">+</option>
            <option value="-">-</option>
          </select>
          <input v-model.number="num" type="number" class="w-24 h-10 px-3 rounded-lg border border-slate-200 font-mono" />
          <select v-model="unit" class="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
            <option value="day">{{ $t('ui.life.date-calc.unitDay') }}</option>
            <option value="week">{{ $t('ui.life.date-calc.unitWeek') }}</option>
            <option value="month">{{ $t('ui.life.date-calc.unitMonth') }}</option>
            <option value="year">{{ $t('ui.life.date-calc.unitYear') }}</option>
          </select>
        </div>
        <div class="p-4 bg-indigo-50 rounded-lg text-center border border-indigo-100">
          <div class="text-xl font-bold text-indigo-600 font-mono">{{ addResult }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const today = () => new Date().toISOString().slice(0, 10)
const start1 = ref(today())
const end1 = ref(() => {
  const d = new Date(); d.setDate(d.getDate() + 100); return d.toISOString().slice(0, 10)
})
const baseDate = ref(today())
const op = ref<'+' | '-'>('+')
const num = ref(30)
const unit = ref<'day' | 'week' | 'month' | 'year'>('day')

const diffDays = computed(() => {
  const d1 = new Date(start1.value), d2 = new Date(end1.value)
  return Math.round((d2.getTime() - d1.getTime()) / 86400000)
})
const diffWeeks = computed(() => (diffDays.value / 7).toFixed(1))

const diffSummary = computed(() =>
  t('ui.life.date-calc.diffSummary', { weeks: diffWeeks.value, hours: diffDays.value * 24 }),
)

const addResult = computed(() => {
  const d = new Date(baseDate.value)
  const n = op.value === '+' ? num.value : -num.value
  if (unit.value === 'day') d.setDate(d.getDate() + n)
  else if (unit.value === 'week') d.setDate(d.getDate() + n * 7)
  else if (unit.value === 'month') d.setMonth(d.getMonth() + n)
  else d.setFullYear(d.getFullYear() + n)
  return d.toISOString().slice(0, 10)
})
</script>
