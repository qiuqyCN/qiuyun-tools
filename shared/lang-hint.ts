/**
 * 根路径语言提示条文案
 * 只在根路径、客户端挂载后、浏览器语言非中文且未被关闭时出现。
 * 文案使用「浏览器语言本身」，因此独立于站内 i18n 语言包（根路径固定渲染中文）。
 */

export interface LangHintText {
  message: string
  action: string
  close: string
}

export const LANG_HINT_TEXT: Record<string, LangHintText> = {
  'zh-TW': {
    message: '偵測到你的瀏覽器偏好繁體中文，是否切換為繁體中文介面？',
    action: '切換為繁體中文',
    close: '關閉',
  },
  en: {
    message: 'This site is available in English.',
    action: 'Switch to English',
    close: 'Dismiss',
  },
  es: {
    message: 'Este sitio está disponible en español.',
    action: 'Cambiar a español',
    close: 'Cerrar',
  },
  'pt-BR': {
    message: 'Este site está disponível em português (Brasil).',
    action: 'Mudar para português',
    close: 'Fechar',
  },
  ru: {
    message: 'Сайт доступен на русском языке.',
    action: 'Переключить на русский',
    close: 'Закрыть',
  },
  id: {
    message: 'Situs ini tersedia dalam Bahasa Indonesia.',
    action: 'Beralih ke Bahasa Indonesia',
    close: 'Tutup',
  },
  vi: {
    message: 'Trang web này có sẵn bằng tiếng Việt.',
    action: 'Chuyển sang tiếng Việt',
    close: 'Đóng',
  },
  ja: {
    message: 'このサイトは日本語でもご利用いただけます。',
    action: '日本語に切り替える',
    close: '閉じる',
  },
  ko: {
    message: '이 사이트는 한국어로도 이용하실 수 있습니다.',
    action: '한국어로 전환',
    close: '닫기',
  },
  de: {
    message: 'Diese Website ist auch auf Deutsch verfügbar.',
    action: 'Auf Deutsch wechseln',
    close: 'Schließen',
  },
  fr: {
    message: 'Ce site est également disponible en français.',
    action: 'Passer au français',
    close: 'Fermer',
  },
  it: {
    message: 'Questo sito è disponibile anche in italiano.',
    action: 'Passa all’italiano',
    close: 'Chiudi',
  },
  tr: {
    message: 'Bu site Türkçe olarak da kullanılabilir.',
    action: 'Türkçeye geç',
    close: 'Kapat',
  },
}

/**
 * 根据浏览器语言推断应提示的语言代码。
 * 中文（简体/未指定）返回 null（不提示），繁体中文提示 zh-TW。
 */
export function detectHintLocale(browserLang: string): string | null {
  const raw = (browserLang || '').toLowerCase().trim()
  if (!raw) return null

  if (raw.startsWith('zh')) {
    return /(tw|hk|mo|hant)/.test(raw) ? 'zh-TW' : null
  }

  const base = raw.split('-')[0]!
  if (base === 'pt') return 'pt-BR'

  for (const code of Object.keys(LANG_HINT_TEXT)) {
    const lower = code.toLowerCase()
    if (lower === raw) return code
    if (lower.split('-')[0] === base) return code
  }
  return null
}
