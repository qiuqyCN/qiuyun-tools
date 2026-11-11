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
    // 根路径永远渲染默认语言，不做任何自动跳转
    detectBrowserLanguage: false,
    // regex-tester 的 HTML 示例是纯文本测试数据（不参与渲染），需保留原始尖括号
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  // ============ SEO 配置 ============
  site: {
    url: 'https://tools.qiuyun.dev',
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
      // ============ 第三方统计脚本 ============
      script: [
        // Google Tag Manager（GTM-PXFBGGX3）
        { async: true, src: 'https://www.googletagmanager.com/gtm.js?id=GTM-PXFBGGX3' },
        {
          // eslint-disable-next-line no-script-url
          innerHTML: [
            "window.dataLayer = window.dataLayer || [];",
            "function gtag(){dataLayer.push(arguments);}",
            "gtag('js', new Date());",
          ].join('\n'),
          type: 'text/javascript',
        },
        // 百度统计（hm.js?a7978dcd856e150e2cde981f3ab7ab20）
        {
          innerHTML: [
            'var _hmt = _hmt || [];',
            '(function() {',
            "  var hm = document.createElement('script');",
            "  hm.src = 'https://hm.baidu.com/hm.js?a7978dcd856e150e2cde981f3ab7ab20';",
            "  var s = document.getElementsByTagName('script')[0];",
            '  s.parentNode.insertBefore(hm, s);',
            '})();',
          ].join('\n'),
          type: 'text/javascript',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      // 屏蔽 @nuxtjs/sitemap 自动生成的 /sitemap.xml 跳转壳（与 sitemap_index.xml 重复）
      ignore: ['/sitemap.xml'],
    },
  },

  robots: {
    allow: '/',
    disallow: ['/api/'],
    sitemap: [`${SITE_URL}/sitemap_index.xml`],
  },

  // ============ Sitemap 配置(多语言) ============
  sitemap: {
    autoLastmod: true,
    // 禁用 XSLT：Chrome/Edge 正在移除 XSLT 原生支持，保留会导致浏览器弹出警告
    xsl: false,
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
