<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">科学计算器</h3>
      <span class="text-xs text-slate-400">支持常见数学函数与历史记录</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 主计算器 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">表达式输入</span>
          <button @click="expr = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <input
          v-model="expr"
          @keyup.enter="calc"
          placeholder="输入表达式，如 sin(30) + sqrt(16)"
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
          <button @click="expr = ''" class="flex-1 h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition">清空</button>
          <button
            @click="calc"
            :disabled="!expr.trim()"
            class="flex-1 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Calculator" class="w-4 h-4" />
            计算 (Enter)
          </button>
        </div>
      </div>

      <!-- 历史记录 + 帮助 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <span class="text-xs font-medium text-slate-500">历史记录</span>
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
        <div v-else class="py-4 text-center text-xs text-slate-400">暂无历史</div>

        <div class="pt-3 border-t border-slate-100">
          <span class="text-xs font-medium text-slate-500">支持的函数 / 常量</span>
          <div class="text-xs text-slate-500 space-y-1 font-mono mt-2">
            <div>sin / cos / tan / asin / acos / atan</div>
            <div>log / log10 / sqrt / abs / pow / exp</div>
            <div>ceil / floor / round</div>
            <div>PI / E</div>
            <div>使用 `deg()` 将角度转弧度，如 sin(deg(30))</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

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
      error.value = '计算结果无效'
    }
  } catch (err: any) {
    error.value = '表达式错误: ' + (err?.message || '')
  }
}
</script>
