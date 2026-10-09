<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">JWT Token</h3>
      <textarea
        v-model="token"
        placeholder="输入 JWT Token..."
        class="w-full h-48 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div v-if="error" class="mt-3 text-sm text-red-500">{{ error }}</div>
    </section>

    <!-- Result -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">解析结果</h3>
      <template v-if="header && payload">
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-slate-500">Header</span>
              <CopyButton :text="JSON.stringify(header, null, 2)" label="复制" />
            </div>
            <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-40">{{ headerStr }}</pre>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-slate-500">Payload</span>
              <CopyButton :text="JSON.stringify(payload, null, 2)" label="复制" />
            </div>
            <pre class="p-3 bg-indigo-50 rounded-lg text-xs font-mono text-indigo-900 overflow-auto max-h-60">{{ payloadStr }}</pre>
          </div>
          <div v-if="signature" class="text-xs text-slate-400">
            Signature: <span class="font-mono break-all">{{ signature.substring(0, 32) }}...</span>
          </div>
          <!-- Expiration check -->
          <div v-if="payload.exp" class="pt-2 border-t border-slate-100">
            <div class="text-xs text-slate-500">过期时间</div>
            <div
              class="text-sm font-medium"
              :class="isExpired ? 'text-red-500' : 'text-green-600'"
            >
              {{ expDate }} {{ isExpired ? '（已过期）' : '（未过期）' }}
            </div>
          </div>
        </div>
      </template>
      <div v-else class="py-12 text-center text-slate-400">等待输入有效 JWT Token</div>
    </section>
  </div>
</template>

<script setup lang="ts">
const token = ref('')
const error = ref('')

function b64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  return decodeURIComponent(escape(atob(base64)))
}

const header = computed<any | null>(() => {
  error.value = ''
  const parts = token.value.trim().split('.')
  if (parts.length !== 3) {
    if (token.value.trim()) error.value = 'JWT 格式错误，应由三段组成'
    return null
  }
  try {
    return JSON.parse(b64urlDecode(parts[0]))
  } catch {
    error.value = 'Header 解码失败'
    return null
  }
})

const payload = computed<any | null>(() => {
  const parts = token.value.trim().split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(b64urlDecode(parts[1]))
  } catch {
    error.value = 'Payload 解码失败'
    return null
  }
})

const signature = computed(() => {
  const parts = token.value.trim().split('.')
  return parts[2] || ''
})

const headerStr = computed(() => header.value ? JSON.stringify(header.value, null, 2) : '')
const payloadStr = computed(() => payload.value ? JSON.stringify(payload.value, null, 2) : '')

const expDate = computed(() => {
  if (!payload.value?.exp) return ''
  const d = new Date(payload.value.exp * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const isExpired = computed(() => {
  if (!payload.value?.exp) return false
  return Date.now() / 1000 > payload.value.exp
})
</script>
