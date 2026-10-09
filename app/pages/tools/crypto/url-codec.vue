<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Encode -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">URL 编码</h3>
        <CopyButton :text="encoded" label="复制" />
      </div>
      <textarea
        v-model="raw"
        placeholder="输入原始文本..."
        class="w-full h-36 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all min-h-[60px]">
        {{ encoded || '等待输入...' }}
      </div>
    </section>

    <!-- Decode -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">URL 解码</h3>
        <CopyButton :text="decoded" label="复制" />
      </div>
      <textarea
        v-model="encodedInput"
        placeholder="输入编码后的 URL..."
        class="w-full h-36 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div
        class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm break-all min-h-[60px]"
        :class="decodeError ? 'text-red-500' : 'text-slate-700'"
      >
        {{ decodeError || decoded || '等待输入...' }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const raw = ref('')
const encodedInput = ref('')
const decodeError = ref('')

const encoded = computed(() => raw.value ? encodeURIComponent(raw.value) : '')

const decoded = computed(() => {
  if (!encodedInput.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(encodedInput.value.trim())
  } catch {
    decodeError.value = '无效的 URL 编码字符串'
    return ''
  }
})
</script>
