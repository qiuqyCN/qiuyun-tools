<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Connection panel -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 lg:col-span-1 space-y-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('ui.dev.websocket.connConfigLabel') }}</div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">URL</label>
          <input
            v-model="url"
            placeholder="wss://echo.websocket.org"
            :disabled="connected"
            class="w-full h-10 px-3 text-sm font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-slate-50"
          />
        </div>
        <div class="flex gap-2">
          <button
            v-if="!connected"
            @click="connect"
            :disabled="connecting"
            class="flex-1 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.PlugZap" class="w-4 h-4" />
            {{ connecting ? $t('ui.dev.websocket.statusConnecting') : $t('ui.dev.websocket.btnConnect') }}
          </button>
          <button
            v-else
            @click="disconnect"
            class="flex-1 h-10 px-5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium flex items-center justify-center gap-1.5 transition"
          >
            <component :is="icons.Unplug" class="w-4 h-4" />
            {{ $t('ui.dev.websocket.btnDisconnect') }}
          </button>
        </div>

        <div
          class="flex items-center gap-2 text-xs font-medium"
          :class="statusColor"
        >
          <span class="w-2 h-2 rounded-full" :class="statusDot"></span>
          {{ statusText }}
        </div>

        <!-- Quick URLs -->
        <div>
          <div class="text-xs text-slate-400 mb-1">{{ $t('ui.dev.websocket.quickTestLabel') }}</div>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="q in quickUrls"
              :key="q"
              @click="url = q"
              class="text-xs px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 font-mono"
            >{{ q }}</button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.websocket.sendMessageLabel') }}</span>
            <span class="text-xs flex items-center gap-1" :class="connected ? 'text-green-600' : 'text-slate-400'">
              <span class="w-1.5 h-1.5 rounded-full" :class="connected ? 'bg-green-500' : 'bg-slate-300'"></span>
              {{ connected ? $t('ui.dev.websocket.statusConnected') : $t('ui.dev.websocket.statusDisconnected') }}
            </span>
          </div>
          <textarea
            v-model="message"
            :disabled="!connected"
            :placeholder="$t('ui.dev.websocket.messagePlaceholder')"
            @keyup.enter.exact.prevent="send"
            class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-slate-50"
          />
          <button
            @click="send"
            :disabled="!connected || !message"
            class="mt-2 h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.Send" class="w-4 h-4" />
            {{ $t('ui.dev.websocket.btnSend') }}
          </button>
        </div>

        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.websocket.messageLogLabel') }}</span>
            <button @click="messages = []" class="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
              <component :is="icons.Trash2" class="w-3 h-3" />
              {{ $t('common.clear') }}
            </button>
          </div>
          <div class="h-64 overflow-auto space-y-1.5">
            <div
              v-for="(m, i) in messages"
              :key="i"
              class="flex gap-2 text-xs font-mono p-1.5 rounded"
              :class="m.type === 'sent' ? 'bg-indigo-50 text-indigo-600' : m.type === 'recv' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'"
            >
              <span class="text-slate-400 w-16 shrink-0">{{ m.time }}</span>
              <span class="font-semibold w-12 shrink-0">[{{ m.type.toUpperCase() }}]</span>
              <span class="break-all">{{ m.data }}</span>
            </div>
            <div v-if="!messages.length" class="h-40 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
              <component :is="icons.MessageSquare" class="w-6 h-6 text-slate-300" />
              {{ $t('ui.dev.websocket.noMessages') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const { t } = useI18n()
const url = ref('wss://echo.websocket.org')
const connected = ref(false)
const connecting = ref(false)
const message = ref('')
const messages = ref<{ type: string; data: string; time: string }[]>([])
let ws: WebSocket | null = null

const quickUrls = ['wss://echo.websocket.org', 'wss://ws.postman-echo.com/raw']

const statusText = computed(() => {
  if (connecting.value) return t('ui.dev.websocket.statusConnecting')
  if (connected.value) return t('ui.dev.websocket.statusConnected')
  return t('ui.dev.websocket.statusDisconnected')
})
const statusColor = computed(() => {
  if (connecting.value) return 'text-yellow-600'
  if (connected.value) return 'text-green-600'
  return 'text-slate-400'
})
const statusDot = computed(() => {
  if (connecting.value) return 'bg-yellow-400 animate-pulse'
  if (connected.value) return 'bg-green-500'
  return 'bg-slate-300'
})

function fmtTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function connect() {
  if (!url.value) return
  connecting.value = true
  try {
    ws = new WebSocket(url.value)
    ws.onopen = () => {
      connecting.value = false
      connected.value = true
    }
    ws.onmessage = (e) => {
      messages.value.push({ type: 'recv', data: typeof e.data === 'string' ? e.data : '[Binary data]', time: fmtTime() })
    }
    ws.onerror = () => {
      connecting.value = false
      messages.value.push({ type: 'error', data: t('ui.dev.websocket.errConnect'), time: fmtTime() })
    }
    ws.onclose = () => {
      connected.value = false
      connecting.value = false
      messages.value.push({ type: 'error', data: t('ui.dev.websocket.errClosed'), time: fmtTime() })
    }
  } catch (e: any) {
    connecting.value = false
    messages.value.push({ type: 'error', data: e?.message || t('ui.dev.websocket.errConnectFailed'), time: fmtTime() })
  }
}

function disconnect() {
  ws?.close()
  ws = null
}

function send() {
  if (!ws || !connected.value || !message.value) return
  ws.send(message.value)
  messages.value.push({ type: 'sent', data: message.value, time: fmtTime() })
  message.value = ''
}

onUnmounted(() => { ws?.close() })
</script>
