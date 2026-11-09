// 修正 html lang 属性 — 覆盖 nuxt-seo-utils / site-config 写入的默认语言
import { getLocaleMeta, stripLocalePrefix } from '../../shared/locales'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlCtx: any, { event }) => {
    const url = event.node.req.url || '/'
    const { locale } = stripLocalePrefix(url)
    const correctLang = getLocaleMeta(locale).iso
    const rewrite = (chunk: string) => chunk.replace(/lang="[^"]*"/, `lang="${correctLang}"`)

    // Nitro 的 htmlAttrs 是字符串数组（每个 chunk 会被 joinAttrs 拼接）
    if (Array.isArray(htmlCtx.htmlAttrs)) {
      htmlCtx.htmlAttrs = htmlCtx.htmlAttrs.map(rewrite)
    } else if (typeof htmlCtx.htmlAttrs === 'string') {
      htmlCtx.htmlAttrs = rewrite(htmlCtx.htmlAttrs)
    }
  })
})
