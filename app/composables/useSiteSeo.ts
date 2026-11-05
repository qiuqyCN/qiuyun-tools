/**
 * 统一多语言 SEO composable
 * 在 default layout 中调用,自动为所有页面生成正确的 SEO 标签
 * - 首页:自动识别 `/` 和 `/en`
 * - 工具页:自动解析 `/tools/{category}/{tool}` 和 `/en/tools/{category}/{tool}`
 */
import { computed } from 'vue'
import { baseCategories } from '~/data/tools'

// 直接 import locale 文件 — 最可靠的方式
import zhCNLocales from '../locales/zh-CN'
import enLocales from '../locales/en'

const localeMessages: Record<string, any> = {
  'zh-CN': zhCNLocales,
  en: enLocales,
}

function getMsgs(locale: string) {
  return localeMessages[locale] ?? localeMessages['zh-CN']
}

export function useSiteSeo() {
  const route = useRoute()
  const { locale } = useI18n()

  const siteUrl = 'https://qiuyun.tools'
  const allLocales = [
    { code: 'zh-CN', iso: 'zh-CN', ogLocale: 'zh_CN', jsonLdLang: 'zh-CN', siteName: '秋雨工具 - 一站式开发者工具箱', shortName: '秋雨工具' },
    { code: 'en', iso: 'en-US', ogLocale: 'en_US', jsonLdLang: 'en-US', siteName: 'Qiuyun Tools - All-in-One Developer Toolbox', shortName: 'Qiuyun Tools' },
  ]

  const isZhCN = computed(() => locale.value === 'zh-CN')
  const localeConfig = computed(() => allLocales.find(l => l.code === locale.value) ?? allLocales[0]!)

  // ============ 路由类型判断 ============
  const pathSegments = computed(() => {
    const path = route.path.split('?')[0].split('#')[0]
    return path.split('/').filter(Boolean)
  })

  const isToolPage = computed(() => {
    const segs = pathSegments.value
    const toolsIdx = segs.indexOf('tools')
    if (toolsIdx === -1) return false
    return segs.length >= toolsIdx + 3
  })

  const isHomePage = computed(() => {
    const segs = pathSegments.value
    if (segs.length === 0) return true
    if (segs.length === 1 && segs[0] === 'en') return true
    return false
  })

  // ============ 工具页专用解析 ============
  const parsedIds = computed(() => {
    if (!isToolPage.value) return null
    const segs = pathSegments.value
    const toolsIdx = segs.indexOf('tools')
    if (toolsIdx === -1 || segs.length < toolsIdx + 3) return null
    return {
      categoryId: segs[toolsIdx + 1]!,
      toolId: segs[toolsIdx + 2]!,
    }
  })

  // 从 locale 文件直接拿工具文案
  const toolSeoInfo = computed(() => {
    if (!parsedIds.value) return null
    const { categoryId, toolId } = parsedIds.value
    const msgs = getMsgs(locale.value)
    const toolKey = `${categoryId}/${toolId}`
    const tool = msgs.tools?.[toolKey]
    const categoryName = msgs.categories?.[categoryId]?.name ?? categoryId
    const seoKw = msgs.seoKeywords?.[toolKey] ?? ''
    return {
      toolName: tool?.name ?? toolId,
      toolDesc: tool?.desc ?? '',
      categoryName,
      seoKw,
    }
  })

  // ============ URL 构建 ============
  function buildHomeUrl(localeCode: string): string {
    if (localeCode === 'zh-CN') return `${siteUrl}/`
    return `${siteUrl}/${localeCode}`
  }

  function buildToolUrl(localeCode: string): string {
    if (!parsedIds.value) return buildHomeUrl(localeCode)
    const { categoryId, toolId } = parsedIds.value
    const toolPath = `/tools/${categoryId}/${toolId}`
    if (localeCode === 'zh-CN') return `${siteUrl}${toolPath}`
    return `${siteUrl}/${localeCode}${toolPath}`
  }

  const currentUrl = computed(() => {
    if (isHomePage.value) return buildHomeUrl(locale.value)
    if (isToolPage.value) return buildToolUrl(locale.value)
    return `${siteUrl}${route.path}`
  })

  const alternatesMap = computed(() => {
    const result: Record<string, string> = {}
    const buildFn = isToolPage.value ? buildToolUrl : buildHomeUrl
    for (const loc of allLocales) {
      result[loc.code] = buildFn(loc.code)
      if (loc.code === 'zh-CN') result['x-default'] = result[loc.code]
    }
    return result
  })

  // ============ SEO 内容生成 ============
  const totalTools = computed(() => baseCategories.reduce((s, c) => s + c.tools.length, 0))

  // --- Title ---
  const seoTitle = computed(() => {
    if (isHomePage.value) {
      return isZhCN.value ? '免费在线开发者工具箱' : 'Free Online Developer Toolbox'
    }
    if (isToolPage.value && toolSeoInfo.value) {
      const t = toolSeoInfo.value
      return `${t.toolName} - ${t.categoryName}`
    }
    return ''
  })

  // --- Description ---
  const seoDescription = computed(() => {
    if (isHomePage.value) {
      if (isZhCN.value) {
        return `免费在线开发者工具箱,包含${totalTools.value}+实用工具:JSON格式化、加密工具、图片压缩、代码美化、前端CSS生成器、PDF处理、Markdown编辑、日期计算等。所有工具纯前端运行,数据不上传更安全,无需注册即可使用。`
      }
      return `Free online developer toolbox with ${totalTools.value}+ tools: JSON formatter, crypto utilities, image compression, code beautifier, frontend CSS generators, PDF tools, Markdown editor, date calculators and more. All tools run purely in your browser, no data upload required.`
    }
    if (isToolPage.value && toolSeoInfo.value) {
      const t = toolSeoInfo.value
      if (isZhCN.value) {
        return `${t.toolName} - ${t.toolDesc}。${t.categoryName}分类下的在线工具,纯前端运行,数据不上传更安全,免费使用无需注册。`
      }
      return `${t.toolName} - ${t.toolDesc}. An online tool in the ${t.categoryName} category. Runs purely in your browser, no data upload, free to use.`
    }
    return ''
  })

  // --- Keywords ---
  const seoKeywords = computed(() => {
    if (isHomePage.value) {
      const msgs = getMsgs(locale.value)
      if (isZhCN.value) {
        const allToolNames = Object.values(msgs.tools ?? {}).map((t: any) => t.name).join('、')
        return `开发者工具,在线工具,JSON格式化,Base64编码,MD5加密,正则测试,时间戳转换,Cron生成,颜色选择器,二维码生成,图片压缩,PDF合并,Markdown编辑器,BMI计算器,房贷计算器,${allToolNames}`
      }
      const allToolNames = Object.values(msgs.tools ?? {}).map((t: any) => t.name).join(', ')
      return `developer tools,online tools,JSON formatter,Base64,MD5,regex tester,timestamp converter,Cron generator,color picker,QR code generator,image compressor,PDF merger,Markdown editor,BMI calculator,mortgage calculator,${allToolNames}`
    }
    if (isToolPage.value && toolSeoInfo.value) {
      return toolSeoInfo.value.seoKw || toolSeoInfo.value.toolName
    }
    return ''
  })

  // --- OG Title ---
  const ogTitle = computed(() => {
    if (isHomePage.value) {
      return isZhCN.value ? '秋雨工具 - 一站式免费开发者工具箱' : 'Qiuyun Tools - Free All-in-One Developer Toolbox'
    }
    if (isToolPage.value && toolSeoInfo.value) {
      const t = toolSeoInfo.value
      return `${t.toolName} - ${t.categoryName} | ${localeConfig.value.shortName}`
    }
    return localeConfig.value.siteName
  })

  const ogDescription = computed(() => seoDescription.value)
  const ogImage = `${siteUrl}/favicon.png`
  const ogUrl = computed(() => currentUrl.value)
  const ogLocale = computed(() => localeConfig.value.ogLocale)

  // --- Twitter ---
  const twitterTitle = computed(() => ogTitle.value)
  const twitterDescription = computed(() => ogDescription.value)
  const twitterImage = ogImage

  // --- JSON-LD ---
  const jsonLdScript = computed(() => {
    if (isHomePage.value) {
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: localeConfig.value.shortName,
        url: `${siteUrl}/`,
        description: isZhCN.value
          ? '免费在线开发者工具箱,60+实用工具,纯前端运行,数据不上传更安全。'
          : 'Free online developer toolbox with 60+ utilities. All run locally in your browser.',
        author: { '@type': 'Organization', name: '秋雨工具' },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/tools/{search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      })
    }
    if (isToolPage.value && toolSeoInfo.value) {
      const t = toolSeoInfo.value
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t.toolName,
        description: t.toolDesc,
        url: currentUrl.value,
        inLanguage: localeConfig.value.jsonLdLang,
        category: t.categoryName,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: isZhCN.value ? 'CNY' : 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1000' },
      })
    }
    return ''
  })

  // ============ 立即求值(SSR 阶段必须立即触发 computed) ============
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
    ogUrl: _ogUrl,
    ogLocale: _ogLocale,
    ogType: 'website',
    twitterTitle: _ogTitle,
    twitterDescription: _ogDescription,
    twitterImage,
  })

  useHead({
    htmlAttrs: { 'data-seo-lang': _htmlLang },
    meta: [
      ...(_keywords ? [{ name: 'keywords', content: _keywords }] : []),
    ],
    link: [
      { rel: 'canonical', href: _canonical },
      ..._alternates,
    ],
    ...(_jsonLd ? {
      script: [{
        type: 'application/ld+json',
        innerHTML: _jsonLd,
      }],
    } : {}),
  })

  // 客户端响应式更新(切换语言或跳转路由时)
  watch(
    () => [route.fullPath, locale.value],
    () => {
      const lc = allLocales.find(l => l.code === locale.value) ?? allLocales[0]!

      // 重新立即求值
      const title = seoTitle.value
      const desc = seoDescription.value
      const kw = seoKeywords.value
      const ot = ogTitle.value
      const od = ogDescription.value
      const ou = currentUrl.value
      const ol = lc.ogLocale
      const alts = Object.entries(alternatesMap.value).map(([lang, url]) => ({
        rel: 'alternate' as const,
        hreflang: lang,
        href: url,
      }))
      const jld = jsonLdScript.value

      useSeoMeta({
        title, description: desc,
        ogTitle: ot, ogDescription: od, ogImage, ogUrl: ou, ogLocale: ol, ogType: 'website',
        twitterTitle: ot, twitterDescription: od, twitterImage,
      })

      useHead({
        htmlAttrs: { lang: lc.iso },
        meta: [...(kw ? [{ name: 'keywords', content: kw }] : [])],
        link: [{ rel: 'canonical', href: ou }, ...alts],
        ...(jld ? { script: [{ type: 'application/ld+json', innerHTML: jld }] } : {}),
      })
    }
  )
}
