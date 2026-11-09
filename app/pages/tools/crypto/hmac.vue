<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.crypto/hmac.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.crypto.hmac.subtitle') }}</span>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-stretch">
      <!-- 输入 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.hmac.inputLabel') }}</span>
          <button @click="loadExample" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.crypto.hmac.algorithmLabel') }}</label>
          <select v-model="algo" class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
            <option value="SHA-1">HMAC-SHA1</option>
            <option value="SHA-256">HMAC-SHA256</option>
            <option value="SHA-384">HMAC-SHA384</option>
            <option value="SHA-512">HMAC-SHA512</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.crypto.hmac.secretLabel') }}</label>
          <textarea
            v-model="secret"
            class="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.crypto.hmac.messageLabel') }}</label>
          <textarea
            v-model="message"
            class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex lg:flex-col items-center justify-center gap-2 shrink-0">
        <button
          @click="compute"
          :disabled="!secret.trim() || !message.trim()"
          class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition"
        >
          <component :is="icons.KeyRound" class="w-4 h-4" />
          {{ $t('ui.crypto.hmac.btnCompute') }}
        </button>
        <button
          @click="secret = ''; message = ''; hexResult = ''; b64Result = ''; errMsg = ''"
          class="h-8 px-3 rounded-lg text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >{{ $t('common.clear') }}</button>
      </div>

      <!-- 输出 -->
      <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.hmac.resultLabel') }}</span>
        </div>
        <template v-if="hexResult">
          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">{{ $t('ui.crypto.hmac.hexLabel') }}</span>
                <CopyButton :text="hexResult" :label="$t('common.copy')" />
              </div>
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ hexResult }}</div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">Base64</span>
                <CopyButton :text="b64Result" :label="$t('common.copy')" />
              </div>
              <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ b64Result }}</div>
            </div>
          </div>
        </template>
        <div v-else-if="errMsg" class="p-3 bg-red-50 rounded-lg text-sm text-red-600 border border-red-100 flex items-center gap-2">
          <component :is="icons.AlertCircle" class="w-4 h-4 shrink-0" />
          {{ errMsg }}
        </div>
        <div
          v-else
          class="w-full flex-1 min-h-[200px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400"
        >
          <component :is="icons.Lock" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.crypto.hmac.emptyHint') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const exampleSecret = `qiuyun-secret-key-2024`
const exampleMessage = `GET /api/users HTTP/1.1\nHost: example.com\nTimestamp: 1700000000`

const algo = ref('SHA-256')
const secret = ref('')
const message = ref('')
const hexResult = ref('')
const b64Result = ref('')
const errMsg = ref('')

function loadExample() {
  secret.value = exampleSecret
  message.value = exampleMessage
}

function ab2hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function ab2b64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

async function compute() {
  errMsg.value = ''
  hexResult.value = ''
  if (!globalThis.crypto?.subtle) {
    errMsg.value = t('ui.crypto.hmac.errWebCrypto')
    return
  }
  if (!secret.value || !message.value) {
    errMsg.value = t('ui.crypto.hmac.errEmpty')
    return
  }
  try {
    const keyBuf = new TextEncoder().encode(secret.value)
    const msgBuf = new TextEncoder().encode(message.value)
    const key = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: algo.value }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, msgBuf)
    hexResult.value = ab2hex(sig)
    b64Result.value = ab2b64(sig)
  } catch (e: any) {
    errMsg.value = t('ui.crypto.hmac.errCompute') + ': ' + (e?.message || e)
  }
}
</script>
