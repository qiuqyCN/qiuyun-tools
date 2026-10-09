<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">输入中文</h3>
      <textarea
        v-model="input"
        placeholder="输入中文字符..."
        class="w-full h-52 p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <label class="flex items-center gap-1">
          <input v-model="toneType" type="radio" value="symbol" name="tone" class="rounded" />带声调
        </label>
        <label class="flex items-center gap-1">
          <input v-model="toneType" type="radio" value="num" name="tone" class="rounded" />数字声调
        </label>
        <label class="flex items-center gap-1">
          <input v-model="toneType" type="radio" value="none" name="tone" class="rounded" />无声调
        </label>
        <label class="flex items-center gap-1">
          <input v-model="pinyinAll" type="checkbox" class="rounded" />非中文转拼音
        </label>
      </div>
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">拼音结果</h3>
        <CopyButton :text="output" label="复制" />
      </div>
      <pre class="w-full h-52 p-3 bg-slate-50 rounded-lg text-sm whitespace-pre-wrap overflow-auto">{{ output || '等待输入...' }}</pre>
      <div class="mt-4">
        <h4 class="text-xs text-slate-500 mb-2">首字母</h4>
        <pre class="p-3 bg-indigo-50 rounded-lg text-sm font-mono text-indigo-700 whitespace-pre-wrap">{{ initials }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { pinyin } from 'pinyin-pro'

const input = ref('')
const toneType = ref<'symbol' | 'num' | 'none'>('symbol')
const pinyinAll = ref(false)

const output = computed(() => {
  if (!input.value) return ''
  const toneMap = { symbol: 'symbol', num: 'num', none: 'none' } as const
  return pinyin(input.value, { toneType: toneMap[toneType.value], nonZh: pinyinAll.value ? 'consecutive' : 'spaced' })
})

const initials = computed(() => {
  if (!input.value) return ''
  return pinyin(input.value, { pattern: 'first', toneType: 'none', nonZh: 'spaced' })
})
</script>
