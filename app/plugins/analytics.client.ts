/**
 * SPA 路由切换时的统计上报
 *
 * Google Analytics 和百度统计默认只在首次页面加载时触发 PV，
 * SPA 内部路由切换不会自动上报，需要在 client 端监听路由变化手动触发。
 *
 * 注意：首屏由 hm.js / GTM 自动上报，这里必须跳过第一次 page:finish，
 * 否则首屏会被重复计一次。同时 GA4 后台需关闭「增强测量 → 基于浏览器历史记录事件」，
 * 避免与本插件重复。
 */

export default defineNuxtPlugin((nuxtApp) => {
  // 跳过服务端（本文件为 .client.ts，此保护仅作双重保险）
  if (import.meta.server) return

  /**
   * 上报一次 PV 到 Google Analytics (gtag) 和百度统计 (_hmt)
   * page_path 直接取 window.location，天然带上语言前缀（如 /ja/tools/...）
   */
  const trackPageview = () => {
    const { pathname, search, hash } = window.location
    const path = `${pathname}${search}${hash}`
    const w = window as any

    // gtag 内部就是 dataLayer.push，不要再手动推一次 dataLayer
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
      })
    }

    // 百度统计
    if (Array.isArray(w._hmt)) {
      w._hmt.push(['_trackPageview', path])
    }
  }

  // page:finish 在首屏渲染完成时同样会触发，首屏已有自动上报，跳过第一次
  let isFirstPage = true
  nuxtApp.hook('page:finish', () => {
    if (isFirstPage) {
      isFirstPage = false
      return
    }
    trackPageview()
  })
})
