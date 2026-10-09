<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Diff -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">日期差值计算</h3>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-slate-500 mb-1">开始日期</label>
          <input v-model="start1" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">结束日期</label>
          <input v-model="end1" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
      </div>
      <div class="p-3 bg-indigo-50 rounded-lg text-center">
        <div class="text-3xl font-bold text-indigo-600 font-mono">{{ diffDays }}</div>
        <div class="text-xs text-slate-500 mt-1">天 {{ diffWeeks }} 周 / {{ diffDays * 24 }} 小时</div>
      </div>
    </section>

    <!-- Add/Subtract -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">日期加减</h3>
      <div>
        <label class="block text-xs text-slate-500 mb-1">基准日期</label>
        <input v-model="baseDate" type="date" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
      </div>
      <div class="flex items-center gap-2">
        <select v-model="op" class="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
        <input v-model.number="num" type="number" class="w-24 h-10 px-3 rounded-lg border border-slate-200 font-mono" />
        <select v-model="unit" class="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
          <option value="day">天</option>
          <option value="week">周</option>
          <option value="month">月</option>
          <option value="year">年</option>
        </select>
      </div>
      <div class="p-3 bg-indigo-50 rounded-lg text-center">
        <div class="text-xl font-bold text-indigo-600 font-mono">{{ addResult }}</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
