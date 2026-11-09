<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.text/dedup-lines.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.text.dedup-lines.subtitle') }}</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.text.dedup-lines.inputLabel') }}</span>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-1.5 text-xs text-slate-500">
              <input v-model="ignoreCase" type="checkbox" class="rounded" />{{ $t('ui.text.dedup-lines.ignoreCase') }}
            </label>
            <button @click="input = example" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
          </div>
        </div>
        <textarea
          v-model="input"
          :placeholder="$t('ui.text.dedup-lines.placeholder')"
          class="w-full h-[300px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <button
          @click="input = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.text.dedup-lines.outputLabel') }}</span>
            <span v-if="stats" class="text-[11px] text-slate-400">{{ stats }}</span>
          </div>
          <CopyButton :text="output" :label="$t('common.copy')" />
        </div>
        <pre
          v-if="output"
          class="w-full h-[300px] p-3 text-sm rounded-lg bg-slate-50 font-mono overflow-auto whitespace-pre-wrap break-all border border-slate-100"
        >{{ output }}</pre>
        <div
          v-else
          class="w-full h-[300px] p-3 rounded-lg bg-slate-50 text-slate-400 border border-slate-100 flex flex-col items-center justify-center gap-2 text-xs"
        >
          <component :is="icons.ListChecks" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.text.dedup-lines.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const example = `apple
banana
orange
apple
grape
banana
cherry
grape
lemon`

const input = ref('')
const ignoreCase = ref(false)

const output = computed(() => {
  const lines = input.value.split('\n').filter(l => l.length > 0)
  const seen = new Set<string>()
  const result: string[] = []
  for (const line of lines) {
    const key = ignoreCase.value ? line.toLowerCase() : line
    if (!seen.has(key)) {
      seen.add(key)
      result.push(line)
    }
  }
  return result.join('\n')
})

const stats = computed(() => {
  const total = input.value ? input.value.split('\n').filter(l => l.length > 0).length : 0
  const unique = output.value ? output.value.split('\n').length : 0
  const removed = total - unique
  return t('ui.text.dedup-lines.statSummary', { total, unique, removed })
})

function clear() {
  input.value = ''
}
</script>
