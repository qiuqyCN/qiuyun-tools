<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Calculator -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <input
        v-model="expr"
        @keyup.enter="calc"
        placeholder="输入表达式，如 sin(30) + sqrt(16)"
        class="w-full h-12 px-4 text-lg rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 text-right">
        <div v-if="result !== null" class="text-3xl font-bold text-indigo-600 font-mono">{{ result }}</div>
        <div v-else-if="error" class="text-sm text-red-500">{{ error }}</div>
      </div>
      <div class="mt-4 grid grid-cols-5 gap-2">
        <button v-for="btn in buttons" :key="btn" @click="insert(btn)" class="h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition font-mono">
          {{ btn }}
        </button>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="expr = ''" class="flex-1 h-10 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 transition">清空</button>
        <button @click="calc" class="flex-1 h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">计算 (Enter)</button>
      </div>
    </section>

    <!-- History & Cheat Sheet -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">历史记录</h3>
      <div v-if="history.length" class="space-y-1.5 max-h-52 overflow-auto">
        <div
          v-for="(h, i) in history"
          :key="i"
          @click="expr = h.expr"
          class="p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-mono"
        >
          <div class="text-slate-500">{{ h.expr }}</div>
          <div class="text-indigo-600 font-semibold">= {{ h.result }}</div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-xs text-slate-400">暂无历史</div>

      <h3 class="text-sm font-semibold text-slate-700 mt-5 mb-2">支持的函数 / 常量</h3>
      <div class="text-xs text-slate-500 space-y-1 font-mono">
        <div>sin / cos / tan / asin / acos / atan</div>
        <div>log / log10 / sqrt / abs / pow / exp</div>
        <div>ceil / floor / round</div>
        <div>PI / E</div>
        <div>使用 `deg()` 将角度转弧度，如 sin(deg(30))</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
