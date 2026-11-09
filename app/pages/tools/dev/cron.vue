<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.dev/cron.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.dev.cron.subtitle') }}</span>
    </div>

    <!-- 模式切换 -->
    <div class="flex items-center gap-1 mb-4">
      <button
        @click="switchMode('linux')"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition"
        :class="mode === 'linux' ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'"
      >
        Linux / Crontab
      </button>
      <button
        @click="switchMode('spring')"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition"
        :class="mode === 'spring' ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'"
      >
        Spring / Quartz
      </button>
      <span v-if="mismatch" class="ml-2 text-xs text-amber-600 flex items-center gap-1">
        <component :is="icons.AlertTriangle" class="w-3 h-3" />
        {{ $t('ui.dev.cron.mismatchHint', { n: detectedFields }) }}
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Builder -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.cron.exprLabel') }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="mode === 'linux' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'">
              {{ $t('ui.dev.cron.fieldCount', { n: mode === 'linux' ? 5 : 6 }) }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <input
              v-model="expr"
              class="flex-1 h-11 px-3 text-lg rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            <CopyButton :text="expr" :label="$t('common.copy')" />
          </div>
        </div>

        <!-- 使用说明 -->
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
          <div class="flex items-center gap-1 text-xs font-medium text-slate-600">
            <component :is="icons.BookOpen" class="w-3.5 h-3.5" />
            {{ $t('ui.dev.cron.usageTitle') }}
          </div>
          <pre class="text-[11px] text-slate-500 font-mono leading-relaxed whitespace-pre-wrap">{{ usageText }}</pre>
        </div>

        <!-- 快速预设 -->
        <div>
          <div class="text-xs font-medium text-slate-500 mb-2">{{ $t('ui.dev.cron.presetsTitle') }}</div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="p in presets"
              :key="p.expr"
              @click="expr = p.expr"
              class="text-xs px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition text-left"
            >
              {{ $t('ui.dev.cron.' + p.labelKey) }}
            </button>
          </div>
        </div>

        <div v-if="parseError" class="text-sm text-red-500 flex items-start gap-1.5 bg-red-50 p-2 rounded-lg border border-red-100">
          <component :is="icons.AlertCircle" class="w-4 h-4 shrink-0 mt-0.5" />
          <span>{{ parseError }}</span>
        </div>
      </div>

      <!-- 结果 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.MessageSquare" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.cron.humanDescLabel') }}</span>
          </div>
          <div class="p-3 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-900 min-h-[40px] flex items-center">
            {{ humanDesc || $t('ui.dev.cron.humanDescEmpty') }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.Clock" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.cron.nextRunsTitle', { n: 5 }) }}</span>
          </div>
          <div class="space-y-1.5">
            <div
              v-for="(run, i) in nextRuns"
              :key="i"
              class="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 text-sm border border-slate-100"
            >
              <span class="font-mono text-slate-700">{{ run }}</span>
              <span class="text-xs text-slate-400 font-medium">#{{ i + 1 }}</span>
            </div>
            <div v-if="!nextRuns.length" class="py-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
              <component :is="icons.CalendarClock" class="w-6 h-6 text-slate-300" />
              {{ $t('ui.dev.cron.nextRunsEmpty') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { CronExpressionParser } from 'cron-parser'

const { t } = useI18n()

const mode = ref<'linux' | 'spring'>('linux')
const expr = ref('0 0 * * *')
const parseError = ref('')
const humanDesc = ref('')
const nextRuns = ref<string[]>([])

const presetsLinux = [
  { expr: '* * * * *', labelKey: 'everyMinute' },
  { expr: '*/5 * * * *', labelKey: 'every5Min' },
  { expr: '0 * * * *', labelKey: 'hourly' },
  { expr: '0 */2 * * *', labelKey: 'every2Hours' },
  { expr: '0 0 * * *', labelKey: 'dailyMidnight' },
  { expr: '0 8 * * 1-5', labelKey: 'workday8' },
  { expr: '0 0 * * 0', labelKey: 'sundayMidnight' },
  { expr: '0 0 1 * *', labelKey: 'monthly1st' },
]
const presetsSpring = [
  { expr: '* * * * * *', labelKey: 'everySecond' },
  { expr: '*/5 * * * * *', labelKey: 'every5Sec' },
  { expr: '0 * * * * *', labelKey: 'everyMinuteSpring' },
  { expr: '0 0 * * * *', labelKey: 'hourly' },
  { expr: '0 0 0 * * *', labelKey: 'dailyMidnight' },
  { expr: '0 0 8 * * MON-FRI', labelKey: 'workday8' },
  { expr: '0 0 0 * * SUN', labelKey: 'sundayMidnight' },
  { expr: '0 0 0 1 * *', labelKey: 'monthly1st' },
]

const presets = computed(() => (mode.value === 'linux' ? presetsLinux : presetsSpring))

const usageText = computed(() => mode.value === 'linux'
  ? t('ui.dev.cron.usageLinux')
  : t('ui.dev.cron.usageSpring')
)

const detectedFields = computed(() => expr.value.trim().split(/\s+/).filter(Boolean).length)
const mismatch = computed(() => {
  const f = detectedFields.value
  return mode.value === 'linux' ? f === 6 : f === 5
})

function switchMode(m: 'linux' | 'spring') {
  mode.value = m
  // 切换时自动填入一个该格式的预设
  expr.value = m === 'linux' ? '0 0 * * *' : '0 0 0 * * *'
}

// Linux: 0/7=Sun, 1=Mon..6=Sat
// Spring: 1=Mon..7=Sun (also 0=Sun), MON-SUN
const dayKeysSpring: Record<string, string> = {
  '0': 'daySun', '1': 'dayMon', '2': 'dayTue', '3': 'dayWed', '4': 'dayThu', '5': 'dayFri', '6': 'daySat', '7': 'daySun',
  'MON': 'dayMon', 'TUE': 'dayTue', 'WED': 'dayWed', 'THU': 'dayThu', 'FRI': 'dayFri', 'SAT': 'daySat', 'SUN': 'daySun',
}
const dayKeysLinux: Record<string, string> = {
  '0': 'daySun', '1': 'dayMon', '2': 'dayTue', '3': 'dayWed', '4': 'dayThu', '5': 'dayFri', '6': 'daySat', '7': 'daySun',
}

function dowToText(dow: string, spring: boolean): string {
  if (dow === '*') return ''
  const map = spring ? dayKeysSpring : dayKeysLinux
  const dayName = (d: string) => {
    const key = map[d.toUpperCase()] || map[d]
    return key ? t('ui.dev.cron.' + key) : d
  }
  if (dow.includes(',')) {
    return t('ui.dev.cron.weekdayList', { list: dow.split(',').map(dayName).join(t('ui.dev.cron.weekdayListSeparator')) })
  }
  if (dow.includes('-')) {
    const [a, b] = dow.split('-')
    return t('ui.dev.cron.weekdayRange', { a: dayName(a), b: dayName(b) })
  }
  return t('ui.dev.cron.everyWeekday', { day: dayName(dow) })
}

function describeParts(parts: string[]): string {
  const spring = parts.length === 6
  const sec = spring ? parts[0] : undefined
  const [min, hr, dom, mon, dow] = spring ? parts.slice(1) : parts
  const desc: string[] = []

  if (spring && sec !== '*') {
    if (sec.startsWith('*/')) desc.push(t('ui.dev.cron.everyNSeconds', { n: sec.slice(2) }))
    else desc.push(t('ui.dev.cron.nSeconds', { n: sec }))
  }

  if (min === '*') {
    if (spring && sec === '*') desc.push(t('ui.dev.cron.everySecond'))
    else if (!spring || sec !== '*') desc.push(t('ui.dev.cron.everyMinute'))
  } else if (min.startsWith('*/')) {
    desc.push(t('ui.dev.cron.everyNMinutes', { n: min.slice(2) }))
  } else {
    desc.push(t('ui.dev.cron.nMinutes', { n: min }))
  }

  if (hr !== '*') {
    if (hr.startsWith('*/')) desc.push(t('ui.dev.cron.everyNHours', { n: hr.slice(2) }))
    else desc.push(t('ui.dev.cron.atHour', { n: hr }))
  }

  if (dom !== '*') desc.push(t('ui.dev.cron.everyMonthDay', { n: dom }))

  const dowText = dowToText(dow, spring)
  if (dowText) desc.push(dowText)

  if (mon !== '*') desc.push(t('ui.dev.cron.monthN', { n: mon }))

  return desc.join(' ')
}

watch(expr, () => {
  parseError.value = ''
  nextRuns.value = []
  humanDesc.value = ''
  const trimmed = expr.value.trim()
  if (!trimmed) return

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const spring = parts.length === 6
  if (parts.length !== 5 && parts.length !== 6) {
    parseError.value = t('ui.dev.cron.errFieldCount', { n: parts.length })
    return
  }

  humanDesc.value = describeParts(parts)

  try {
    // cron-parser v5 正确 API: CronExpressionParser.parse(expr, options)
    const interval = CronExpressionParser.parse(trimmed, { hasSeconds: spring } as any)
    const runs: string[] = []
    for (let i = 0; i < 5; i++) {
      const next = interval.next()
      runs.push(next.toDate().toLocaleString('zh-CN', { hour12: false }))
    }
    nextRuns.value = runs
  } catch (e: any) {
    parseError.value = e?.message || t('ui.dev.cron.errInvalid')
  }
}, { immediate: true })
</script>
