<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">汉字转拼音</h3>
      <span class="text-xs text-slate-400">支持带声调 / 数字声调 / 无声调</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">输入中文</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 示例</button>
        </div>
        <textarea
          v-model="input"
          placeholder="输入中文字符..."
          class="w-full h-[260px] p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="output" label="复制" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >清空</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">拼音结果</span>
        </div>
        <template v-if="output">
          <pre class="w-full p-3 bg-slate-50 rounded-lg text-sm whitespace-pre-wrap overflow-auto border border-slate-100">{{ output }}</pre>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-slate-500">首字母</span>
              <CopyButton :text="initials" label="复制" />
            </div>
            <pre class="p-3 bg-indigo-50 rounded-lg text-sm font-mono text-indigo-700 whitespace-pre-wrap border border-indigo-100">{{ initials }}</pre>
          </div>
        </template>
        <div
          v-else
          class="w-full h-[260px] rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.Languages" class="w-8 h-8 text-slate-300" />
          <span>在左侧输入中文，拼音将实时生成</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { pinyin } from 'pinyin-pro'

const example = `你好世界，欢迎使用秋雨工具！\nHello Qiuyun Tools，这是一个开发者工具箱。`

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
