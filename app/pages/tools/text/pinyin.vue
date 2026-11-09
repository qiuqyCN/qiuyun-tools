<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.text/pinyin.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.text.pinyin.subtitle') }}</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.text.pinyin.inputLabel') }}</span>
          <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
        </div>
        <textarea
          v-model="input"
          :placeholder="$t('ui.text.pinyin.placeholder')"
          class="w-full h-[260px] p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <label class="flex items-center gap-1">
            <input v-model="toneType" type="radio" value="symbol" name="tone" class="rounded" />{{ $t('ui.text.pinyin.toneSymbol') }}
          </label>
          <label class="flex items-center gap-1">
            <input v-model="toneType" type="radio" value="num" name="tone" class="rounded" />{{ $t('ui.text.pinyin.toneNumber') }}
          </label>
          <label class="flex items-center gap-1">
            <input v-model="toneType" type="radio" value="none" name="tone" class="rounded" />{{ $t('ui.text.pinyin.toneNone') }}
          </label>
          <label class="flex items-center gap-1">
            <input v-model="pinyinAll" type="checkbox" class="rounded" />{{ $t('ui.text.pinyin.convertNonChinese') }}
          </label>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="output" :label="$t('common.copy')" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.text.pinyin.outputLabel') }}</span>
        </div>
        <template v-if="output">
          <pre class="w-full p-3 bg-slate-50 rounded-lg text-sm whitespace-pre-wrap overflow-auto border border-slate-100">{{ output }}</pre>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-slate-500">{{ $t('ui.text.pinyin.initialsLabel') }}</span>
              <CopyButton :text="initials" :label="$t('common.copy')" />
            </div>
            <pre class="p-3 bg-indigo-50 rounded-lg text-sm font-mono text-indigo-700 whitespace-pre-wrap border border-indigo-100">{{ initials }}</pre>
          </div>
        </template>
        <div
          v-else
          class="w-full h-[260px] rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.Languages" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.text.pinyin.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { pinyin } from 'pinyin-pro'

const { t } = useI18n()

const example = computed(() => t('ui.text.pinyin.exampleText'))

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
