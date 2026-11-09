<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.number/random.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.number.random.subtitle') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.number.random.minLabel') }}</label>
          <input
            v-model.number="min"
            type="number"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.number.random.maxLabel') }}</label>
          <input
            v-model.number="max"
            type="number"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.number.random.countLabel') }}</label>
          <input
            v-model.number="count"
            type="number"
            min="1"
            max="10000"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.number.random.typeLabel') }}</label>
          <select
            v-model="type"
            class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
          >
            <option value="int">{{ $t('ui.number.random.optInt') }}</option>
            <option value="float">{{ $t('ui.number.random.optFloat') }}</option>
            <option value="int-unique">{{ $t('ui.number.random.optIntUnique') }}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="generate"
          class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
        >
          <component :is="icons.Dices" class="w-4 h-4" />
          {{ $t('ui.number.random.btnGenerate') }}
        </button>
        <label v-if="type !== 'float'" class="flex items-center gap-1.5 text-xs text-slate-500">
          <input v-model="useCrypto" type="checkbox" class="rounded" />
          {{ $t('ui.number.random.secureRandom') }}
        </label>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200 mt-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.number.random.resultLabel') }}</span>
          <span v-if="result.length" class="text-[11px] text-slate-400">{{ $t('ui.number.random.resultCount', { count: result.length }) }}</span>
        </div>
        <CopyButton v-if="result.length" :text="result.join(', ')" :label="$t('ui.number.random.copyAll')" />
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
        <span>{{ $t('ui.number.random.emptyHint') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

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
      alert(t('ui.number.random.errRange', { range, count: cnt }))
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
