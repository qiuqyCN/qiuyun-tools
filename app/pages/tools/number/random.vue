<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">随机数生成</h3>
      <span class="text-xs text-slate-400">支持整数 / 小数 / 不重复整数生成</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">最小值</label>
          <input
            v-model.number="min"
            type="number"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">最大值</label>
          <input
            v-model.number="max"
            type="number"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">数量</label>
          <input
            v-model.number="count"
            type="number"
            min="1"
            max="10000"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">类型</label>
          <select
            v-model="type"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
          >
            <option value="int">整数</option>
            <option value="float">小数</option>
            <option value="int-unique">整数（不重复）</option>
          </select>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="generate"
          class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
        >
          <component :is="icons.Dices" class="w-4 h-4" />
          生成随机数
        </button>
        <label v-if="type !== 'float'" class="flex items-center gap-1.5 text-xs text-slate-500">
          <input v-model="useCrypto" type="checkbox" class="rounded" />
          安全随机数（WebCrypto）
        </label>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200 mt-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-500">生成结果</span>
          <span v-if="result.length" class="text-[11px] text-slate-400">（{{ result.length }} 个）</span>
        </div>
        <CopyButton v-if="result.length" :text="result.join(', ')" label="复制全部" />
      </div>
      <div v-if="result.length" class="flex flex-wrap gap-2">
        <span
          v-for="(n, i) in result"
          :key="i"
          class="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs border border-indigo-100"
        >{{ n }}</span>
      </div>
      <div
        v-else
        class="py-12 text-center text-slate-400 flex flex-col items-center gap-2 text-xs"
      >
        <component :is="icons.Shuffle" class="w-8 h-8 text-slate-300" />
        <span>点击上方按钮生成随机数</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const min = ref(1)
const max = ref(100)
const count = ref(10)
const type = ref<'int' | 'float' | 'int-unique'>('int')
const useCrypto = ref(false)
const result = ref<number[]>([])

function randomInt(min: number, max: number): number {
  const range = max - min + 1
  if (useCrypto.value && globalThis.crypto?.getRandomValues) {
    const arr = new Uint32Array(1)
    globalThis.crypto.getRandomValues(arr)
    return min + (arr[0] % range)
  }
  return Math.floor(Math.random() * range) + min
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function generate() {
  const lo = Math.min(min.value, max.value)
  const hi = Math.max(min.value, max.value)
  const cnt = Math.max(1, Math.min(count.value, 10000))

  if (type.value === 'int-unique') {
    const range = hi - lo + 1
    if (cnt > range) {
      result.value = []
      alert(`范围只有 ${range} 个整数，无法生成 ${cnt} 个不重复数`)
      return
    }
    const pool = Array.from({ length: range }, (_, i) => lo + i)
    // Fisher-Yates
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    result.value = pool.slice(0, cnt)
  } else if (type.value === 'float') {
    result.value = Array.from({ length: cnt }, () => +randomFloat(lo, hi).toFixed(6))
  } else {
    result.value = Array.from({ length: cnt }, () => randomInt(lo, hi))
  }
}
</script>
