<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.life/countdown.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.life.countdown.pageDesc') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.life.countdown.addSectionLabel') }}</span>
        <span class="text-[11px] text-slate-400">{{ $t('ui.life.countdown.addSectionHint') }}</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.countdown.targetNameLabel') }}</label>
          <input v-model="name" :placeholder="$t('ui.life.countdown.targetNamePlaceholder')" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.life.countdown.targetTimeLabel') }}</label>
          <input v-model="target" type="datetime-local" class="w-full h-10 px-3 rounded-lg border border-slate-200" />
        </div>
      </div>
      <button
        v-if="preset === 'custom'"
        @click="add"
        class="mt-3 w-full h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
      >
        <component :is="icons.CalendarPlus" class="w-4 h-4" />
        {{ $t('ui.life.countdown.btnAdd') }}
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
          <div><div class="text-xs opacity-70">{{ $t('ui.life.countdown.unitDay') }}</div><div class="font-semibold">{{ it.days }}</div></div>
          <div><div class="text-xs opacity-70">{{ $t('ui.life.countdown.unitHour') }}</div><div class="font-semibold">{{ it.hours }}</div></div>
          <div><div class="text-xs opacity-70">{{ $t('ui.life.countdown.unitMinute') }}</div><div class="font-semibold">{{ it.minutes }}</div></div>
          <div><div class="text-xs opacity-70">{{ $t('ui.life.countdown.unitSecond') }}</div><div class="font-semibold">{{ it.seconds }}</div></div>
        </div>
      </div>
    </div>
    <div v-if="!items.length" class="bg-white rounded-xl p-12 border border-slate-200 text-center text-slate-400 text-xs flex flex-col items-center gap-2 mt-4">
      <component :is="icons.CalendarClock" class="w-8 h-8 text-slate-300" />
      <span>{{ $t('ui.life.countdown.emptyHint') }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const name = ref(t('ui.life.countdown.defaultName'))
const target = ref('2027-01-01T00:00')
const preset = ref('custom')

interface Item { name: string; target: number; diff: number; days: number; hours: number; minutes: number; seconds: number }
const items = ref<Item[]>([])

function add() {
  const t0 = new Date(target.value).getTime()
  if (isNaN(t0)) return
  items.value.push({ name: name.value || t('ui.life.countdown.fallbackName'), target: t0, diff: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
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
  if (diff <= 0) return t('ui.life.countdown.expired')
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  return t('ui.life.countdown.formatDaysHours', { d, h: String(h).padStart(2, '0') })
}

onMounted(() => { update(); setInterval(update, 1000) })
</script>
