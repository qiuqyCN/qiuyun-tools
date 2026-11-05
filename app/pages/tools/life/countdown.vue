<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">倒计时工具</h3>
      <span class="text-xs text-slate-400">添加多个目标，实时倒计时</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-slate-500">添加倒计时目标</span>
        <span class="text-[11px] text-slate-400">支持同时追踪多个目标</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-slate-500 mb-1">目标名称</label>
          <input v-model="name" placeholder="新年 / 生日 / 考试..." class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">目标时间</label>
          <input v-model="target" type="datetime-local" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
      </div>
      <button
        v-if="preset === 'custom'"
        @click="add"
        class="mt-3 w-full h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
      >
        <component :is="icons.CalendarPlus" class="w-4 h-4" />
        添加倒计时
      </button>
    </div>

    <div class="mt-4 space-y-3">
      <div
        v-for="(it, idx) in items"
        :key="idx"
        class="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-6 text-white relative overflow-hidden shadow-sm"
      >
        <button @click="items.splice(idx, 1)" class="absolute top-2 right-2 text-white/60 hover:text-white text-lg leading-none">×</button>
        <div class="text-sm opacity-80">{{ it.name }}</div>
        <div class="mt-4 flex items-end gap-3">
          <div class="text-5xl font-bold font-mono">{{ format(it.diff) }}</div>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4 text-center">
          <div><div class="text-xs opacity-70">天</div><div class="font-semibold">{{ it.days }}</div></div>
          <div><div class="text-xs opacity-70">时</div><div class="font-semibold">{{ it.hours }}</div></div>
          <div><div class="text-xs opacity-70">分</div><div class="font-semibold">{{ it.minutes }}</div></div>
          <div><div class="text-xs opacity-70">秒</div><div class="font-semibold">{{ it.seconds }}</div></div>
        </div>
      </div>
    </div>
    <div v-if="!items.length" class="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs flex flex-col items-center gap-2 mt-4">
      <component :is="icons.CalendarClock" class="w-8 h-8 text-slate-300" />
      <span>添加你的第一个倒计时目标吧！</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const name = ref('新年倒计时')
const target = ref('2027-01-01T00:00')
const preset = ref('custom')

interface Item { name: string; target: number; diff: number; days: number; hours: number; minutes: number; seconds: number }
const items = ref<Item[]>([])

function add() {
  const t = new Date(target.value).getTime()
  if (isNaN(t)) return
  items.value.push({ name: name.value || '倒计时', target: t, diff: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
}

function update() {
  const now = Date.now()
  items.value.forEach(it => {
    it.diff = Math.max(0, it.target - now)
    it.days = Math.floor(it.diff / 86400000)
    it.hours = Math.floor((it.diff % 86400000) / 3600000)
    it.minutes = Math.floor((it.diff % 3600000) / 60000)
    it.seconds = Math.floor((it.diff % 60000) / 1000)
  })
}

function format(diff: number) {
  if (diff <= 0) return '已到期'
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  return d + ' 天 ' + String(h).padStart(2, '0') + ' 时'
}

onMounted(() => { update(); setInterval(update, 1000) })
</script>
