<template>
  <div class="space-y-5">
    <!-- Encode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.crypto.base64.encodeTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.crypto.base64.encodeSubtitle') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.base64.inputLabel') }}</span>
            <div class="flex items-center gap-3">
              <button @click="inputText = $t('ui.crypto.base64.exampleText')" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="clear1" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <textarea
            v-model="inputText"
            :placeholder="$t('ui.crypto.base64.inputPlaceholder')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.crypto.base64.btnRealtime') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.base64.outputLabel') }}</span>
            <CopyButton :text="encoded" :label="$t('common.copy')" />
          </div>
          <div
            v-if="encoded"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ encoded }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileJson" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.crypto.base64.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Decode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.crypto.base64.decodeTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.crypto.base64.decodeSubtitle') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.base64.inputBase64Label') }}</span>
            <div class="flex items-center gap-3">
              <button @click="inputBase64 = $t('ui.crypto.base64.exampleBase64')" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="clear2" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <textarea
            v-model="inputBase64"
            :placeholder="$t('ui.crypto.base64.inputBase64Placeholder')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.crypto.base64.btnRealtime') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.base64.textOutput') }}</span>
            <CopyButton :text="decoded" :label="$t('common.copy')" />
          </div>
          <div
            v-if="decodeError"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-red-50 text-red-600 border border-red-100"
          >{{ decodeError }}</div>
          <div
            v-else-if="decoded"
            class="p-3 rounded-lg font-mono text-xs overflow-auto whitespace-pre-wrap break-all min-h-[120px] bg-slate-50 text-slate-700 border border-slate-100"
          >{{ decoded }}</div>
          <div
            v-else
            class="p-3 rounded-lg min-h-[120px] bg-slate-50 text-slate-400 flex flex-col items-center justify-center text-xs gap-1 border border-slate-100"
          >
            <component :is="icons.FileText" class="w-6 h-6 text-slate-300" />
            <span>{{ $t('ui.crypto.base64.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const inputText = ref('')
const inputBase64 = ref('')
const decodeError = ref('')

// UTF-8 兼容的 Base64 编码
const encoded = computed(() => {
  if (!inputText.value) return ''
  try {
    return btoa(unescape(encodeURIComponent(inputText.value)))
  } catch {
    return ''
  }
})

// UTF-8 兼容的 Base64 解码
const decoded = computed(() => {
  if (!inputBase64.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(escape(atob(inputBase64.value.trim())))
  } catch {
    decodeError.value = t('ui.crypto.base64.errInvalidBase64')
    return ''
  }
})

function clear1() { inputText.value = '' }
function clear2() { inputBase64.value = ''; decodeError.value = '' }
</script>
