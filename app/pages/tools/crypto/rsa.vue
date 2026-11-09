<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.crypto/rsa.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.crypto.rsa.subtitle') }}</span>
    </div>

    <div class="bg-white rounded-xl p-4 border border-slate-200 mb-4">
      <div class="flex items-center gap-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">{{ $t('ui.crypto.rsa.keySizeLabel') }}</label>
          <select v-model.number="keySize" class="h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
            <option :value="2048">{{ $t('ui.crypto.rsa.option2048') }}</option>
            <option :value="4096">{{ $t('ui.crypto.rsa.option4096') }}</option>
          </select>
        </div>
        <button
          @click="generate"
          class="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <component :is="icons.KeyRound" class="w-4 h-4" />
          {{ loading ? $t('ui.crypto.rsa.btnGenerating') : $t('ui.crypto.rsa.btnGenerate') }}
        </button>
        <span class="text-xs text-slate-400 flex items-center gap-1">
          <component :is="icons.Shield" class="w-3.5 h-3.5" />
          {{ $t('ui.crypto.rsa.localOnly') }}
        </span>
      </div>
    </div>

    <div v-if="publicKey" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.rsa.publicKeyLabel') }}</span>
          <div class="flex items-center gap-2">
            <CopyButton :text="publicKey" :label="$t('common.copy')" />
            <DownloadButton :content="publicKey" filename="public.pem" :label="$t('ui.crypto.rsa.btnDownload')" />
          </div>
        </div>
        <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap">{{ publicKey }}</pre>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.rsa.privateKeyLabel') }}</span>
          <div class="flex items-center gap-2">
            <CopyButton :text="privateKey" :label="$t('common.copy')" />
            <DownloadButton :content="privateKey" filename="private.pem" :label="$t('ui.crypto.rsa.btnDownload')" />
          </div>
        </div>
        <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap">{{ privateKey }}</pre>
      </div>
    </div>
    <div v-else class="bg-white rounded-xl p-12 border border-slate-200 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
      <component :is="icons.Key" class="w-10 h-10 text-slate-300" />
      <span>{{ $t('ui.crypto.rsa.emptyHint') }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const keySize = ref(2048)
const loading = ref(false)
const publicKey = ref('')
const privateKey = ref('')

// ArrayBuffer → Base64
function ab2b64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

// SubjectPublicKeyInfo → PEM
function spkiToPem(buf: ArrayBuffer): string {
  const b64 = ab2b64(buf)
  return '-----BEGIN PUBLIC KEY-----\n' + b64.match(/.{1,64}/g)!.join('\n') + '\n-----END PUBLIC KEY-----'
}

// PKCS8 → PEM
function pkcs8ToPem(buf: ArrayBuffer): string {
  const b64 = ab2b64(buf)
  return '-----BEGIN PRIVATE KEY-----\n' + b64.match(/.{1,64}/g)!.join('\n') + '\n-----END PRIVATE KEY-----'
}

async function generate() {
  if (!globalThis.crypto?.subtle) {
    alert(t('ui.crypto.rsa.errWebCrypto'))
    return
  }
  loading.value = true
  try {
    const pair = await crypto.subtle.generateKey(
      { name: 'RSA-PSS', modulusLength: keySize.value, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )
    const pubBuf = await crypto.subtle.exportKey('spki', pair.publicKey)
    const privBuf = await crypto.subtle.exportKey('pkcs8', pair.privateKey)
    publicKey.value = spkiToPem(pubBuf)
    privateKey.value = pkcs8ToPem(privBuf)
  } catch (e: any) {
    alert(t('ui.crypto.rsa.errGenerate') + ': ' + (e?.message || e))
  } finally {
    loading.value = false
  }
}
</script>
