<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.md5.inputLabel') }}</span>
          <button @click="input = $t('ui.crypto.md5.example')" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
        </div>
        <textarea
          v-model="input"
          :placeholder="$t('ui.crypto.md5.inputPlaceholder')"
          class="w-full h-[260px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <CopyButton :text="result" :label="$t('ui.crypto.md5.btnCopyResult')" />
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.md5.resultLabel') }}</span>
        </div>
        <template v-if="result">
          <div class="space-y-3">
            <div>
              <div class="text-xs text-slate-400 mb-1">{{ $t('ui.crypto.md5.lower32') }}</div>
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400 mb-1">{{ $t('ui.crypto.md5.upper32') }}</div>
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result.toUpperCase() }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400 mb-1">{{ $t('ui.crypto.md5.lower16') }}</div>
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ result.substring(8, 24) }}</div>
            </div>
          </div>
        </template>
        <div
          v-else
          class="w-full flex-1 min-h-[200px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400"
        >
          <component :is="icons.Hash" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.crypto.md5.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import SparkMD5 from 'spark-md5'

const input = ref('')

const result = computed(() => {
  if (!input.value) return ''
  return SparkMD5.hash(input.value)
})
</script>
