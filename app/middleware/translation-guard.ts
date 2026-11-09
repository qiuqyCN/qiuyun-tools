/**
 * 未翻译工具页 → 真实 404
 * 只对非默认语言生效；默认语言始终可用。
 */
import { DEFAULT_LOCALE, stripLocalePrefix } from '#shared/locales'

export default defineNuxtRouteMiddleware((to) => {
  const { locale, path } = stripLocalePrefix(to.path)
  if (locale === DEFAULT_LOCALE) return

  const match = path.match(/^\/tools\/([^/]+)\/([^/]+)$/)
  if (!match) return

  const i18n = useI18n()
  const messages = i18n.getLocaleMessage(locale) as Record<string, any>

  // 语言包尚未加载时不误判
  if (!messages || Object.keys(messages).length === 0) return

  const toolKey = `tools.${match[1]}/${match[2]}`
  if (!i18n.te(toolKey)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not translated',
      fatal: true,
    })
  }
})
