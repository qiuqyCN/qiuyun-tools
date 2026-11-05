/**
 * useSeo - 多语言 SEO 统一处理 composable
 * 自动处理 canonical、hreflang alternates、htmlAttrs.lang
 */
export function useSeoMulti(opts: {
  /** 当前页面路径 (可选,默认使用 route.fullPath) */
  path?: string
  /** 当前语言版本是否包含语言前缀 (默认自动判断) */
  includeLocalePrefix?: boolean
}) {
  const siteUrl = 'https://qiuyun.tools'
  const route = useRoute()
  const { locale, locales } = useI18n()

  const currentPath = computed(() => opts.path ?? route.fullPath)

  const currentUrl = computed(() => {
    // 移除潜在的语言前缀,得到基础路径
    const codes = (locales.value ?? []).map(l => l.code)
    let path = currentPath.value
    for (const code of codes) {
      if (path.startsWith(`/${code}`)) {
        path = path.slice(code.length + 1)
        break
      }
    }
    // 默认语言无前缀,其他语言加上前缀
    if (locale.value === 'zh-CN') {
      return `${siteUrl}${path || '/'}`
    }
    return `${siteUrl}/${locale.value}${path || '/'}`
  })

  // 为每种语言版本生成 alternates URL
  const alternates = computed(() => {
    const codes = (locales.value ?? []).map(l => l.code)
    // 先移除当前路径的语言前缀
    let basePath = currentPath.value
    for (const code of codes) {
      if (basePath.startsWith(`/${code}`)) {
        basePath = basePath.slice(code.length + 1)
        break
      }
    }
    if (!basePath.startsWith('/')) basePath = '/' + basePath

    const result: Record<string, string> = {}
    for (const code of codes) {
      if (code === 'zh-CN') {
        result[code] = `${siteUrl}${basePath}`
        result['x-default'] = `${siteUrl}${basePath}`
      } else {
        result[code] = `${siteUrl}/${code}${basePath}`
      }
    }
    return result
  })

  const alternateLinks = computed(() =>
    Object.entries(alternates.value).map(([lang, url]) => ({
      rel: 'alternate',
      hreflang: lang,
      href: url,
    }))
  )

  const canonicalLink = computed(() => ({
    rel: 'canonical',
    href: currentUrl.value,
  }))

  const htmlLangAttr = computed(() => ({
    lang: locale.value === 'zh-CN' ? 'zh-CN' : 'en-US',
  }))

  /** 一键设置 canonical + alternates + html lang */
  function apply() {
    useHead({
      link: [canonicalLink.value, ...alternateLinks.value],
      htmlAttrs: htmlLangAttr.value,
    })
  }

  return {
    siteUrl,
    locale,
    locales,
    currentUrl,
    alternates,
    alternateLinks,
    canonicalLink,
    htmlLangAttr,
    apply,
  }
}
