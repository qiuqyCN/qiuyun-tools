<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Input -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.jwt.tokenLabel') }}</span>
        </div>
        <textarea
          v-model="token"
          :placeholder="$t('ui.crypto.jwt.tokenPlaceholder')"
          class="w-full h-48 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div v-if="error" class="mt-3 text-sm text-red-500 flex items-center gap-1.5">
          <component :is="icons.AlertCircle" class="w-4 h-4" />
          {{ error }}
        </div>
      </div>

      <!-- Result -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.jwt.resultLabel') }}</span>
        </div>
        <template v-if="header && payload">
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs text-slate-500">Header</span>
                <CopyButton :text="JSON.stringify(header, null, 2)" :label="$t('common.copy')" />
              </div>
              <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-40">{{ headerStr }}</pre>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs text-slate-500">Payload</span>
                <CopyButton :text="JSON.stringify(payload, null, 2)" :label="$t('common.copy')" />
              </div>
              <pre class="p-3 bg-indigo-50 rounded-lg text-xs font-mono text-indigo-900 overflow-auto max-h-60">{{ payloadStr }}</pre>
            </div>
            <div v-if="signature" class="text-xs text-slate-400">
              Signature: <span class="font-mono break-all">{{ signature.substring(0, 32) }}...</span>
            </div>
            <!-- Expiration check -->
            <div v-if="payload.exp" class="pt-2 border-t border-slate-100">
              <div class="text-xs text-slate-500">{{ $t('ui.crypto.jwt.expLabel') }}</div>
              <div
                class="text-sm font-medium"
                :class="isExpired ? 'text-red-500' : 'text-green-600'"
              >
                {{ expDate }} {{ isExpired ? $t('ui.crypto.jwt.expired') : $t('ui.crypto.jwt.notExpired') }}
              </div>
            </div>
          </div>
        </template>
        <div v-else class="h-48 bg-slate-50 text-slate-400 rounded-lg flex flex-col items-center justify-center text-xs gap-2 border border-slate-100">
          <component :is="icons.Key" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.crypto.jwt.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

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
    if (token.value.trim()) error.value = t('ui.crypto.jwt.errFormat')
    return null
  }
  try {
    return JSON.parse(b64urlDecode(parts[0]))
  } catch {
    error.value = t('ui.crypto.jwt.errHeader')
    return null
  }
})

const payload = computed<any | null>(() => {
  const parts = token.value.trim().split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(b64urlDecode(parts[1]))
  } catch {
    error.value = t('ui.crypto.jwt.errPayload')
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
