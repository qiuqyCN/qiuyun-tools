<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">User-Agent 解析</h3>
      <span class="text-xs text-slate-400">解析 User-Agent 字符串，识别浏览器、系统、设备信息</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">User-Agent 字符串</span>
          <button @click="ua = navigator.userAgent" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline flex items-center gap-1">
            <component :is="icons.RefreshCw" class="w-3 h-3" />
            使用当前浏览器 UA
          </button>
        </div>
        <textarea
          v-model="ua"
          placeholder="粘贴 User-Agent..."
          class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Microscope" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">解析结果</span>
        </div>
        <template v-if="parsed">
          <div class="space-y-2.5">
            <InfoRow label="浏览器" :value="`${parsed.browser.name || '-'} ${parsed.browser.version || ''}`" />
            <InfoRow label="操作系统" :value="`${parsed.os.name || '-'} ${parsed.os.version || ''}`" />
            <InfoRow label="设备类型" :value="parsed.device.type || '桌面'" />
            <InfoRow label="设备厂商" :value="parsed.device.vendor || '-'" />
            <InfoRow label="设备型号" :value="parsed.device.model || '-'" />
            <InfoRow label="架构" :value="parsed.cpu.architecture || '-'" />
            <InfoRow label="渲染引擎" :value="`${parsed.engine.name || '-'} ${parsed.engine.version || ''}`" />
          </div>
        </template>
        <div v-else class="h-40 flex flex-col items-center justify-center text-slate-400 text-xs gap-1 bg-slate-50 rounded-lg border border-slate-100">
          <component :is="icons.Search" class="w-6 h-6 text-slate-300" />
          等待输入 UA 字符串
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { UAParser } from 'ua-parser-js'
import InfoRow from '~/components/InfoRow.vue'

const ua = ref('')
if (typeof navigator !== 'undefined') ua.value = navigator.userAgent
const parsed = computed(() => ua.value ? new UAParser(ua.value).getResult() : null)
</script>
