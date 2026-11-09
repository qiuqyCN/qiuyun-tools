import tailwindcss from '@tailwindcss/vite'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, brandName } from './shared/locales'

const localeOptions = LOCALES.map(locale => ({
  code: locale.code,
  name: locale.nativeName,
  file: `${locale.code}.ts`,
  iso: locale.iso,
}))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ============ 多语言 i18n ============
  i18n: {
    strategy: 'prefix_except_default', // 默认语言无前缀，其他语言有前缀
    defaultLocale: DEFAULT_LOCALE,
    locales: localeOptions,
    // 语言包唯一目录：app/locales（相对 i18n restructureDir 解析）
    langDir: '../app/locales',
    lazy: true,
    // 根路径永远渲染默认语言，不做任何自动跳转
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  // ============ SEO 配置 ============
  site: {
    url: 'https://qiuyun.tools',
    name: '秋云工具',
    description:
      '免费在线开发者工具箱,包含JSON格式化、加密工具、图片处理、代码格式化、前端工具、文档转换等60+实用工具,所有工具纯前端运行,数据不上传更安全。',
    defaultLocale: DEFAULT_LOCALE,
    identity: {
      type: 'Organization',
      name: '秋云工具',
    },
    // 多语言站点名称
    locales: Object.fromEntries(LOCALES.map(locale => [locale.code, { name: brandName(locale.code) }])),
  },

  app: {
    head: {
      titleTemplate: '%s %separator %siteName',
      meta: [
        { name: 'theme-color', content: '#6366f1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },

  // ============ Robots 配置 ============
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/api/', '/_nuxt/'],
    Sitemap: [`${SITE_URL}/sitemap_index.xml`],
  },

  // ============ Sitemap 配置(多语言) ============
  sitemap: {
    autoLastmod: true,
    xslColumns: [
      { label: 'URL', width: '65%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12%' },
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
    },
    // 多语言 sitemap：不自定义 sitemaps，交给 @nuxtjs/i18n 集成自动按语言分片
    // （自定义 sitemaps 未带 includeAppSources 会关闭 i18n 映射，导致所有分片为空）
  },

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt', '@nuxtjs/i18n', '@nuxtjs/seo'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
})
