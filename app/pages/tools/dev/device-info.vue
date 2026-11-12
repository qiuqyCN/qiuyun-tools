<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="space-y-4">
      <!-- Basic -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Monitor" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.device-info.sectionBasic') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow :label="$t('ui.dev.device-info.fieldBrowser')" :value="browser" />
          <InfoRow :label="$t('ui.dev.device-info.fieldBrowserVersion')" :value="browserVersion" />
          <InfoRow :label="$t('ui.dev.device-info.fieldOs')" :value="os" />
          <InfoRow :label="$t('ui.dev.device-info.fieldPlatform')" :value="platform" />
          <InfoRow :label="$t('ui.dev.device-info.fieldLanguage')" :value="language" />
          <InfoRow :label="$t('ui.dev.device-info.fieldTimezone')" :value="timezone" />
          <InfoRow :label="$t('ui.dev.device-info.fieldOnlineStatus')" :value="online ? $t('ui.dev.device-info.statusOnline') : $t('ui.dev.device-info.statusOffline')" />
          <InfoRow label="Cookie" :value="cookieEnabled ? $t('ui.dev.device-info.statusEnabled') : $t('ui.dev.device-info.statusDisabled')" />
        </div>
      </div>

      <!-- Screen -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Monitor" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.device-info.sectionScreen') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow :label="$t('ui.dev.device-info.fieldScreenResolution')" :value="screenSize" />
          <InfoRow :label="$t('ui.dev.device-info.fieldAvailableArea')" :value="availSize" />
          <InfoRow :label="$t('ui.dev.device-info.fieldColorDepth')" :value="colorDepth + ' bit'" />
          <InfoRow :label="$t('ui.dev.device-info.fieldPixelRatio')" :value="pixelRatio + 'x'" />
          <InfoRow :label="$t('ui.dev.device-info.fieldViewport')" :value="viewport" />
          <InfoRow :label="$t('ui.dev.device-info.fieldMobile')" :value="isMobile ? $t('ui.dev.device-info.yes') : $t('ui.dev.device-info.no')" />
          <InfoRow :label="$t('ui.dev.device-info.fieldTouchSupport')" :value="touchSupport ? $t('ui.dev.device-info.yes') : $t('ui.dev.device-info.no')" />
        </div>
      </div>

      <!-- Hardware -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Cpu" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.device-info.sectionHardware') }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow :label="$t('ui.dev.device-info.fieldCpuCores')" :value="cpuCores" />
          <InfoRow :label="$t('ui.dev.device-info.fieldMemory')" :value="memory" />
          <InfoRow :label="$t('ui.dev.device-info.fieldMaxConnections')" :value="maxConn" />
          <InfoRow label="WebGL" :value="webglVendor" />
        </div>
      </div>

      <!-- Canvas test -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Palette" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.dev.device-info.sectionCanvas') }}</span>
        </div>
        <div class="flex gap-6 items-center">
          <canvas ref="canvasRef" width="200" height="60" class="rounded-lg border border-slate-200" />
          <div class="text-xs text-slate-500 space-y-1">
            <div class="flex items-center gap-1"><component :is="icons.Check" v-if="canvas2d" class="w-3 h-3 text-green-500" /><component :is="icons.X" v-else class="w-3 h-3 text-red-500" />Canvas 2D: {{ canvas2d ? $t('ui.dev.device-info.statusSupported') : $t('ui.dev.device-info.statusUnsupported') }}</div>
            <div>Canvas Text: {{ canvasText || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
const { t } = useI18n()
const browser = ref('-')
const browserVersion = ref('')
const os = ref('-')
const platform = ref('-')
const language = ref('-')
const timezone = ref('-')
const online = ref(false)
const cookieEnabled = ref(false)

const screenSize = ref('-')
const availSize = ref('-')
const colorDepth = ref(0)
const pixelRatio = ref(1)
const viewport = ref('-')
const isMobile = ref(false)
const touchSupport = ref(false)

const cpuCores = ref('-')
const memory = ref(t('ui.dev.device-info.valMemoryUnavailable'))
const maxConn = ref(t('ui.dev.device-info.valUnavailable'))
const webglVendor = ref('')

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvas2d = ref(false)
const canvasText = ref('')

onMounted(() => {
  const nav = navigator
  // 基本
  const ua = nav.userAgent
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/)
  if (match) {
    browser.value = match[1]
    browserVersion.value = match[2]
  } else {
    browser.value = nav.appName || '-', browserVersion.value = nav.appVersion || ''
  }
  os.value = nav.platform || '-'
  platform.value = nav.platform || '-'
  language.value = nav.language + (nav.languages?.length ? ` / [${nav.languages.join(', ')}]` : '')
  try { timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone } catch {}
  online.value = nav.onLine
  cookieEnabled.value = nav.cookieEnabled

  // 屏幕
  try {
    screenSize.value = `${screen.width} × ${screen.height}`
    availSize.value = `${screen.availWidth} × ${screen.availHeight}`
    colorDepth.value = screen.colorDepth
  } catch {}
  pixelRatio.value = window.devicePixelRatio || 1
  viewport.value = `${window.innerWidth} × ${window.innerHeight}`
  isMobile.value = 'ontouchstart' in window || /Mobile|Android|iPhone|iPad/i.test(ua)
  touchSupport.value = 'ontouchstart' in window || (nav as any).maxTouchPoints > 0

  // 硬件
  cpuCores.value = String(nav.hardwareConcurrency || '-')
  if ((nav as any).deviceMemory) memory.value = `${(nav as any).deviceMemory} GB`

  // WebGL
  try {
    const gl = document.createElement('canvas').getContext('webgl') as WebGLRenderingContext | null
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      webglVendor.value = ext ? String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)) : t('ui.dev.device-info.statusSupported')
    } else {
      webglVendor.value = t('ui.dev.device-info.statusUnsupported')
    }
  } catch {
    webglVendor.value = t('ui.dev.device-info.valUnavailable')
  }

  // Canvas 2D test
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      canvas2d.value = true
      ctx.fillStyle = '#6366f1'
      ctx.fillRect(10, 10, 40, 40)
      ctx.fillStyle = '#a855f7'
      ctx.beginPath()
      ctx.arc(100, 30, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#334155'
      ctx.font = '12px sans-serif'
      const canvasLabel = t('ui.dev.device-info.canvasTestText')
      ctx.fillText(canvasLabel, 140, 35)
      canvasText.value = ctx.measureText(canvasLabel).width.toFixed(1) + ' px'
    }
  }

  // Online listener
  window.addEventListener('online', () => online.value = true)
  window.addEventListener('offline', () => online.value = false)
})
</script>
