<template>
  <!-- 有内容才渲染整段，避免空的 div 影响布局 -->
  <div v-if="doc" class="mt-8 space-y-6">
    <!-- ============ Intro ============ -->
    <section
      v-if="doc.intro && doc.intro.length > 0"
      class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    >
      <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <component :is="icons.Info" class="w-4 h-4 text-indigo-500" />
        {{ contentTitle.about }}
      </h2>
      <div class="space-y-3 text-sm leading-relaxed text-slate-600">
        <p v-for="(p, i) in doc.intro" :key="i">{{ p }}</p>
      </div>
    </section>

    <!-- ============ FAQ ============ -->
    <section
      v-if="doc.faq && doc.faq.length > 0"
      class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    >
      <h2 class="text-base font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <component :is="icons.HelpCircle" class="w-4 h-4 text-indigo-500" />
        {{ contentTitle.faq }}
      </h2>

      <div class="divide-y divide-slate-100 -mx-2">
        <div
          v-for="(item, i) in doc.faq"
          :key="i"
          class="px-2 py-3"
        >
          <button
            type="button"
            class="faq-trigger w-full flex items-start justify-between gap-3 text-left text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-${i}`"
            @click="toggleFaq(i)"
          >
            <span>{{ i + 1 }}. {{ item.q }}</span>
            <component
              :is="openIndex === i ? icons.ChevronUp : icons.ChevronDown"
              class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"
            />
          </button>
          <div
            v-show="openIndex === i"
            :id="`faq-${i}`"
            class="mt-2 pl-5 text-sm text-slate-500 leading-relaxed"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as icons from 'lucide-vue-next'
import { getToolContent } from '~/data/tool-content'

const props = defineProps<{
  /** 与 tools.ts 里的 key 一致，例如 "dev/json-formatter" */
  toolKey: string
}>()

const { locale } = useI18n()

const doc = computed(() => getToolContent(props.toolKey, locale.value))

// 简短的区块标题，不进 i18n 包，和 legal.ts 的正文模式保持一致
const contentTitle = computed(() => ({
  about: locale.value.startsWith('zh') ? '关于此工具' : 'About this tool',
  faq: locale.value.startsWith('zh') ? '常见问题' : 'Frequently asked questions',
}))

// 默认展开第一个 FAQ，提升首屏可读性；更多由用户点击展开
const openIndex = ref(0)
function toggleFaq(i: number) {
  openIndex.value = openIndex.value === i ? -1 : i
}

// ============ 注入 FAQ JSON-LD 结构化数据 ============
// 必须在 setup 顶层立即求值，让 SSR 把 <script type="application/ld+json"> 输出到 HTML 里
if (import.meta.server) {
  const jsonLd = computed(() => {
    const d = doc.value
    if (!d || !d.faq?.length) return ''
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  })

  useHead({
    script: [
      {
        vif: () => !!jsonLd.value,
        type: 'application/ld+json',
        innerHTML: computed(() => jsonLd.value),
      },
    ],
  })
}
</script>
