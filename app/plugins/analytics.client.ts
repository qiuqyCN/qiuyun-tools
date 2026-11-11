/**
 * SPA 路由切换时的统计上报
 *
 * Google Analytics 和百度统计默认只在首次页面加载时触发 PV，
 * SPA 内部路由切换不会自动上报，需要在 client 端监听路由变化手动触发。
 */

export default defineNuxtPlugin((nuxtApp) => {
  // 跳过服务端（本文件为 .client.ts，此保护仅作双重保险）
  if (import.meta.server) return

  const getCurrentPath = () => {
    const { pathname, search, hash } = window.location
    return `${pathname}${search}${hash}`
  }

  /**
   * 上报一次 PV 到 Google Analytics (gtag) 和百度统计 (_hmt)
   */
  const trackPageview = () => {
    const path = getCurrentPath()

    // Google Analytics (gtag / dataLayer)
    const w = window as any
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
      })
    }
    // 兜底：即使 gtag 未初始化，也向 dataLayer 推送
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'page_view', page_path: path })
    }

    // 百度统计
    if (Array.isArray(w._hmt)) {
      w._hmt.push(['_trackPageview', path])
    }
  }

  // Nuxt 路由切换完成后触发 page:finish
  nuxtApp.hook('page:finish', () => {
    trackPageview()
  })
})
