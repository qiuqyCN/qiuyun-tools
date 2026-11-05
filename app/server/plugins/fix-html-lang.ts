// 修正 html lang 属性 — 解决 @nuxtjs/i18n SSR 阶段 locale 检测问题
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlCtx: any, { event }) => {
    const url = event.node.req.url || ''
    const isEn = url.startsWith('/en')
    const correctLang = isEn ? 'en-US' : 'zh-CN'

    // render:html 的 htmlAttrs 是 unhead 处理后的属性字符串
    if (typeof htmlCtx.htmlAttrs === 'string' && htmlCtx.htmlAttrs.includes('lang=')) {
      htmlCtx.htmlAttrs = htmlCtx.htmlAttrs.replace(
        /lang="[^"]*"/,
        `lang="${correctLang}"`
      )
    }
  })
})
