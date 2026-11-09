<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('tools.dev/http-request.name') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.dev.http-request.pageDesc') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Request -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-3">
        <div class="flex items-center gap-2">
          <select v-model="method" class="h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white font-mono">
            <option v-for="m in methods" :key="m">{{ m }}</option>
          </select>
          <input
            v-model="url"
            placeholder="https://api.example.com/path"
            class="flex-1 h-10 px-3 text-sm rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div v-if="method !== 'GET'" class="pt-2">
          <div class="text-xs font-medium text-slate-500 mb-1">{{ $t('ui.dev.http-request.bodyLabel') }}</div>
          <textarea
            v-model="body"
            placeholder='{"key": "value"}'
            class="w-full h-32 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="pt-2">
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span class="font-medium">{{ $t('ui.dev.http-request.headersLabel') }}</span>
            <button @click="addHeader" class="text-indigo-500 hover:text-indigo-600 hover:underline flex items-center gap-0.5 text-xs">
              <component :is="icons.Plus" class="w-3 h-3" /> {{ $t('ui.dev.http-request.btnAddHeader') }}
            </button>
          </div>
          <div v-for="(h, i) in headers" :key="i" class="flex gap-2 mb-1.5">
            <input v-model="h.key" placeholder="Key" class="flex-1 h-8 px-2 text-xs rounded border border-slate-200 font-mono" />
            <input v-model="h.value" placeholder="Value" class="flex-1 h-8 px-2 text-xs rounded border border-slate-200 font-mono" />
            <button @click="headers.splice(i, 1)" class="text-xs text-red-400 hover:text-red-500 px-2">
              <component :is="icons.X" class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div class="pt-2">
          <button
            @click="send"
            :disabled="loading || !url"
            class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.Send" class="w-4 h-4" />
            {{ loading ? $t('ui.dev.http-request.statusSending') : $t('ui.dev.http-request.btnSend') }}
          </button>
          <p class="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <component :is="icons.Info" class="w-3 h-3" />
            {{ $t('ui.dev.http-request.corsNote') }}
          </p>
        </div>

        <div v-if="curlCmd" class="pt-2">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>{{ $t('ui.dev.http-request.curlLabel') }}</span>
            <CopyButton :text="curlCmd" :label="$t('common.copy')" />
          </div>
          <pre class="p-2 bg-slate-50 rounded text-xs font-mono text-slate-700 overflow-auto max-h-24 break-all border border-slate-100">{{ curlCmd }}</pre>
        </div>
      </div>

      <!-- Response -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.http-request.responseLabel') }}</span>
          <div v-if="statusCode" class="flex items-center gap-3 text-xs">
            <span class="font-medium" :class="statusColor">{{ $t('ui.dev.http-request.statusCodeLabel') }} {{ statusCode }}</span>
            <span class="text-slate-400 flex items-center gap-1"><component :is="icons.Timer" class="w-3 h-3" />{{ duration }} ms</span>
            <span class="text-slate-400">{{ size }} B</span>
            <CopyButton v-if="responseText" :text="responseText" :label="$t('common.copy')" />
          </div>
        </div>
        <div v-if="errorMsg" class="p-3 bg-red-50 rounded-lg text-sm text-red-600 border border-red-100 flex items-start gap-2">
          <component :is="icons.AlertTriangle" class="w-4 h-4 mt-0.5 shrink-0" />
          {{ errorMsg }}
        </div>
        <pre v-else-if="responseText" class="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-auto whitespace-pre-wrap max-h-[480px] border border-slate-100">{{ responseText }}</pre>
        <div v-else class="h-80 flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50 rounded-lg border border-slate-100">
          <component :is="icons.Activity" class="w-8 h-8 text-slate-300" />
          <span>{{ $t('ui.dev.http-request.responseEmpty') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const { t } = useI18n()
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const method = ref('GET')
const url = ref('https://jsonplaceholder.typicode.com/posts/1')
const body = ref('')
const headers = ref<{ key: string; value: string }[]>([
  { key: 'Content-Type', value: 'application/json' },
])
const loading = ref(false)
const statusCode = ref<number | null>(null)
const responseText = ref('')
const duration = ref(0)
const size = ref(0)
const errorMsg = ref('')

const curlCmd = computed(() => {
  const parts = [`curl -X ${method.value} "${url.value}"`]
  headers.value.filter(h => h.key).forEach(h => parts.push(`-H "${h.key}: ${h.value}"`))
  if (method.value !== 'GET' && body.value.trim()) {
    parts.push(`-d '${body.value}'`)
  }
  return parts.join(' \\\n  ')
})

const statusColor = computed(() => {
  if (!statusCode.value) return ''
  if (statusCode.value >= 200 && statusCode.value < 300) return 'text-green-600'
  if (statusCode.value >= 300 && statusCode.value < 400) return 'text-yellow-600'
  if (statusCode.value >= 400 && statusCode.value < 500) return 'text-orange-600'
  return 'text-red-600'
})

function addHeader() { headers.value.push({ key: '', value: '' }) }

async function send() {
  loading.value = true
  errorMsg.value = ''
  statusCode.value = null
  responseText.value = ''
  const start = performance.now()

  try {
    const init: RequestInit = { method: method.value }
    const h: Record<string, string> = {}
    headers.value.filter(x => x.key).forEach(x => { h[x.key] = x.value })
    init.headers = h
    if (method.value !== 'GET' && method.value !== 'HEAD' && body.value.trim()) {
      init.body = body.value
    }
    const res = await fetch(url.value, init)
    statusCode.value = res.status
    const text = await res.text()
    duration.value = Math.round(performance.now() - start)
    size.value = new Blob([text]).size
    // Try format as JSON
    try {
      responseText.value = JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      responseText.value = text
    }
  } catch (e: any) {
    duration.value = Math.round(performance.now() - start)
    errorMsg.value = e?.message || t('ui.dev.http-request.errRequestFailed')
  } finally {
    loading.value = false
  }
}
</script>
