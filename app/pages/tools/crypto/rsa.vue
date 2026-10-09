<template>
  <div class="space-y-5">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">RSA 密钥生成器（WebCrypto）</h3>
      <div class="flex items-center gap-4">
        <div>
          <label class="block text-xs text-slate-500 mb-1">密钥长度</label>
          <select v-model.number="keySize" class="h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
            <option :value="2048">2048 位</option>
            <option :value="4096">4096 位</option>
          </select>
        </div>
        <button @click="generate" class="h-10 px-5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50" :disabled="loading">
          {{ loading ? '生成中...' : '生成密钥对' }}
        </button>
        <span class="text-xs text-slate-400">⚠️ 仅在本地生成，不会上传任何服务器</span>
      </div>
    </section>

    <section v-if="publicKey" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">公钥 (Public Key)</h3>
          <div class="flex items-center gap-2">
            <CopyButton :text="publicKey" label="复制" />
            <DownloadButton :content="publicKey" filename="public.pem" label="下载" />
          </div>
        </div>
        <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap">{{ publicKey }}</pre>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">私钥 (Private Key)</h3>
          <div class="flex items-center gap-2">
            <CopyButton :text="privateKey" label="复制" />
            <DownloadButton :content="privateKey" filename="private.pem" label="下载" />
          </div>
        </div>
        <pre class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap">{{ privateKey }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
    alert('当前浏览器不支持 WebCrypto API')
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
    alert('生成失败: ' + (e?.message || e))
  } finally {
    loading.value = false
  }
}
</script>
