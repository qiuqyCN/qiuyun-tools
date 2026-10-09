<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">原始文本</h3>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1.5 text-xs text-slate-500">
            <input v-model="ignoreCase" type="checkbox" class="rounded" />
            忽略大小写
          </label>
          <button
            @click="clear"
            class="text-xs text-slate-400 hover:text-red-500 transition"
          >清空</button>
        </div>
      </div>
      <textarea
        v-model="input"
        placeholder="每行一条数据..."
        class="w-full h-60 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>

    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">去重结果</h3>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">{{ stats }}</span>
          <CopyButton :text="output" label="复制" />
        </div>
      </div>
      <pre
        class="w-full h-60 p-3 text-sm rounded-lg bg-slate-50 font-mono overflow-auto whitespace-pre-wrap break-all"
      >{{ output || '等待输入...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
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
  return `共 ${total} 行，去重后 ${unique} 行，移除 ${removed} 行`
})

function clear() {
  input.value = ''
}
</script>
