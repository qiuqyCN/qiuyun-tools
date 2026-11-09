<template>
  <div class="space-y-5">
    <!-- Encode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.crypto.url-codec.encodeTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.crypto.url-codec.encodeSubtitle') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.url-codec.inputLabel') }}</span>
            <div class="flex items-center gap-3">
              <button @click="raw = $t('ui.crypto.url-codec.exampleRaw')" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="clear1" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <textarea
            v-model="raw"
            :placeholder="$t('ui.crypto.url-codec.inputPlaceholder')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.crypto.url-codec.btnRealtime') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.url-codec.outputLabel') }}</span>
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
            <span>{{ $t('ui.crypto.url-codec.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Decode -->
    <section class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-sm font-semibold text-slate-700">{{ $t('ui.crypto.url-codec.decodeTitle') }}</h3>
        <span class="text-xs text-slate-400">{{ $t('ui.crypto.url-codec.decodeSubtitle') }}</span>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-stretch">
        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.url-codec.inputEncodedLabel') }}</span>
            <div class="flex items-center gap-3">
              <button @click="encodedInput = $t('ui.crypto.url-codec.exampleEncoded')" class="text-xs text-indigo-500 hover:text-indigo-600 hover:underline">📝 {{ $t('common.example') }}</button>
              <button @click="clear2" class="text-xs text-slate-400 hover:text-slate-600">{{ $t('common.clear') }}</button>
            </div>
          </div>
          <textarea
            v-model="encodedInput"
            :placeholder="$t('ui.crypto.url-codec.inputEncodedPlaceholder')"
            class="w-full h-40 p-3 text-sm rounded-lg border border-slate-200 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div class="flex lg:flex-col items-center justify-center shrink-0">
          <button
            disabled
            class="h-10 px-5 rounded-xl bg-indigo-500 text-white text-sm font-medium shadow-sm flex items-center gap-1.5 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <component :is="icons.ArrowRightLeft" class="w-4 h-4" />
            {{ $t('ui.crypto.url-codec.btnRealtime') }}
          </button>
        </div>

        <div class="flex-1 bg-white rounded-xl p-4 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-slate-500">{{ $t('ui.crypto.url-codec.outputDecodedLabel') }}</span>
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
            <span>{{ $t('ui.crypto.url-codec.emptyHint') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'

const { t } = useI18n()

const raw = ref('')
const encodedInput = ref('')
const decodeError = ref('')

const encoded = computed(() => raw.value ? encodeURIComponent(raw.value) : '')

const decoded = computed(() => {
  if (!encodedInput.value) return ''
  decodeError.value = ''
  try {
    return decodeURIComponent(encodedInput.value.trim())
  } catch {
    decodeError.value = t('ui.crypto.url-codec.errInvalidUrl')
    return ''
  }
})

function clear1() { raw.value = '' }
function clear2() { encodedInput.value = ''; decodeError.value = '' }
</script>
