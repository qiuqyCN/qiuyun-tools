<template>
  <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.image.image-base64.title') }}</h3>
      <span class="text-xs text-slate-400">{{ $t('ui.image.image-base64.subtitle') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- File → Base64 -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.Repeat" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-base64.imageToBase64Label') }}</span>
        </div>
        <!-- Upload zone -->
        <div
          class="relative mb-3"
          @dragover.prevent="dragOver1 = true"
          @dragleave.prevent="dragOver1 = false"
          @drop.prevent="onDrop1"
        >
          <label
            v-if="!srcPreview"
            class="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition"
            :class="dragOver1 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
          >
            <input type="file" accept="image/*" class="hidden" @change="file2b64" />
            <component :is="icons.ImageUp" class="w-6 h-6 text-slate-300 mb-1" />
            <span class="text-sm text-slate-500">{{ $t('ui.image.image-base64.uploadHint') }}</span>
          </label>
          <div v-else class="relative group rounded-lg overflow-hidden border border-slate-200">
            <img :src="srcPreview" class="w-full h-32 object-contain bg-slate-50" />
            <button
              @click.stop="clearSrc"
              class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
            >
              <component :is="icons.X" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <textarea
          v-model="b64output"
          class="w-full h-40 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          :placeholder="srcPreview ? '' : $t('ui.image.image-base64.outputPlaceholder')"
        />
        <div v-if="b64output" class="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span>{{ $t('ui.image.image-base64.lengthLabel', { n: b64output.length }) }}</span>
          <CopyButton :text="b64output" :label="$t('common.copy')" />
        </div>
      </div>

      <!-- Base64 → File -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <component :is="icons.FileImage" class="w-4 h-4 text-indigo-400" />
          <span class="text-xs font-medium text-slate-500">{{ $t('ui.image.image-base64.base64ToImageLabel') }}</span>
        </div>
        <textarea
          v-model="b64input"
          :placeholder="$t('ui.image.image-base64.inputPlaceholder')"
          class="w-full h-40 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />
        <div v-if="previewUrl" class="mt-3 text-center">
          <img :src="previewUrl" class="max-h-32 rounded-lg border border-slate-200 mx-auto shadow-sm" />
          <button
            @click="download"
            class="mt-2 h-9 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium shadow-sm flex items-center gap-1.5 mx-auto transition"
          >
            <component :is="icons.Download" class="w-3.5 h-3.5" />
            {{ $t('ui.image.image-base64.btnDownload') }}
          </button>
        </div>
        <div v-else-if="b64input" class="mt-3 text-xs text-red-500 flex items-center gap-1.5">
          <component :is="icons.AlertTriangle" class="w-4 h-4" />
          {{ $t('ui.image.image-base64.errInvalidBase64') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const b64output = ref('')
const b64input = ref('')
const previewUrl = ref('')
const srcPreview = ref('')
const dragOver1 = ref(false)

function clearSrc() {
  if (srcPreview.value.startsWith('blob:')) URL.revokeObjectURL(srcPreview.value)
  srcPreview.value = ''
  b64output.value = ''
}

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return
  const url = URL.createObjectURL(file)
  srcPreview.value = url
  const reader = new FileReader()
  reader.onload = () => { b64output.value = reader.result as string }
  reader.readAsDataURL(file)
}

function file2b64(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function onDrop1(e: DragEvent) {
  dragOver1.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

watch(b64input, () => {
  const raw = b64input.value.trim()
  if (!raw) { previewUrl.value = ''; return }
  const dataUri = raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`
  try {
    const b64 = raw.startsWith('data:') ? raw.split(',')[1] : raw
    atob(b64)
    previewUrl.value = dataUri
  } catch {
    previewUrl.value = ''
  }
})

function download() {
  if (!previewUrl.value) return
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = 'image.png'
  a.click()
}
</script>
