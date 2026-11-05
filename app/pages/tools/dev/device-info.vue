<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">设备信息检测</h3>
      <span class="text-xs text-slate-400">获取当前浏览器和设备的详细信息</span>
    </div>

    <div class="space-y-4">
      <!-- Basic -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Window" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">基本信息</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow label="浏览器" :value="browser" />
          <InfoRow label="浏览器版本" :value="browserVersion" />
          <InfoRow label="操作系统" :value="os" />
          <InfoRow label="平台" :value="platform" />
          <InfoRow label="语言" :value="language" />
          <InfoRow label="时区" :value="timezone" />
          <InfoRow label="在线状态" :value="online ? '在线' : '离线'" />
          <InfoRow label="Cookie" :value="cookieEnabled ? '已启用' : '已禁用'" />
        </div>
      </div>

      <!-- Screen -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Monitor" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">屏幕与视口</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow label="屏幕分辨率" :value="screenSize" />
          <InfoRow label="可用区域" :value="availSize" />
          <InfoRow label="屏幕色深" :value="colorDepth + ' bit'" />
          <InfoRow label="像素比" :value="pixelRatio + 'x'" />
          <InfoRow label="视口尺寸" :value="viewport" />
          <InfoRow label="移动设备" :value="isMobile ? '是' : '否'" />
          <InfoRow label="支持触摸" :value="touchSupport ? '是' : '否'" />
        </div>
      </div>

      <!-- Hardware -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Cpu" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">硬件信息</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow label="CPU 核心数" :value="cpuCores" />
          <InfoRow label="内存" :value="memory" />
          <InfoRow label="最大并发连接" :value="maxConn" />
          <InfoRow label="WebGL" :value="webglVendor" />
        </div>
      </div>

      <!-- Canvas test -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <component :is="icons.Palette" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">Canvas 渲染测试</span>
        </div>
        <div class="flex gap-6 items-center">
          <canvas ref="canvasRef" width="200" height="60" class="rounded-lg border border-slate-200" />
          <div class="text-xs text-slate-500 space-y-1">
            <div class="flex items-center gap-1"><component :is="icons.Check" v-if="canvas2d" class="w-3 h-3 text-green-500" /><component :is="icons.X" v-else class="w-3 h-3 text-red-500" />Canvas 2D: {{ canvas2d ? '支持' : '不支持' }}</div>
            <div>Canvas Text: {{ canvasText || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
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
const memory = ref('不可用（隐私保护）')
const maxConn = ref('不可用')
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
      webglVendor.value = ext ? String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)) : '支持'
    } else {
      webglVendor.value = '不支持'
    }
  } catch {
    webglVendor.value = '不可用'
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
      ctx.fillText('Canvas 测试', 140, 35)
      canvasText.value = ctx.measureText('Canvas 测试').width.toFixed(1) + ' px'
    }
  }

  // Online listener
  window.addEventListener('online', () => online.value = true)
  window.addEventListener('offline', () => online.value = false)
})
</script>
