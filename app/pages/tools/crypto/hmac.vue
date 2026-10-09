<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div>
        <label class="block text-xs text-slate-500 mb-1">算法</label>
        <select v-model="algo" class="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white">
          <option value="SHA-1">HMAC-SHA1</option>
          <option value="SHA-256">HMAC-SHA256</option>
          <option value="SHA-384">HMAC-SHA384</option>
          <option value="SHA-512">HMAC-SHA512</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">密钥 (Secret)</label>
        <textarea
          v-model="secret"
          class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">消息 (Message)</label>
        <textarea
          v-model="message"
          class="w-full h-32 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <button @click="compute" class="w-full h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
        计算 HMAC
      </button>
    </section>

    <!-- Result -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div v-if="hexResult">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-slate-500">HEX (小写)</span>
          <CopyButton :text="hexResult" label="复制" />
        </div>
        <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ hexResult }}</div>
      </div>
      <div v-if="hexResult">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-slate-500">Base64</span>
          <CopyButton :text="b64Result" label="复制" />
        </div>
        <div class="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">{{ b64Result }}</div>
      </div>
      <div v-if="errMsg" class="text-sm text-red-500">{{ errMsg }}</div>
      <div v-if="!hexResult && !errMsg" class="py-12 text-center text-slate-400">填写密钥和消息后点击计算</div>
    </section>
  </div>
</template>

<script setup lang="ts">
const algo = ref('SHA-256')
const secret = ref('')
const message = ref('')
const hexResult = ref('')
const b64Result = ref('')
const errMsg = ref('')

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
    errMsg.value = '当前浏览器不支持 WebCrypto API'
    return
  }
  if (!secret.value || !message.value) {
    errMsg.value = '密钥和消息不能为空'
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
    errMsg.value = '计算失败: ' + (e?.message || e)
  }
}
</script>
