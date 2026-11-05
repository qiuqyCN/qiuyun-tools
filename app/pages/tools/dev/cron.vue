<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">Cron 生成与解析</h3>
      <span class="text-xs text-slate-400">支持 Linux 和 Spring/Quartz 两种格式</span>
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
        当前表达式为 {{ detectedFields }} 字段，与所选模式不符
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Builder -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-slate-500">Cron 表达式</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="mode === 'linux' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'">
              {{ mode === 'linux' ? '5 字段' : '6 字段' }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <input
              v-model="expr"
              class="flex-1 h-11 px-3 text-lg rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
            <CopyButton :text="expr" label="复制" />
          </div>
        </div>

        <!-- 使用说明 -->
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
          <div class="flex items-center gap-1 text-xs font-medium text-slate-600">
            <component :is="icons.BookOpen" class="w-3.5 h-3.5" />
            使用说明
          </div>
          <pre class="text-[11px] text-slate-500 font-mono leading-relaxed whitespace-pre-wrap">{{ usageText }}</pre>
        </div>

        <!-- 快速预设 -->
        <div>
          <div class="text-xs font-medium text-slate-500 mb-2">快速预设</div>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="p in presets"
              :key="p.expr"
              @click="expr = p.expr"
              class="text-xs px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition text-left"
            >
              {{ p.label }}
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
            <span class="text-xs font-medium text-slate-500">自然语言描述</span>
          </div>
          <div class="p-3 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-900 min-h-[40px] flex items-center">
            {{ humanDesc || '输入有效 Cron 表达式查看描述' }}
          </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <component :is="icons.Clock" class="w-4 h-4 text-indigo-400" />
            <span class="text-xs font-medium text-slate-500">接下来 5 次执行时间</span>
          </div>
          <div class="space-y-1.5">
            <div
              v-for="(t, i) in nextRuns"
              :key="i"
              class="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 text-sm border border-slate-100"
            >
              <span class="font-mono text-slate-700">{{ t }}</span>
              <span class="text-xs text-slate-400 font-medium">#{{ i + 1 }}</span>
            </div>
            <div v-if="!nextRuns.length" class="py-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1">
              <component :is="icons.CalendarClock" class="w-6 h-6 text-slate-300" />
              等待输入有效表达式...
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

const mode = ref<'linux' | 'spring'>('linux')
const expr = ref('0 0 * * *')
const parseError = ref('')
const humanDesc = ref('')
const nextRuns = ref<string[]>([])

const presetsLinux = [
  { expr: '* * * * *', label: '每分钟' },
  { expr: '*/5 * * * *', label: '每 5 分钟' },
  { expr: '0 * * * *', label: '每小时整点' },
  { expr: '0 */2 * * *', label: '每 2 小时' },
  { expr: '0 0 * * *', label: '每天 0 点' },
  { expr: '0 8 * * 1-5', label: '工作日 8 点' },
  { expr: '0 0 * * 0', label: '每周日 0 点' },
  { expr: '0 0 1 * *', label: '每月 1 号 0 点' },
]
const presetsSpring = [
  { expr: '* * * * * *', label: '每秒' },
  { expr: '*/5 * * * * *', label: '每 5 秒' },
  { expr: '0 * * * * *', label: '每分钟整点' },
  { expr: '0 0 * * * *', label: '每小时整点' },
  { expr: '0 0 0 * * *', label: '每天 0 点' },
  { expr: '0 0 8 * * MON-FRI', label: '工作日 8 点' },
  { expr: '0 0 0 * * SUN', label: '每周日 0 点' },
  { expr: '0 0 0 1 * *', label: '每月 1 号 0 点' },
]

const presets = computed(() => (mode.value === 'linux' ? presetsLinux : presetsSpring))

const usageText = computed(() => mode.value === 'linux'
  ? `格式: 分 时 日 月 周
分: 0-59   时: 0-23
日: 1-31   月: 1-12
周: 0-7 (0和7=周日, 1=周一)
支持: *  数字  */n  1-5  1,3,5`
  : `格式: 秒 分 时 日 月 周
秒: 0-59   分: 0-59   时: 0-23
日: 1-31   月: 1-12
周: 1-7 (1=周一, 7=周日) 或 MON-SUN
支持: *  数字  */n  1-5  1,3,5`
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
function dowToText(dow: string, spring: boolean): string {
  if (dow === '*') return ''
  const map: Record<string, string> = spring
    ? { '0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'日',
        'MON':'一','TUE':'二','WED':'三','THU':'四','FRI':'五','SAT':'六','SUN':'日' }
    : { '0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'日' }
  if (dow.includes(',')) return '每' + dow.split(',').map(d => map[d.toUpperCase()] || map[d] || d).join('、')
  if (dow.includes('-')) {
    const [a, b] = dow.split('-')
    return `每${map[a.toUpperCase()] || map[a] || a}至${map[b.toUpperCase()] || map[b] || b}`
  }
  return '每' + (map[dow.toUpperCase()] || map[dow] || dow)
}

function describeParts(parts: string[]): string {
  const spring = parts.length === 6
  const sec = spring ? parts[0] : undefined
  const [min, hr, dom, mon, dow] = spring ? parts.slice(1) : parts
  const desc: string[] = []

  if (spring && sec !== '*') {
    if (sec.startsWith('*/')) desc.push(`每 ${sec.slice(2)} 秒`)
    else desc.push(`${sec} 秒`)
  }

  if (min === '*') {
    if (spring && sec === '*') desc.push('每秒')
    else if (!spring || sec !== '*') desc.push('每分钟')
  } else if (min.startsWith('*/')) {
    desc.push(`每 ${min.slice(2)} 分钟`)
  } else {
    desc.push(`${min} 分`)
  }

  if (hr !== '*') {
    if (hr.startsWith('*/')) desc.push(`每 ${hr.slice(2)} 小时`)
    else desc.push(`${hr} 点`)
  }

  if (dom !== '*') desc.push(`每月 ${dom} 日`)

  const dowText = dowToText(dow, spring)
  if (dowText) desc.push(dowText)

  if (mon !== '*') desc.push(`${mon} 月`)

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
    parseError.value = `Cron 表达式应为 5（Linux）或 6（Spring）字段，当前 ${parts.length} 字段`
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
    parseError.value = e?.message || '无效的 Cron 表达式'
  }
}, { immediate: true })
</script>
