<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- File → Base64 -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">图片 → Base64</h3>
      <!-- Upload zone -->
      <div
        class="relative mb-3"
        @dragover.prevent="dragOver1 = true"
        @dragleave.prevent="dragOver1 = false"
        @drop.prevent="onDrop1"
      >
        <label
          v-if="!srcPreview"
          class="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition"
          :class="dragOver1 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'"
        >
          <input type="file" accept="image/*" class="hidden" @change="file2b64" />
          <component :is="icons.Upload" class="w-6 h-6 text-slate-300 mb-1" />
          <span class="text-sm text-slate-500">选择图片文件</span>
        </label>
        <div v-else class="relative group rounded-lg overflow-hidden border border-slate-200">
          <img :src="srcPreview" class="w-full h-32 object-contain bg-slate-50" />
          <button
            @click.stop="clearSrc"
            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          >
            <component :is="icons.X" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        v-model="b64output"
        class="w-full h-40 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div v-if="b64output" class="mt-2 flex items-center gap-3 text-xs text-slate-400">
        <span>长度: {{ b64output.length }}</span>
        <CopyButton :text="b64output" label="复制" />
      </div>
    </section>

    <!-- Base64 → File -->
    <section class="bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">Base64 → 图片</h3>
      <textarea
        v-model="b64input"
        placeholder="粘贴 base64 或 data:image/...;base64,..."
        class="w-full h-40 p-3 text-xs rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
      <div v-if="previewUrl" class="mt-3 text-center">
        <img :src="previewUrl" class="max-h-32 rounded-lg border border-slate-200 mx-auto" />
        <button @click="download" class="mt-2 h-8 px-4 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">下载</button>
      </div>
      <div v-else-if="b64input" class="mt-3 text-xs text-red-500">无效的 Base64 图片数据</div>
    </section>
  </div>
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
