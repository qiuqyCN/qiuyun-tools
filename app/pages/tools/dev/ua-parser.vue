<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.ua-parser.uaLabel') }}</span>
          <button @click="ua = navigator.userAgent" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline flex items-center gap-1">
            <component :is="icons.RefreshCw" class="w-3 h-3" />
            {{ $t('ui.dev.ua-parser.btnUseCurrentUa') }}
          </button>
        </div>
        <textarea
          v-model="ua"
          :placeholder="$t('ui.dev.ua-parser.uaPlaceholder')"
          class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Microscope" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.ua-parser.resultLabel') }}</span>
        </div>
        <template v-if="parsed">
          <div class="space-y-2.5">
            <InfoRow :label="$t('ui.dev.ua-parser.fieldBrowser')" :value="`${parsed.browser.name || '-'} ${parsed.browser.version || ''}`" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldOs')" :value="`${parsed.os.name || '-'} ${parsed.os.version || ''}`" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldDeviceType')" :value="parsed.device.type || $t('ui.dev.ua-parser.deviceDesktop')" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldVendor')" :value="parsed.device.vendor || '-'" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldModel')" :value="parsed.device.model || '-'" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldArch')" :value="parsed.cpu.architecture || '-'" />
            <InfoRow :label="$t('ui.dev.ua-parser.fieldEngine')" :value="`${parsed.engine.name || '-'} ${parsed.engine.version || ''}`" />
          </div>
        </template>
        <div v-else class="h-40 flex flex-col items-center justify-center text-slate-400 text-xs gap-1 bg-slate-50 rounded-lg border border-slate-100">
          <component :is="icons.Search" class="w-6 h-6 text-slate-300" />
          {{ $t('ui.dev.ua-parser.emptyHint') }}
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
