// 修正 html lang 属性 — 覆盖 nuxt-seo-utils / site-config 写入的默认语言
// 同时处理没有 lang 声明的框架级 error 页（在 prerender 模式下 error 页不走 render:html hook，
// 由 scripts/fix-error-pages.mjs 在 generate 结束后单独修补）
import { getLocaleMeta, stripLocalePrefix } from '../../shared/locales'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlCtx: any, { event }) => {
    const url = event.node.req.url || '/'
    const { locale } = stripLocalePrefix(url)
    const correctLang = getLocaleMeta(locale).iso

    const rewrite = (chunk: string) => {
      if (/lang="[^"]*"/.test(chunk)) {
        return chunk.replace(/lang="[^"]*"/, `lang="${correctLang}"`)
      }
      if (/<html\b[^>]*>/.test(chunk)) {
        return chunk.replace(/<html\b([^>]*)>/, (_m, attrs: string) => {
          return `<html${attrs} lang="${correctLang}">`
        })
      }
      return chunk
    }

    if (Array.isArray(htmlCtx.htmlAttrs)) {
      htmlCtx.htmlAttrs = htmlCtx.htmlAttrs.map(rewrite)
    } else if (typeof htmlCtx.htmlAttrs === 'string') {
      htmlCtx.htmlAttrs = rewrite(htmlCtx.htmlAttrs)
    }
  })
})
