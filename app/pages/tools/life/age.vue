<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.life/age.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.life.age.pageDesc') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.age.birthLabel') }}</span>
        <button @click="birthday = '2000-01-01'" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
      </div>
      <input v-model="birthday" type="date" class="w-full h-11 px-3 rounded-lg border border-slate-200 text-lg" />
    </div>

    <div class="bg-white rounded-xl p-5 border border-slate-200 mt-4">
      <div class="text-center py-2">
        <div class="text-5xl font-bold text-indigo-600 font-mono">{{ age.years }}</div>
        <div class="text-sm text-slate-500 mt-1">{{ $t('ui.life.age.unitYears') }}</div>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center pt-4 border-t border-slate-100">
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.months }}</div>
          <div class="text-xs text-slate-400">{{ $t('ui.life.age.unitMonths') }}</div>
        </div>
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.days }}</div>
          <div class="text-xs text-slate-400">{{ $t('ui.life.age.unitDays') }}</div>
        </div>
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.totalDays }}</div>
          <div class="text-xs text-slate-400">{{ $t('ui.life.age.totalDaysLabel') }}</div>
        </div>
      </div>
      <div class="text-center text-xs text-slate-500 pt-2">
        {{ elapsedLine }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const birthday = ref('2000-01-01')

const age = computed(() => {
  const birth = new Date(birthday.value)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()
  if (days < 0) {
    months -= 1
    const prev = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) { months += 12; years -= 1 }
  const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000)
  return { years, months, days, totalDays, totalHours: totalDays * 24, totalMinutes: totalDays * 1440 }
})

const elapsedLine = computed(() =>
  t('ui.life.age.elapsedLine', {
    hours: age.value.totalHours.toLocaleString(),
    minutes: age.value.totalMinutes.toLocaleString(),
  }),
)
</script>
