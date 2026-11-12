<template>
  <section class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Left: Config -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 space-y-4">
        <div class="flex items-center gap-2 mb-1">
          <component :is="icons.Settings" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.qrcode-generate.contentTypeLabel') }}</span>
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
          <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.contentLabel') }}</label>
          <textarea
            v-model="form.text"
            :placeholder="$t('ui.image.qrcode-generate.contentPlaceholder')"
            class="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
          />
        </div>

        <!-- WiFi -->
        <div v-if="activeType === 'wifi'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.ssidLabel') }}</label>
            <input v-model="form.ssid" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="MyHomeWiFi" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.encryptionLabel') }}</label>
              <select v-model="form.encryption" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">{{ $t('ui.image.qrcode-generate.encryptionOpen') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.passwordLabel') }}</label>
              <input v-model="form.password" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" :placeholder="$t('ui.image.qrcode-generate.passwordPlaceholder')" />
            </div>
          </div>
          <label class="flex items-center gap-2 text-xs text-slate-600">
            <input v-model="form.hidden" type="checkbox" class="rounded" />
            {{ $t('ui.image.qrcode-generate.hiddenNetwork') }}
          </label>
        </div>

        <!-- Email -->
        <div v-if="activeType === 'email'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.recipientLabel') }}</label>
            <input v-model="form.to" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="someone@example.com" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.subjectLabel') }}</label>
            <input v-model="form.subject" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" :placeholder="$t('ui.image.qrcode-generate.optionalPlaceholder')" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.bodyLabel') }}</label>
            <textarea v-model="form.body" class="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 resize-none" :placeholder="$t('ui.image.qrcode-generate.optionalPlaceholder')" />
          </div>
        </div>

        <!-- vCard -->
        <div v-if="activeType === 'vcard'" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.nameLabel') }}</label>
              <input v-model="form.name" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.phoneLabel') }}</label>
              <input v-model="form.phone" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.emailLabel') }}</label>
              <input v-model="form.email" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.companyLabel') }}</label>
              <input v-model="form.org" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" />
            </div>
          </div>
        </div>

        <!-- SMS -->
        <div v-if="activeType === 'sms'" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.phoneNumberLabel') }}</label>
            <input v-model="form.smsPhone" class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200" placeholder="13800000000" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.smsBodyLabel') }}</label>
            <textarea v-model="form.smsBody" class="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 resize-none" :placeholder="$t('ui.image.qrcode-generate.optionalPlaceholder')" />
          </div>
        </div>

        <!-- Style -->
        <div class="pt-3 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <component :is="icons.Palette" class="w-3.5 h-3.5" />
            {{ $t('ui.image.qrcode-generate.styleTitle') }}
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.sizeLabel', { n: size }) }}</label>
              <input v-model.number="size" type="range" min="100" max="600" step="10" class="w-full" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.errorLevelLabel') }}</label>
              <select v-model="level" class="w-full h-9 px-2 text-sm rounded-lg border border-slate-200 bg-white">
                <option value="L">{{ $t('ui.image.qrcode-generate.levelLow') }}</option>
                <option value="M">{{ $t('ui.image.qrcode-generate.levelMedium') }}</option>
                <option value="Q">{{ $t('ui.image.qrcode-generate.levelQuartile') }}</option>
                <option value="H">{{ $t('ui.image.qrcode-generate.levelHigh') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.fgColorLabel') }}</label>
              <input v-model="fgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.bgColorLabel') }}</label>
              <input v-model="bgColor" type="color" class="w-full h-9 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Logo -->
        <div v-if="activeType === 'text'" class="pt-3 border-t border-slate-100 space-y-3">
          <div class="text-xs font-medium text-slate-600 flex items-center justify-between">
            <span class="flex items-center gap-1.5"><component :is="icons.Image" class="w-3.5 h-3.5" />{{ $t('ui.image.qrcode-generate.logoLabel') }}</span>
            <span class="text-[10px] text-slate-400 font-normal">{{ $t('ui.image.qrcode-generate.logoHint') }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
              <img v-if="logoUrl" :src="logoUrl" class="w-full h-full object-contain" />
              <component v-else :is="icons.Image" class="w-5 h-5 text-slate-300" />
            </div>
            <div class="flex-1">
              <label class="inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition">
                <component :is="icons.Upload" class="w-3.5 h-3.5" />{{ $t('ui.image.qrcode-generate.uploadLogo') }}
                <input type="file" accept="image/*" class="hidden" @change="onLogoFile" />
              </label>
              <button v-if="logoUrl" @click="clearLogo" class="ml-2 text-xs text-red-500 hover:text-red-600">{{ $t('ui.image.qrcode-generate.btnRemove') }}</button>
            </div>
          </div>
          <div v-if="logoUrl" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.logoSizeLabel', { n: logoSize }) }}</label>
              <input v-model.number="logoSize" type="range" min="10" max="35" class="w-full" />
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">{{ $t('ui.image.qrcode-generate.logoRadiusLabel', { n: logoRadius }) }}</label>
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
          {{ $t('ui.image.qrcode-generate.btnGenerate') }}
        </button>

        <div v-if="currentText && currentText.length > 2000" class="text-xs text-orange-500 flex items-center gap-1.5 p-2 bg-orange-50 rounded-lg border border-orange-100">
          <component :is="icons.AlertTriangle" class="w-3.5 h-3.5" />
          {{ $t('ui.image.qrcode-generate.longContentHint') }}
        </div>
      </div>

      <!-- Right: Preview + Export -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Eye" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.qrcode-generate.previewTitle') }}</span>
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
            {{ $t('ui.image.qrcode-generate.previewEmptyHint') }}
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
            <component :is="icons.Download" class="w-3.5 h-3.5" />{{ $t('ui.image.qrcode-generate.btnDownloadPng') }}
          </button>
          <button
            @click="downloadSvg"
            class="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <component :is="icons.Download" class="w-3.5 h-3.5" />{{ $t('ui.image.qrcode-generate.btnDownloadSvg') }}
          </button>
          <button
            @click="copyClipboard"
            class="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
            :disabled="copied"
          >
            <component :is="copied ? icons.Check : icons.Copy" class="w-3.5 h-3.5" />{{ copied ? $t('common.copied') : $t('ui.image.qrcode-generate.btnCopyImage') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

// Content types
const contentTypes = computed(() => [
  { value: 'text', label: t('ui.image.qrcode-generate.typeText') },
  { value: 'wifi', label: t('ui.image.qrcode-generate.typeWifi') },
  { value: 'email', label: t('ui.image.qrcode-generate.typeEmail') },
  { value: 'vcard', label: t('ui.image.qrcode-generate.typeVcard') },
  { value: 'sms', label: t('ui.image.qrcode-generate.typeSms') },
])

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
