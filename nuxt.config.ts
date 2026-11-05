import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ============ SEO 配置 ============
  site: {
    url: 'https://qiuyun.tools',
    name: '秋雨工具 - 一站式开发者工具箱',
    description: '免费在线开发者工具箱,包含JSON格式化、加密工具、图片处理、代码格式化、前端工具、文档转换等60+实用工具,所有工具纯前端运行,数据不上传更安全。',
    defaultLocale: 'zh-CN',
    identity: {
      type: 'Organization',
      name: '秋雨工具',
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
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },

  // ============ Robots 配置 ============
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/api/', '/_nuxt/'],
    Sitemap: 'https://qiuyun.tools/sitemap.xml',
  },

  // ============ Sitemap 配置 ============
  sitemap: {
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
      // 首页高优先级
      { loc: '/', changefreq: 'daily', priority: 1.0 },
    ],
  },

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt', '@nuxtjs/seo'],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  }
})