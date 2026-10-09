<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">User-Agent 字符串</h3>
      <textarea
        v-model="ua"
        placeholder="粘贴 User-Agent..."
        class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <button @click="ua = navigator.userAgent" class="mt-3 text-xs text-indigo-600 hover:underline">使用当前浏览器 UA</button>
    </section>
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">解析结果</h3>
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
      <div v-else class="py-12 text-center text-slate-400">等待输入 UA</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { UAParser } from 'ua-parser-js'
import InfoRow from '~/components/InfoRow.vue'

const ua = ref(navigator.userAgent)
const parsed = computed(() => ua.value ? new UAParser(ua.value).getResult() : null)
</script>
