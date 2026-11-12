<template>
  <article class="max-w-3xl mx-auto px-6 py-10">
    <h1 class="text-2xl font-semibold text-slate-800">{{ doc.title }}</h1>
    <p class="mt-2 text-xs text-slate-400">{{ updatedText }}</p>

    <a
      v-if="kind === 'privacy'"
      href="https://qiuyun.dev/privacy"
      target="_blank"
      rel="noopener"
      class="mt-3 inline-flex text-xs text-indigo-600 hover:text-indigo-700 transition"
    >
      {{ isZh ? '查看秋云主站隐私政策总纲' : 'View the main Qiuyun privacy policy' }}
    </a>

    <section v-for="(section, i) in doc.sections" :key="i" class="mt-7">
      <h2 class="text-base font-semibold text-slate-700">{{ section.heading }}</h2>
      <p
        v-for="(paragraph, j) in section.body"
        :key="j"
        class="mt-2 text-sm leading-7 text-slate-600 break-words"
      >
        {{ paragraph }}
      </p>
    </section>

    <NuxtLink
      :to="homePath"
      class="mt-10 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 transition"
    >
      <component :is="icons.ArrowLeft" class="w-4 h-4" />
      {{ backText }}
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { buildLocalePath } from '#shared/locales'
import { getLegalDoc, type LegalKey } from '~/data/legal'

const props = defineProps<{ kind: LegalKey }>()

const { locale } = useI18n()

const isZh = computed(() => locale.value.startsWith('zh'))
const doc = computed(() => getLegalDoc(props.kind, locale.value))
const updatedText = computed(() =>
  (isZh.value ? '最后更新：' : 'Last updated: ') + doc.value.updated,
)
const backText = computed(() => (isZh.value ? '返回首页' : 'Back to home'))
const homePath = computed(() => buildLocalePath(locale.value, '/'))
</script>
