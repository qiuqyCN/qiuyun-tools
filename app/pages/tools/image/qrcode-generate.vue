<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">二维码生成</h3>
      <span class="text-xs text-slate-400">支持文本、WiFi、Email、vCard 等多种类型，可自定义样式和 Logo</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Left: Config -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 space-y-4">
        <div class="flex items-center gap-2 mb-1">
          <component :is="icons.Settings" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">内容类型</span>
        </div>

        <!-- Content type tabs -->
        <div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="t in contentTypes"
              :key="t.value"
              @click="activeType = t.value"
              class="px-3 py-1.5 text-xs rounded-lg border transition"
              :class="activeType === t.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-indigo-300'"
            >{{ t.label }}</button>
          </div>
        </div>

        <!-- Custom text -->
        <div v-if="activeType === 'text'">
          <label class="block text-xs text-slate-400 mb-1">内容</label>
          <textarea
            v-model="form.text"
            placeholder="输入文字或 URL..."
            class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
          />
        </div>

        <!-- WiFi -->
        <div v-if="activeType === 'wifi'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">SSID（网络名称）</label>
            <input v-model="form.ssid" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="MyHomeWiFi" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">加密方式</label>
              <select v-model="form.encryption" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">开放网络</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">密码</label>
              <input v-model="form.password" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="留空表示开放" />
            </div>
          </div>
          <label class="flex items-center gap-2 text-xs text-slate-600">
            <input v-model="form.hidden" type="checkbox" class="rounded" />
            隐藏网络（不广播 SSID）
          </label>
        </div>

        <!-- Email -->
        <div v-if="activeType === 'email'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">收件人</label>
            <input v-model="form.to" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="someone@example.com" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">主题</label>
            <input v-model="form.subject" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="可选" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">正文</label>
            <textarea v-model="form.body" class="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 resize-none" placeholder="可选" />
          </div>
        </div>

        <!-- vCard -->
        <div v-if="activeType === 'vcard'" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">姓名</label>
              <input v-model="form.name" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">电话</label>
              <input v-model="form.phone" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">邮箱</label>
              <input v-model="form.email" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">公司</label>
              <input v-model="form.org" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
          </div>
        </div>

        <!-- SMS -->
        <div v-if="activeType === 'sms'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">手机号码</label>
            <input v-model="form.smsPhone" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="13800000000" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">短信内容</label>
            <textarea v-model="form.smsBody" class="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 resize-none" placeholder="可选" />
          </div>
        </div>

        <!-- Style -->
        <div class="pt-3 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <component :is="icons.Palette" class="w-3.5 h-3.5" />
            样式配置
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">尺寸: {{ size }}px</label>
              <input v-model.number="size" type="range" min="100" max="600" step="10" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">容错级别</label>
              <select v-model="level" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
                <option value="L">低 (7%)</option>
                <option value="M">中 (15%)</option>
                <option value="Q">较高 (25%)</option>
                <option value="H">高 (30%)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">前景色</label>
              <input v-model="fgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">背景色</label>
              <input v-model="bgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Logo -->
        <div v-if="activeType === 'text'" class="pt-3 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center justify-between">
            <span class="flex items-center gap-1.5"><component :is="icons.Image" class="w-3.5 h-3.5" />中心 Logo</span>
            <span class="text-[10px] text-slate-400 font-normal">建议容错设为 H</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
              <img v-if="logoUrl" :src="logoUrl" class="w-full h-full object-contain" />
              <component v-else :is="icons.Image" class="w-5 h-5 text-slate-300" />
            </div>
            <div class="flex-1">
              <label class="inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition">
                <component :is="icons.Upload" class="w-3.5 h-3.5" />上传 Logo
                <input type="file" accept="image/*" class="hidden" @change="onLogoFile" />
              </label>
              <button v-if="logoUrl" @click="clearLogo" class="ml-2 text-xs text-red-500 hover:text-red-600">移除</button>
            </div>
          </div>
          <div v-if="logoUrl" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Logo 大小: {{ logoSize }}%</label>
              <input v-model.number="logoSize" type="range" min="10" max="35" class="w-full" />
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">圆角: {{ logoRadius }}px</label>
              <input v-model.number="logoRadius" type="range" min="0" max="30" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Generate -->
        <button
          @click="generate"
          :disabled="!canGenerate"
          class="w-full h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-1.5 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <component :is="icons.QrCode" class="w-4 h-4" />
          生成二维码
        </button>

        <div v-if="currentText && currentText.length > 2000" class="text-xs text-orange-500 flex items-center gap-1.5 p-2 bg-orange-50 rounded-lg border border-orange-100">
          <component :is="icons.AlertTriangle" class="w-3.5 h-3.5" />
          内容较长，建议容错级别调高到 Q 或 H
        </div>
      </div>

      <!-- Right: Preview + Export -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">预览</span>
        </div>

        <div
          class="flex-1 flex items-center justify-center rounded-lg border border-slate-200 min-h-[280px] p-4"
          :style="{ backgroundColor: generated ? bgColor : 'rgb(248 250 252)' }"
        >
          <template v-if="generated">
            <canvas v-show="!showSvg" ref="canvasRef" class="rounded" />
            <div v-show="showSvg" class="p-2 rounded" v-html="svgOutput" />
          </template>
          <div v-else class="text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <component :is="icons.QrCode" class="w-12 h-12 mx-auto text-slate-300" />
            点击左侧「生成二维码」按钮开始
          </div>
        </div>

        <!-- Current text preview -->
        <div v-if="generated && currentText" class="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono break-all max-h-24 overflow-auto border border-slate-100">
          {{ currentText }}
        </div>

        <!-- Export buttons -->
        <div v-if="generated" class="mt-3 flex flex-wrap items-center gap-2">
          <button
            @click="downloadPng"
            class="h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1.5 transition"
          >
            <component :is="icons.Download" class="w-3.5 h-3.5" />下载 PNG
          </button>
          <button
            @click="downloadSvg"
            class="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <component :is="icons.Download" class="w-3.5 h-3.5" />下载 SVG
          </button>
          <button
            @click="copyClipboard"
            class="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
            :disabled="copied"
          >
            <component :is="copied ? icons.Check : icons.Copy" class="w-3.5 h-3.5" />{{ copied ? '已复制' : '复制图片' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import * as icons from 'lucide-vue-next'

// Content types
const contentTypes = [
  { value: 'text', label: '自定义文本' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'email', label: 'Email' },
  { value: 'vcard', label: 'vCard' },
  { value: 'sms', label: '短信' },
]

const activeType = ref('text')

// Form data — each type has its own fields
const form = reactive({
  // text
  text: 'https://github.com',
  // wifi
  ssid: '',
  password: '',
  encryption: 'WPA' as 'WPA' | 'WEP' | 'nopass',
  hidden: false,
  // email
  to: '',
  subject: '',
  body: '',
  // vcard
  name: '',
  phone: '',
  email: '',
  org: '',
  // sms
  smsPhone: '',
  smsBody: '',
})

// Style
const size = ref(220)
const level = ref('M')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')

// Logo
const logoUrl = ref('')
const logoImg = ref<HTMLImageElement | null>(null)
const logoSize = ref(20) // % of QR size
const logoRadius = ref(6)

function onLogoFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    logoImg.value = img
    if (logoUrl.value) URL.revokeObjectURL(logoUrl.value)
    logoUrl.value = url
  }
  img.src = url
}

function clearLogo() {
  if (logoUrl.value) URL.revokeObjectURL(logoUrl.value)
  logoUrl.value = ''
  logoImg.value = null
}

// State
const canvasRef = ref<HTMLCanvasElement | null>(null)
const generated = ref(false)
const currentText = ref('')
const showSvg = ref(false)
const svgOutput = ref('')
const copied = ref(false)

function buildContent(): string {
  switch (activeType.value) {
    case 'text':
      return form.text
    case 'wifi': {
      const enc = form.encryption === 'nopass' ? 'nopass' : form.encryption
      const S = form.ssid.replace(/([\\;,":])/g, '\\$1')
      const P = form.password.replace(/([\\;,":])/g, '\\$1')
      return `WIFI:T:${enc};S:${S}${P ? `;P:${P}` : ''}${form.hidden ? ';H:true' : ''};;`
    }
    case 'email': {
      const params = new URLSearchParams()
      if (form.subject) params.set('subject', form.subject)
      if (form.body) params.set('body', form.body)
      const qs = params.toString()
      return `mailto:${form.to}${qs ? '?' + qs : ''}`
    }
    case 'vcard': {
      const lines = ['BEGIN:VCARD', 'VERSION:3.0']
      if (form.name) lines.push(`FN:${form.name}`)
      if (form.phone) lines.push(`TEL:${form.phone}`)
      if (form.email) lines.push(`EMAIL:${form.email}`)
      if (form.org) lines.push(`ORG:${form.org}`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
    case 'sms':
      return `SMSTO:${form.smsPhone}:${form.smsBody}`
    default:
      return ''
  }
}

const canGenerate = computed(() => {
  const content = buildContent()
  return content.trim().length > 0
})

async function generate() {
  showSvg.value = false
  svgOutput.value = ''
  const content = buildContent()
  if (!content.trim()) return
  currentText.value = content

  if (!canvasRef.value) return
  try {
    await QRCode.toCanvas(canvasRef.value, content, {
      width: size.value,
      errorCorrectionLevel: level.value as any,
      color: { dark: fgColor.value, light: bgColor.value },
      margin: 2,
    })
    // Overlay logo if present
    if (logoImg.value) {
      const canvas = canvasRef.value
      const ctx = canvas.getContext('2d')!
      const qrSize = canvas.width
      const logoPx = Math.round(qrSize * (logoSize.value / 100))
      const x = (qrSize - logoPx) / 2
      const y = (qrSize - logoPx) / 2
      const r = Math.round(logoRadius.value * (qrSize / 220))

      // Helper: rounded rect path (compatible with all browsers)
      const roundedRect = (cx: number, cy: number, cw: number, ch: number, cr: number) => {
        ctx.beginPath()
        ctx.moveTo(cx + cr, cy)
        ctx.lineTo(cx + cw - cr, cy)
        ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + cr)
        ctx.lineTo(cx + cw, cy + ch - cr)
        ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - cr, cy + ch)
        ctx.lineTo(cx + cr, cy + ch)
        ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - cr)
        ctx.lineTo(cx, cy + cr)
        ctx.quadraticCurveTo(cx, cy, cx + cr, cy)
        ctx.closePath()
      }

      ctx.save()
      // White background square behind logo
      ctx.fillStyle = bgColor.value
      roundedRect(x - 4, y - 4, logoPx + 8, logoPx + 8, r + 2)
      ctx.fill()
      // Clip logo to rounded rect
      roundedRect(x, y, logoPx, logoPx, r)
      ctx.clip()
      ctx.drawImage(logoImg.value, x, y, logoPx, logoPx)
      ctx.restore()
    }
    generated.value = true
  } catch (e) {
    console.error(e)
  }
}

function downloadPng() {
  if (!canvasRef.value) return
  showSvg.value = false
  const a = document.createElement('a')
  a.download = 'qrcode.png'
  a.href = canvasRef.value.toDataURL('image/png')
  a.click()
}

async function downloadSvg() {
  const content = buildContent()
  if (!content) return
  try {
    const svg = await QRCode.toString(content, {
      type: 'svg',
      width: size.value,
      errorCorrectionLevel: level.value as any,
      color: { dark: fgColor.value, light: bgColor.value },
      margin: 2,
    })
    // Show preview
    svgOutput.value = svg
    showSvg.value = true
    // Download
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.svg'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    console.error(e)
  }
}

async function copyClipboard() {
  if (!canvasRef.value) return
  try {
    const blob: Blob = await new Promise(res => canvasRef.value!.toBlob(b => res(b as Blob), 'image/png'))
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    // fallback: copy data URL text
    try {
      await navigator.clipboard.writeText(canvasRef.value.toDataURL('image/png'))
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
