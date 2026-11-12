<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 主计算器 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.sci-calc.inputLabel') }}</span>
          <button @click="expr = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
        </div>
        <input
          v-model="expr"
          @keyup.enter="calc"
          :placeholder="$t('ui.number.sci-calc.placeholder')"
          class="w-full h-12 px-4 text-lg rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="text-right">
          <div v-if="result !== null" class="text-3xl font-bold text-indigo-600 font-mono">{{ result }}</div>
          <div v-else-if="error" class="text-sm text-red-500 flex items-center justify-end gap-1.5">
            <component :is="icons.AlertCircle" class="w-4 h-4" />
            {{ error }}
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button v-for="btn in buttons" :key="btn" @click="insert(btn)" class="h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition font-mono">
            {{ btn }}
          </button>
        </div>
        <div class="flex gap-2">
          <button @click="expr = ''" class="flex-1 h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition">{{ $t('common.clear') }}</button>
          <button
            @click="calc"
            :disabled="!expr.trim()"
            class="flex-1 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Calculator" class="w-4 h-4" />
            {{ $t('ui.number.sci-calc.btnCalc') }}
          </button>
        </div>
      </div>

      <!-- 历史记录 + 帮助 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.sci-calc.historyLabel') }}</span>
        <div v-if="history.length" class="space-y-1.5 max-h-48 overflow-auto">
          <div
            v-for="(h, i) in history"
            :key="i"
            @click="expr = h.expr"
            class="p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-mono transition"
          >
            <div class="text-slate-500">{{ h.expr }}</div>
            <div class="text-indigo-600 font-semibold">= {{ h.result }}</div>
          </div>
        </div>
        <div v-else class="py-4 text-center text-xs text-slate-400">{{ $t('ui.number.sci-calc.emptyHistory') }}</div>

        <div class="pt-3 border-t border-slate-100">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.sci-calc.functionsLabel') }}</span>
          <div class="text-xs text-slate-500 space-y-1 font-mono mt-2">
            <div>sin / cos / tan / asin / acos / atan</div>
            <div>log / log10 / sqrt / abs / pow / exp</div>
            <div>ceil / floor / round</div>
            <div>PI / E</div>
            <div>{{ $t('ui.number.sci-calc.degHint') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const example = `sin(deg(30)) + sqrt(16) * 2`

const expr = ref('')
const result = ref<number | null>(null)
const error = ref('')
const history = ref<{ expr: string; result: string }[]>([])
const buttons = ['+', '-', '*', '/', '(', ')', '^', '.', 'sin(', 'cos(', 'sqrt(', 'log(', 'PI', 'E', 'deg(', 'abs(', 'pow(', '%', '0', '=']

function insert(s: string) {
  expr.value += s
}

function deg(d: number) { return d * Math.PI / 180 }

function calc() {
  error.value = ''
  result.value = null
  const e = expr.value.trim()
  if (!e) return

  // 安全的表达式求值器
  const sandbox: Record<string, any> = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    log: Math.log, log10: Math.log10, sqrt: Math.sqrt,
    abs: Math.abs, pow: Math.pow, exp: Math.exp,
    ceil: Math.ceil, floor: Math.floor, round: Math.round,
    PI: Math.PI, E: Math.E, deg,
  }

  try {
    // 替换 ^ 为 **，% 保留为取模
    const processed = e.replace(/\^/g, '**')
    // eslint-disable-next-line no-new-func
    const fn = new Function(...Object.keys(sandbox), `return ${processed}`)
    const r = fn(...Object.values(sandbox))
    if (typeof r === 'number' && !isNaN(r)) {
      result.value = Math.round(r * 1e12) / 1e12
      history.value.unshift({ expr: e, result: String(result.value) })
      if (history.value.length > 10) history.value.pop()
    } else {
      error.value = t('ui.number.sci-calc.errInvalidResult')
    }
  } catch (err: any) {
    error.value = t('ui.number.sci-calc.errExpression', { error: err?.message || '' })
  }
}
</script>
