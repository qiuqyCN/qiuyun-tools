<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">JSON 输入</h3>
        <div class="flex items-center gap-2 text-xs">
          <button @click="format" class="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">格式化</button>
          <button @click="compress" class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200">压缩</button>
          <button @click="clear" class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200">清空</button>
        </div>
      </div>
      <textarea
        v-model="input"
        placeholder="输入 JSON 字符串..."
        class="w-full h-[480px] p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </section>
    <!-- Output -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">输出</h3>
        <div class="flex items-center gap-2 text-xs">
          <span v-if="isValid" class="text-green-600">✓ JSON 有效</span>
          <span v-else-if="input" class="text-red-500">✗ {{ errorMsg }}</span>
          <CopyButton :text="output" label="复制" />
        </div>
      </div>
      <pre
        class="w-full h-[480px] p-3 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap"
        :class="isValid ? 'bg-slate-50 text-slate-700' : 'bg-red-50 text-red-700'"
      >{{ output || '等待输入...' }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
const input = ref('')
const output = ref('')
const errorMsg = ref('')

const isValid = computed(() => {
  if (!input.value.trim()) return true
  try {
    JSON.parse(input.value)
    return true
  } catch (e: any) {
    errorMsg.value = e?.message || '无效 JSON'
    return false
  }
})

function format() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    output.value = '格式化失败: ' + e?.message
  }
}

function compress() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e: any) {
    output.value = '压缩失败: ' + e?.message
  }
}

function clear() {
  input.value = ''
  output.value = ''
}
</script>
