<template>
  <div class="relative" ref="popoverRef">
    <button
      @click="toggle"
      class="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
      :title="$t('site.name')"
    >
      <Globe class="w-4 h-4" />
      <span>{{ currentLocaleName }}</span>
      <ChevronDown class="w-3 h-3 text-slate-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] z-50"
    >
      <button
        v-for="loc in availableLocales"
        :key="loc.code"
        @click="switchLocale(loc.code as string)"
        class="w-full text-left px-3 py-2 text-sm transition flex items-center justify-between"
        :class="
          loc.code === locale
            ? 'text-indigo-600 bg-indigo-50 font-medium'
            : 'text-slate-600 hover:bg-slate-50'
        "
      >
        <span>{{ loc.name }}</span>
        <Check v-if="loc.code === locale" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Globe, ChevronDown, Check } from 'lucide-vue-next'

const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)

const availableLocales = computed(() => locales.value as { code: string; name: string }[])
const currentLocaleName = computed(() => {
  const current = availableLocales.value.find(l => l.code === locale.value)
  return current?.name ?? locale.value
})

function toggle() {
  isOpen.value = !isOpen.value
}

async function switchLocale(code: string) {
  await setLocale(code)
  isOpen.value = false
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
