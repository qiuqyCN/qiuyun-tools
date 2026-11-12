/**
 * 统一多语言 SEO composable
 * 在 default layout 中调用，自动为所有页面生成正确的 SEO 标签
 * 语言表来自 shared/locales.ts，文案来自当前语言包（$t），不再有中/英二元分支。
 */
import { computed, watch } from 'vue'
import { baseCategories } from '~/data/tools'
import { getLegalDoc, type LegalKey } from '~/data/legal'
import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_URL,
  brandName,
  buildAbsoluteUrl,
  buildHreflangMap,
  getLocaleMeta,
  stripLocalePrefix,
} from '#shared/locales'

export function useSiteSeo() {
  const route = useRoute()
  const { locale, t } = useI18n()

  const localeConfig = computed(() => getLocaleMeta(locale.value))

  // ============ 路由解析（剥离语言前缀） ============
  const innerPath = computed(() => stripLocalePrefix(route.path).path)

  const toolIds = computed(() => {
    const match = innerPath.value.match(/^\/tools\/([^/]+)\/([^/]+)$/)
    if (!match) return null
    return { categoryId: match[1]!, toolId: match[2]! }
  })

  const isHomePage = computed(() => innerPath.value === '/')
  const isToolPage = computed(() => toolIds.value !== null)

  // ============ 法务 / 信任页（privacy、terms、about、contact、disclaimer） ============
  const LEGAL_KEYS: LegalKey[] = ['privacy', 'terms', 'about', 'contact', 'disclaimer']
  const legalKey = computed<LegalKey | null>(() => {
    const p = innerPath.value.replace(/^\/+|\/+$/g, '')
    return LEGAL_KEYS.includes(p as LegalKey) ? (p as LegalKey) : null
  })
  const legalDoc = computed(() => (legalKey.value ? getLegalDoc(legalKey.value, locale.value) : null))

  // ============ 工具文案 ============
  const toolSeoInfo = computed(() => {
    if (!toolIds.value) return null
    const { categoryId, toolId } = toolIds.value
    const toolKey = `${categoryId}/${toolId}`

    return {
      toolName: t(`tools.${toolKey}.name`),
      toolDesc: t(`tools.${toolKey}.desc`),
      categoryName: t(`categories.${categoryId}.name`),
      seoKw: t(`seoKeywords.${toolKey}`),
    }
  })

  // ============ URL ============
  const buildPath = (): string => {
    if (legalKey.value) return `/${legalKey.value}`
    if (!toolIds.value) return '/'
    return `/tools/${toolIds.value.categoryId}/${toolIds.value.toolId}`
  }

  const currentUrl = computed(() => buildAbsoluteUrl(locale.value, buildPath()))

  const alternatesMap = computed(() => buildHreflangMap(buildPath()))

  // ============ SEO 内容 ============
  const totalTools = computed(() => baseCategories.reduce((sum, cat) => sum + cat.tools.length, 0))

  const siteName = computed(() => brandName(locale.value))

  const seoTitle = computed(() => {
    if (legalDoc.value) return legalDoc.value.title
    if (isHomePage.value) return t('seo.homeTitle')
    if (toolSeoInfo.value) return `${toolSeoInfo.value.toolName} - ${toolSeoInfo.value.categoryName}`
    return ''
  })

  const seoDescription = computed(() => {
    if (legalDoc.value) return legalDoc.value.description
    if (isHomePage.value) {
      return t('seo.homeDescription', { count: totalTools.value })
    }
    if (toolSeoInfo.value) {
      return t('seo.toolDescription', {
        name: toolSeoInfo.value.toolName,
        desc: toolSeoInfo.value.toolDesc,
        category: toolSeoInfo.value.categoryName,
      })
    }
    return ''
  })

  const seoKeywords = computed(() => {
    if (isHomePage.value) {
      const names = baseCategories
        .flatMap(category => category.tools.map(tool => t(`tools.${category.id}/${tool.id}.name`)))
        .join(t('seo.listSeparator'))
      const core = t('seo.homeKeywords')
      return core ? `${core}${t('seo.listSeparator')}${names}` : names
    }
    if (toolSeoInfo.value) {
      return toolSeoInfo.value.seoKw || toolSeoInfo.value.toolName
    }
    return ''
  })

  const ogTitle = computed(() => {
    if (legalDoc.value) return `${legalDoc.value.title} | ${siteName.value}`
    if (isHomePage.value) return t('seo.homeOgTitle')
    if (toolSeoInfo.value) {
      return `${toolSeoInfo.value.toolName} - ${toolSeoInfo.value.categoryName} | ${siteName.value}`
    }
    return siteName.value
  })

  const ogDescription = computed(() => seoDescription.value)
  const ogImage = `${SITE_URL}/og.png`
  const ogUrl = computed(() => currentUrl.value)
  const ogLocale = computed(() => localeConfig.value.ogLocale)

  const jsonLdScript = computed(() => {
    if (isHomePage.value) {
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName.value,
        url: buildAbsoluteUrl(locale.value, '/'),
        inLanguage: localeConfig.value.iso,
        description: t('seo.homeJsonLdDescription', { count: totalTools.value }),
        author: { '@type': 'Organization', name: siteName.value },
      })
    }
    if (toolSeoInfo.value) {
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolSeoInfo.value.toolName,
        description: toolSeoInfo.value.toolDesc,
        url: currentUrl.value,
        inLanguage: localeConfig.value.iso,
        category: toolSeoInfo.value.categoryName,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: locale.value === 'zh-CN' || locale.value === 'zh-TW' ? 'CNY' : 'USD',
        },
      })
    }
    return ''
  })

  // ============ 立即求值（SSR 阶段必须立即触发 computed） ============
  const _title = seoTitle.value
  const _description = seoDescription.value
  const _keywords = seoKeywords.value
  const _ogTitle = ogTitle.value
  const _ogDescription = ogDescription.value
  const _ogUrl = ogUrl.value
  const _ogLocale = ogLocale.value
  const _canonical = currentUrl.value
  const _alternates = Object.entries(alternatesMap.value).map(([lang, url]) => ({
    rel: 'alternate' as const,
    hreflang: lang,
    href: url,
  }))
  const _jsonLd = jsonLdScript.value
  const _htmlLang = localeConfig.value.iso

  // ============ 应用 SEO ============
  useSeoMeta({
    title: _title,
    description: _description,
    ogTitle: _ogTitle,
    ogDescription: _ogDescription,
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: _ogUrl,
    ogLocale: _ogLocale,
    ogType: 'website',
  })

  useHead({
    htmlAttrs: { lang: _htmlLang },
    meta: [...(_keywords ? [{ name: 'keywords', content: _keywords }] : [])],
    link: [{ rel: 'canonical', href: _canonical }, ..._alternates],
    ...(_jsonLd
      ? { script: [{ type: 'application/ld+json', innerHTML: _jsonLd }] }
      : {}),
  })

  // 客户端响应式更新（切换语言或跳转路由时）
  watch(
    () => [route.fullPath, locale.value],
    () => {
      const lc = getLocaleMeta(locale.value)
      const kw = seoKeywords.value
      const jld = jsonLdScript.value

      useSeoMeta({
        title: seoTitle.value,
        description: seoDescription.value,
        ogTitle: ogTitle.value,
        ogDescription: ogDescription.value,
        ogImage,
        ogImageWidth: 1200,
        ogImageHeight: 630,
        ogUrl: currentUrl.value,
        ogLocale: lc.ogLocale,
        ogType: 'website',
      })

      useHead({
        htmlAttrs: { lang: lc.iso },
        meta: [...(kw ? [{ name: 'keywords', content: kw }] : [])],
        link: [
          { rel: 'canonical', href: currentUrl.value },
          ...Object.entries(alternatesMap.value).map(([lang, url]) => ({
            rel: 'alternate' as const,
            hreflang: lang,
            href: url,
          })),
        ],
        ...(jld ? { script: [{ type: 'application/ld+json', innerHTML: jld }] } : {}),
      })
    },
  )
}

export { LOCALES, DEFAULT_LOCALE }
