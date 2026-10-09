<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Connection panel -->
    <section class="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-1 space-y-4">
      <h3 class="text-sm font-semibold text-slate-700">连接</h3>
      <div>
        <label class="block text-xs text-slate-500 mb-1">URL</label>
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
          class="flex-1 h-10 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >{{ connecting ? '连接中...' : '连接' }}</button>
        <button
          v-else
          @click="disconnect"
          class="flex-1 h-10 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
        >断开</button>
      </div>

      <div
        class="flex items-center gap-2 text-xs"
        :class="statusColor"
      >
        <span class="w-2 h-2 rounded-full" :class="statusDot"></span>
        {{ statusText }}
      </div>

      <!-- Quick URLs -->
      <div>
        <div class="text-xs text-slate-500 mb-1">快速测试</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="q in quickUrls"
            :key="q"
            @click="url = q"
            class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono"
          >{{ q }}</button>
        </div>
      </div>
    </section>

    <!-- Messages -->
    <section class="lg:col-span-2 space-y-4">
      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">发送消息</h3>
          <span class="text-xs text-slate-400">{{ connected ? '✓ 已连接' : '未连接' }}</span>
        </div>
        <textarea
          v-model="message"
          :disabled="!connected"
          placeholder="输入要发送的消息..."
          @keyup.enter.exact.prevent="send"
          class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-slate-50"
        />
        <button
          @click="send"
          :disabled="!connected || !message"
          class="mt-2 h-9 px-4 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >发送 (Enter)</button>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">消息记录</h3>
          <button @click="messages = []" class="text-xs text-slate-400 hover:text-red-500">清空</button>
        </div>
        <div class="h-64 overflow-auto space-y-2">
          <div
            v-for="(m, i) in messages"
            :key="i"
            class="flex gap-2 text-xs font-mono"
          >
            <span class="text-slate-400 w-20 shrink-0">{{ m.time }}</span>
            <span
              :class="m.type === 'sent' ? 'text-indigo-600' : m.type === 'recv' ? 'text-green-600' : 'text-red-500'"
            >
              [{{ m.type.toUpperCase() }}] {{ m.data }}
            </span>
          </div>
          <div v-if="!messages.length" class="py-8 text-center text-slate-400 text-sm">暂无消息</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const url = ref('wss://echo.websocket.org')
const connected = ref(false)
const connecting = ref(false)
const message = ref('')
const messages = ref<{ type: string; data: string; time: string }[]>([])
let ws: WebSocket | null = null

const quickUrls = ['wss://echo.websocket.org', 'wss://ws.postman-echo.com/raw']

const statusText = computed(() => {
  if (connecting.value) return '连接中...'
  if (connected.value) return '已连接'
  return '未连接'
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
      messages.value.push({ type: 'error', data: '连接错误', time: fmtTime() })
    }
    ws.onclose = () => {
      connected.value = false
      connecting.value = false
      messages.value.push({ type: 'error', data: '连接已关闭', time: fmtTime() })
    }
  } catch (e: any) {
    connecting.value = false
    messages.value.push({ type: 'error', data: e?.message || '连接失败', time: fmtTime() })
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
