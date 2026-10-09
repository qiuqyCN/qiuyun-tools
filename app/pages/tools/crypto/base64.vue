<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Encode -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">编码（文本 → Base64）</h3>
        <CopyButton :text="encoded" label="复制结果" />
      </div>
      <textarea
        v-model="inputText"
        placeholder="输入要编码的文本..."
        class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all min-h-[80px]">
        {{ encoded || '等待输入...' }}
      </div>
    </section>

    <!-- Decode -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-700">解码（Base64 → 文本）</h3>
        <CopyButton :text="decoded" label="复制结果" />
      </div>
      <textarea
        v-model="inputBase64"
        placeholder="输入 Base64 字符串..."
        class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div
        class="mt-3 p-3 bg-slate-50 rounded-lg font-mono text-sm break-all min-h-[80px]"
        :class="decodeError ? 'text-red-500' : 'text-slate-700'"
      >
        {{ decodeError || decoded || '等待输入...' }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const inputText = ref('')
const inputBase64 = ref('')
const decodeError = ref('')

// UTF-8 兼容的 Base64 编码
const encoded = computed(() => {
  if (!inputText.value) return ''
  try {
    return btoa(unescape(encodeURIComponent(inputText.value)))
  } catch {
    return ''
  }
})

// UTF-8 兼容的 Base64 解码
const decoded = computed(() => {
  if (!inputBase64.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(escape(atob(inputBase64.value.trim())))
  } catch {
    decodeError.value = '无效的 Base64 字符串'
    return ''
  }
})
</script>
