<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Builder -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">Cron 表达式</h3>
      <div class="flex items-center gap-1">
        <input
          v-model="expr"
          class="flex-1 h-11 px-3 text-lg rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <CopyButton :text="expr" label="复制" />
      </div>

      <div class="text-xs text-slate-500 space-y-1">
        <div>格式: 分 时 日 月 周</div>
        <div>示例: 0 * * * * = 每小时整点执行</div>
      </div>

      <!-- Quick presets -->
      <div>
        <div class="text-xs text-slate-500 mb-1">快速预设</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button v-for="p in presets" :key="p.expr" @click="expr = p.expr" class="text-xs px-2 py-1.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-left">
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Parser result -->
      <div v-if="parseError" class="text-sm text-red-500">⚠️ {{ parseError }}</div>
    </section>

    <!-- Next runs + parser -->
    <section class="lg:col-span-2 space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">自然语言描述</h3>
        <div class="p-3 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-900">{{ humanDesc || '输入有效 Cron 表达式查看描述' }}</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">接下来 5 次执行时间</h3>
        <div class="space-y-1.5">
          <div
            v-for="(t, i) in nextRuns"
            :key="i"
            class="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 text-sm"
          >
            <span class="font-mono text-slate-700">{{ t }}</span>
            <span class="text-xs text-slate-400">#{{ i + 1 }}</span>
          </div>
          <div v-if="!nextRuns.length" class="py-6 text-center text-slate-400 text-sm">等待输入...</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { parseExpression } from 'cron-parser'

const expr = ref('0 0 * * *')
const parseError = ref('')
const humanDesc = ref('')
const nextRuns = ref<string[]>([])

const presets = [
  { expr: '* * * * *', label: '每分钟' },
  { expr: '*/5 * * * *', label: '每 5 分钟' },
  { expr: '0 * * * *', label: '每小时' },
  { expr: '0 */2 * * *', label: '每 2 小时' },
  { expr: '0 0 * * *', label: '每天 0 点' },
  { expr: '0 8 * * 1-5', label: '工作日 8 点' },
  { expr: '0 0 * * 0', label: '每周日 0 点' },
  { expr: '0 0 1 * *', label: '每月 1 号 0 点' },
]

const weekMap = ['日', '一', '二', '三', '四', '五', '六']

function describeParts(parts: string[]) {
  if (parts.length !== 5) return 'Cron 表达式应由 5 部分组成（分 时 日 月 周）'
  const [min, hr, dom, mon, dow] = parts
  let desc: string[] = []

  // 分钟
  if (min === '*') {
    if (hr !== '*' || dom !== '*') {
      desc.push('每分钟')
    } else {
      desc.push('每分钟')
    }
  } else if (min.startsWith('*/')) {
    desc.push(`每 ${min.slice(2)} 分钟`)
  } else {
    desc.push(`${min} 分`)
  }

  // 小时
  if (hr !== '*' && !hr.includes('/')) {
    desc.push(`${hr} 点`)
  } else if (hr.startsWith('*/')) {
    desc.push(`每 ${hr.slice(2)} 小时`)
  }

  // 日
  if (dom !== '*') desc.push(`每月 ${dom} 日`)

  // 周
  if (dow !== '*') {
    if (dow.includes('-')) {
      const [a, b] = dow.split('-').map(Number)
      desc.push(`每 ${weekMap[a]} 至 ${weekMap[b]}`)
    } else {
      desc.push(`每 ${weekMap[Number(dow)]}`)
    }
  }

  // 月
  if (mon !== '*') desc.push(`${mon} 月`)

  return desc.join(' ')
}

watch(expr, () => {
  parseError.value = ''
  nextRuns.value = []
  humanDesc.value = ''
  const trimmed = expr.value.trim()
  if (!trimmed) return

  const parts = trimmed.split(/\s+/)
  if (parts.length !== 5) {
    parseError.value = 'Cron 表达式格式错误，应为 5 部分：分 时 日 月 周'
    return
  }

  humanDesc.value = describeParts(parts)

  try {
    const interval = parseExpression(trimmed)
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
