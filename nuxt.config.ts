import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ============ 多语言 i18n ============
  i18n: {
    strategy: 'prefix_except_default', // 默认语言无前缀,其他语言有前缀 /en/
    defaultLocale: 'zh-CN',
    locales: [
      {
        code: 'zh-CN',
        name: '简体中文',
        file: 'zh-CN.ts',
        iso: 'zh-CN',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.ts',
        iso: 'en-US',
      },
    ],
    // langDir 留空,使用默认值(将自动查找 i18n/locales/ 或 locales/)
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 仅在根路径检测
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  // ============ SEO 配置 ============
  site: {
    url: 'https://qiuyun.tools',
    name: '秋雨工具 - 一站式开发者工具箱',
    description:
      '免费在线开发者工具箱,包含JSON格式化、加密工具、图片处理、代码格式化、前端工具、文档转换等60+实用工具,所有工具纯前端运行,数据不上传更安全。',
    defaultLocale: 'zh-CN',
    identity: {
      type: 'Organization',
      name: '秋雨工具',
    },
    // 多语言站点名称
    locales: {
      'zh-CN': { name: '秋雨工具 - 一站式开发者工具箱' },
      en: { name: 'Qiuyun Tools - All-in-One Developer Toolbox' },
    },
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
    Sitemap: [
      'https://qiuyun.tools/sitemap.xml',
      'https://qiuyun.tools/sitemap-zh-CN.xml',
      'https://qiuyun.tools/sitemap-en.xml',
    ],
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
    routes: [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/en', changefreq: 'daily', priority: 1.0 },
    ],
    // 多语言 sitemap 拆分
    sitemaps: {
      default: {
        include: ['/tools/**'],
        exclude: ['/en/**', '/_nuxt/**'],
        defaults: { changefreq: 'weekly', priority: 0.8 },
      },
      'zh-CN': {
        include: ['/', '/tools/**'],
        exclude: ['/en/**', '/_nuxt/**'],
        defaults: { changefreq: 'weekly', priority: 0.8 },
      },
      en: {
        include: ['/en', '/en/**'],
        exclude: ['/_nuxt/**'],
        defaults: { changefreq: 'weekly', priority: 0.8 },
      },
    },
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
