<template>
  <div class="max-w-xl mx-auto space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">年龄计算器</h3>
      <label class="block text-xs text-slate-500 mb-1">出生日期</label>
      <input v-model="birthday" type="date" class="w-full h-11 px-3 rounded-lg border border-slate-200 text-lg" />
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div class="text-center py-2">
        <div class="text-5xl font-bold text-indigo-600 font-mono">{{ age.years }}</div>
        <div class="text-sm text-slate-500 mt-1">岁</div>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center pt-4 border-t border-slate-100">
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.months }}</div>
          <div class="text-xs text-slate-400">月</div>
        </div>
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.days }}</div>
          <div class="text-xs text-slate-400">天</div>
        </div>
        <div>
          <div class="text-2xl font-bold font-mono text-slate-700">{{ age.totalDays }}</div>
          <div class="text-xs text-slate-400">总天数</div>
        </div>
      </div>
      <div class="text-center text-xs text-slate-500 pt-2">
        已度过 {{ age.totalHours.toLocaleString() }} 小时 · {{ age.totalMinutes.toLocaleString() }} 分钟
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
</script>
