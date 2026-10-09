<template>
  <div class="space-y-6">
    <!-- Basic -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">基本信息</h3>
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
    </section>

    <!-- Screen -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">屏幕与视口</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
        <InfoRow label="屏幕分辨率" :value="screenSize" />
        <InfoRow label="可用区域" :value="availSize" />
        <InfoRow label="屏幕色深" :value="colorDepth + ' bit'" />
        <InfoRow label="像素比" :value="pixelRatio + 'x'" />
        <InfoRow label="视口尺寸" :value="viewport" />
        <InfoRow label="移动设备" :value="isMobile ? '是' : '否'" />
        <InfoRow label="支持触摸" :value="touchSupport ? '是' : '否'" />
      </div>
    </section>

    <!-- Hardware -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">硬件信息</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
        <InfoRow label="CPU 核心数" :value="cpuCores" />
        <InfoRow label="内存" :value="memory" />
        <InfoRow label="最大并发连接" :value="maxConn" />
        <InfoRow label="WebGL" :value="webglVendor" />
      </div>
    </section>

    <!-- Canvas test -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-4">Canvas 渲染测试</h3>
      <div class="flex gap-6 items-center">
        <canvas ref="canvasRef" width="200" height="60" class="rounded-lg border border-slate-200" />
        <div class="text-xs text-slate-500">
          <div>Canvas 2D: {{ canvas2d ? '✓ 支持' : '✗ 不支持' }}</div>
          <div>Canvas Text: {{ canvasText || '-' }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const browser = ref(navigator.userAgent) // 简化，实际可解析
const browserVersion = ref('')
const os = ref(navigator.platform)
const platform = ref(navigator.platform)
const language = ref(navigator.language + (navigator.languages ? ` / [${navigator.languages.join(', ')}]` : ''))
const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const online = ref(navigator.onLine)
const cookieEnabled = ref(navigator.cookieEnabled)

const screenSize = ref(`${screen.width} × ${screen.height}`)
const availSize = ref(`${screen.availWidth} × ${screen.availHeight}`)
const colorDepth = ref(screen.colorDepth)
const pixelRatio = ref(window.devicePixelRatio || 1)
const viewport = ref(`${window.innerWidth} × ${window.innerHeight}`)
const isMobile = ref('ontouchstart' in window || /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent))
const touchSupport = ref('ontouchstart' in window || navigator.maxTouchPoints > 0)

const cpuCores = ref(navigator.hardwareConcurrency || '-')
const memory = ref((navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '不可用（隐私保护）')
const maxConn = ref('不可用')
const webglVendor = ref('')

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvas2d = ref(false)
const canvasText = ref('')

onMounted(() => {
  // 解析浏览器
  const ua = navigator.userAgent
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/)
  if (match) {
    browser.value = match[1]
    browserVersion.value = match[2]
  } else {
    browser.value = navigator.appName
  }

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
