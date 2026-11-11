/**
 * 法务 / 信任页内容（隐私政策、服务条款、关于我们、联系我们、免责声明）
 *
 * 只维护中文与英文两份正文；其他语言回退到英文，避免 14 份法律文本需要同步维护。
 * 页面通过 components/LegalPage.vue 渲染，SEO 由 composables/useSiteSeo.ts 读取。
 */

export type LegalKey = 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer'
export type LegalLang = 'zh' | 'en'

export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalDoc {
  title: string
  description: string
  updated: string
  sections: LegalSection[]
}

export const CONTACT_EMAIL = 'contact@qiuyun.dev'

const UPDATED = '2026-11-11'

export const legalDocs: Record<LegalKey, Record<LegalLang, LegalDoc>> = {
  privacy: {
    zh: {
      title: '隐私政策',
      description: '秋云工具的隐私政策：工具运算全部在浏览器本地完成，说明我们不收集什么、收集哪些统计信息以及你享有的权利。',
      updated: UPDATED,
      sections: [
        {
          heading: '一、核心承诺',
          body: [
            '秋云工具（tools.qiuyun.dev，以下称"本站"）是一个纯前端工具站。所有工具的计算过程都在你的浏览器内完成，你输入的文本、代码、图片、PDF 或其他文件不会上传到我们的服务器，也不会被我们保存、读取或转存。',
            '关闭网页后，工具产生的中间数据即从内存中释放。本站没有账号系统，不需要注册即可使用全部功能。',
          ],
        },
        {
          heading: '二、我们收集的信息',
          body: [
            '1. 服务器访问日志：包括 IP 地址、浏览器标识（User-Agent）、访问路径、状态码与时间。仅用于安全防护、故障排查与容量评估，保留 30 天。',
            '2. 匿名访问统计：本站使用 Google Analytics 4（通过 Google Tag Manager）与百度统计，收集页面浏览量、来源渠道、设备类型、屏幕尺寸、大致地理位置（城市级）等聚合数据，用于了解哪些工具被使用、页面是否需要优化。',
            '3. 安全防护：本站通过 Cloudflare 提供 CDN 与安全防护，Cloudflare 可能写入 __cf_bm 等 Cookie 用于识别自动化流量。',
            '我们不收集工具输入内容，不收集姓名、手机号、身份证件等个人信息，也不建立用于广告定向的用户画像。',
          ],
        },
        {
          heading: '三、Cookie 与类似技术',
          body: [
            '本站自身不使用 Cookie 存储业务数据（语言提示条的关闭状态保存在浏览器 localStorage 中，不会发送到服务器）。以下 Cookie 来自第三方服务：',
            '· _ga、_ga_* —— Google Analytics，用于区分访问者与统计会话，有效期约 2 年。',
            '· _gid —— Google Analytics，用于区分访问者，有效期 24 小时。',
            '· HMACCOUNT、HMVT —— 百度统计，用于统计独立访客与访问行为，有效期约 1 年。',
            '· __cf_bm —— Cloudflare，用于机器人检测，有效期 30 分钟。',
            '你可以通过浏览器设置拒绝或清除 Cookie，本站的工具功能不依赖 Cookie，禁用后仍可正常使用。',
          ],
        },
        {
          heading: '四、我们不会做的事',
          body: [
            '我们不会出售、出租或交易你的任何数据；不会把工具输入内容用于训练模型；不会在未经你同意的情况下向第三方共享可用于识别个人身份的信息；不会要求你绑定手机号或提供实名信息。',
          ],
        },
        {
          heading: '五、关于广告（未来可能启用）',
          body: [
            '本站目前未投放任何广告。若未来接入 Google AdSense，将适用以下条款：',
            '第三方供应商（包括 Google）会使用 Cookie 根据你此前对本站或其他网站的访问投放广告；Google 使用广告 Cookie 使其及其合作伙伴能够根据你对本站及互联网其他网站的访问展示广告。',
            `你可以访问 Google 广告设置（https://adssettings.google.com）管理或退出个性化广告，也可以访问 https://www.aboutads.info 了解如何退出部分第三方供应商的个性化广告。`,
            '启用广告前，本政策会先行更新，并在页面上提供对应的同意选项。',
          ],
        },
        {
          heading: '六、数据保留期限',
          body: [
            '服务器访问日志保留 30 天。Google Analytics 数据按账号默认设置保留 14 个月，百度统计按平台默认策略保留。聚合后的统计数据可能长期保留，但已无法关联到任何个人。',
          ],
        },
        {
          heading: '七、你的权利',
          body: [
            '依据 GDPR、CCPA 等适用法律，你有权访问、更正、删除与你相关的数据，有权反对或限制处理，有权撤回此前的同意，也有权向所在地的数据保护机构投诉。',
            `如需行使上述权利，请发送邮件至 ${CONTACT_EMAIL}，我们将在 30 天内答复。`,
          ],
        },
        {
          heading: '八、儿童隐私',
          body: [
            '本站不面向 13 岁以下儿童，也不会有意收集儿童的个人信息。若你发现儿童向我们提供了信息，请联系我们删除。',
          ],
        },
        {
          heading: '九、政策变更',
          body: [
            '本政策更新时，页面顶部的"最后更新"日期会同步修改。若涉及重大变更（例如新增广告或新的第三方统计），我们会在站点显著位置提示。',
          ],
        },
        {
          heading: '十、联系我们',
          body: [
            `如对本政策有任何疑问，请联系：${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      description: 'Privacy policy for Qiuyun Tools: every tool runs locally in your browser. Learn what we do not collect, which analytics we use, and your rights.',
      updated: UPDATED,
      sections: [
        {
          heading: '1. Our core commitment',
          body: [
            'Qiuyun Tools (tools.qiuyun.dev, the "Site") is a client-side toolbox. Every tool computes inside your browser. The text, code, images, PDFs and other files you enter are never uploaded to our servers, and we never store, read or copy them.',
            'Intermediate data is released from memory when you close the page. There is no account system: every tool is usable without signing up.',
          ],
        },
        {
          heading: '2. Information we collect',
          body: [
            '1. Server access logs: IP address, user agent, requested path, status code and timestamp. Used only for security, troubleshooting and capacity planning; retained for 30 days.',
            '2. Anonymous analytics: the Site uses Google Analytics 4 (via Google Tag Manager) and Baidu Analytics to collect aggregated data such as page views, referral source, device type, screen size and approximate location (city level). This helps us understand which tools are used and what needs improvement.',
            '3. Security: the Site is served through Cloudflare, which may set cookies such as __cf_bm to detect automated traffic.',
            'We do not collect the content you enter into tools, and we do not collect names, phone numbers, identity documents or any other personal identifiers. We do not build advertising profiles.',
          ],
        },
        {
          heading: '3. Cookies and similar technologies',
          body: [
            'The Site does not use cookies for its own functionality (the dismissed state of the language notice is stored in localStorage and never sent to a server). The following cookies come from third parties:',
            '· _ga, _ga_* — Google Analytics, distinguishes visitors and sessions, about 2 years.',
            '· _gid — Google Analytics, distinguishes visitors, 24 hours.',
            '· HMACCOUNT, HMVT — Baidu Analytics, measures unique visitors and behaviour, about 1 year.',
            '· __cf_bm — Cloudflare bot detection, 30 minutes.',
            'You can block or delete cookies in your browser settings. The tools do not depend on cookies and keep working with them disabled.',
          ],
        },
        {
          heading: '4. What we never do',
          body: [
            'We do not sell, rent or trade your data. We do not use your tool inputs to train models. We do not share personally identifiable information with third parties without your consent. We never require a phone number or real-name verification.',
          ],
        },
        {
          heading: '5. Advertising (may be enabled in the future)',
          body: [
            'The Site currently displays no ads. If Google AdSense is enabled in the future, the following applies:',
            'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google uses advertising cookies to enable it and its partners to serve ads based on your visits to this Site and/or other sites on the Internet.',
            `You may visit Google Ads Settings (https://adssettings.google.com) to opt out of personalized advertising, or https://www.aboutads.info to opt out of some third-party vendors' use of cookies for personalized advertising.`,
            'This policy will be updated, and a consent mechanism provided, before any ads are enabled.',
          ],
        },
        {
          heading: '6. Data retention',
          body: [
            'Server access logs are kept for 30 days. Google Analytics data is retained for 14 months (account default); Baidu Analytics follows its platform defaults. Aggregated statistics may be retained indefinitely, but can no longer be linked to any individual.',
          ],
        },
        {
          heading: '7. Your rights',
          body: [
            'Under applicable laws such as the GDPR and CCPA you have the right to access, correct or delete your data, to object to or restrict processing, to withdraw consent, and to lodge a complaint with your local data protection authority.',
            `To exercise these rights, email ${CONTACT_EMAIL}. We respond within 30 days.`,
          ],
        },
        {
          heading: '8. Children',
          body: [
            'The Site is not directed at children under 13 and does not knowingly collect their personal information. If you believe a child has provided information to us, contact us and we will delete it.',
          ],
        },
        {
          heading: '9. Changes to this policy',
          body: [
            'When this policy changes, the "Last updated" date at the top of the page is revised. For material changes (for example, adding ads or new third-party analytics) we will post a notice on the Site.',
          ],
        },
        {
          heading: '10. Contact',
          body: [`Questions about this policy: ${CONTACT_EMAIL}`],
        },
      ],
    },
  },

  terms: {
    zh: {
      title: '服务条款',
      description: '秋云工具服务条款：免费使用许可、知识产权、免责声明与责任限制。',
      updated: UPDATED,
      sections: [
        {
          heading: '一、条款的接受',
          body: [
            '访问或使用秋云工具（tools.qiuyun.dev）即表示你同意本条款。如果你不同意，请停止使用本站。',
          ],
        },
        {
          heading: '二、服务内容',
          body: [
            '本站提供免费的在线开发与办公辅助工具，全部功能在浏览器本地运行。服务按"现状"和"可用"状态提供，我们可能随时新增、修改或下线任一功能，恕不另行通知。',
            '本站不承诺服务永不中断。因维护、升级、网络故障、不可抗力或第三方服务（如 CDN）异常导致的中断，我们不承担责任。',
          ],
        },
        {
          heading: '三、使用许可与限制',
          body: [
            '我们授予你个人的、非独占的、不可转让的许可，用于个人或商业目的使用本站工具。你可以将工具输出结果用于你的项目、作品或商业交付。',
            '你不得：① 使用自动化程序大规模抓取本站页面或接口，影响正常服务；② 对本站实施攻击、扫描或逆向破解；③ 将本站整体或主要功能原样转售、包装成付费服务；④ 利用本站从事违法违规活动。',
          ],
        },
        {
          heading: '四、知识产权',
          body: [
            '本站源代码以 MIT 许可开源，你可以在遵守该许可的前提下使用、修改与分发。站点名称、Logo 与品牌标识归本站所有。',
            '第三方库（如 Lucide 图标、Nuxt、Vue）遵循各自的开源许可。你在工具中处理的文件与内容，其权利完全归你所有。',
          ],
        },
        {
          heading: '五、免责声明',
          body: [
            '本站工具的结果仅供参考。对于涉及财务、健康、法律、安全等专业领域的工具（如 BMI 计算、贷款计算、加密与哈希），结果不构成专业建议，请咨询具备资质的专业人士。',
            '我们尽合理努力保证工具行为正确，但不保证结果绝对准确、完整或适用于你的特定场景。详见"免责声明"页面。',
          ],
        },
        {
          heading: '六、责任限制',
          body: [
            '在适用法律允许的最大范围内，对于因使用或无法使用本站而产生的任何间接、偶然、特殊或后果性损失（包括但不限于数据丢失、业务中断、利润损失），我们不承担责任。',
          ],
        },
        {
          heading: '七、第三方链接',
          body: [
            '本站可能包含指向第三方网站的链接。这些网站的内容与隐私实践由其自行负责，我们不作任何担保。',
          ],
        },
        {
          heading: '八、条款变更',
          body: [
            '我们可能不定期更新本条款，更新后的版本自发布时生效。继续使用本站即视为接受变更后的条款。',
          ],
        },
        {
          heading: '九、联系方式',
          body: [`如对本条款有疑问，请联系：${CONTACT_EMAIL}`],
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      description: 'Terms of service for Qiuyun Tools: free usage license, intellectual property, disclaimers and limitation of liability.',
      updated: UPDATED,
      sections: [
        {
          heading: '1. Acceptance',
          body: [
            'By accessing or using Qiuyun Tools (tools.qiuyun.dev) you agree to these terms. If you do not agree, please stop using the Site.',
          ],
        },
        {
          heading: '2. The service',
          body: [
            'The Site provides free online developer and office utilities that run entirely in your browser. The service is provided "as is" and "as available". We may add, change or remove any feature at any time without notice.',
            'We do not guarantee uninterrupted availability. We are not liable for outages caused by maintenance, upgrades, network failures, force majeure or third-party services such as CDNs.',
          ],
        },
        {
          heading: '3. License and restrictions',
          body: [
            'We grant you a personal, non-exclusive, non-transferable license to use the tools for personal or commercial purposes. You may use the output in your own projects, creative work or commercial deliverables.',
            'You may not: (a) scrape the Site at scale with automated tools in a way that degrades service; (b) attack, scan or reverse engineer the Site; (c) resell the Site or its core functionality as-is, or repackage it as a paid service; (d) use the Site for unlawful activity.',
          ],
        },
        {
          heading: '4. Intellectual property',
          body: [
            'The source code is open source under the MIT license; you may use, modify and distribute it in accordance with that license. The site name, logo and brand marks remain ours.',
            'Third-party libraries (such as Lucide icons, Nuxt and Vue) are governed by their own open-source licenses. You retain all rights to the files and content you process with the tools.',
          ],
        },
        {
          heading: '5. Disclaimers',
          body: [
            'Tool results are provided for reference only. For tools touching finance, health, legal or security matters (for example BMI, loan or encryption/hash tools), results are not professional advice; consult a qualified professional.',
            'We make reasonable efforts to keep the tools correct, but do not warrant that results are accurate, complete or suitable for your particular use case. See the Disclaimer page for details.',
          ],
        },
        {
          heading: '6. Limitation of liability',
          body: [
            'To the maximum extent permitted by law, we are not liable for any indirect, incidental, special or consequential damages (including loss of data, business interruption or lost profits) arising from the use of, or inability to use, the Site.',
          ],
        },
        {
          heading: '7. Third-party links',
          body: [
            'The Site may link to third-party websites. Their content and privacy practices are their own responsibility and we make no warranty about them.',
          ],
        },
        {
          heading: '8. Changes',
          body: [
            'We may update these terms from time to time; the updated version takes effect when published. Continued use of the Site constitutes acceptance of the changes.',
          ],
        },
        {
          heading: '9. Contact',
          body: [`Questions about these terms: ${CONTACT_EMAIL}`],
        },
      ],
    },
  },

  about: {
    zh: {
      title: '关于我们',
      description: '秋云工具是一个独立开发者维护的免费在线工具箱，所有工具纯前端运行，数据不上传。',
      updated: UPDATED,
      sections: [
        {
          heading: '这是什么',
          body: [
            '秋云工具是一个免费的在线工具箱，收录 JSON 格式化、正则测试、加密哈希、图片处理、PDF 合并、代码格式化等 50 多个常用工具，支持 14 种语言界面。',
            '目标很简单：打开网页就能用，不用注册、不用安装、不用担心数据被别人看到。',
          ],
        },
        {
          heading: '为什么做这个站',
          body: [
            '日常开发中经常需要临时格式化一段 JSON、算个哈希、转个时间戳。现存工具站大多有几个共同问题：广告弹窗干扰操作、要求登录、把用户粘贴的内容上传到服务器、页面加载缓慢。',
            '所以这里做了一个取舍：所有计算都放在浏览器本地完成，不上传任何输入内容；界面保持干净，专注工具本身。',
          ],
        },
        {
          heading: '技术实现',
          body: [
            '站点基于 Nuxt 4、Vue 3 与 Tailwind CSS 构建，采用静态站点生成（SSG）部署，页面以纯静态文件分发给全球用户，通过 Cloudflare 提供加速与防护。',
            '多语言通过 @nuxtjs/i18n 实现，中文为默认语言，其余 13 种语言使用独立路径（如 /en/、/ja/），并为每种语言输出正确的 hreflang 标注。',
          ],
        },
        {
          heading: '开源',
          body: [
            '项目源代码以 MIT 许可开源，托管在 GitHub：https://github.com/qiuqyCN/qiuyun-tools 。欢迎提交 Issue 反馈问题，或 Fork 后自建部署。',
          ],
        },
        {
          heading: '联系方式',
          body: [
            `问题反馈、功能建议或商务合作：${CONTACT_EMAIL}`,
            '也可以直接在 GitHub 仓库提交 Issue。',
          ],
        },
      ],
    },
    en: {
      title: 'About',
      description: 'Qiuyun Tools is a free online toolbox maintained by an independent developer. Every tool runs client-side; nothing is uploaded.',
      updated: UPDATED,
      sections: [
        {
          heading: 'What this is',
          body: [
            'Qiuyun Tools is a free online toolbox with more than 50 everyday utilities: JSON formatting, regex testing, hashing and encryption, image processing, PDF merging, code formatting and more, with a UI available in 14 languages.',
            'The goal is simple: open the page and use it. No sign-up, no installation, no worrying about who can see your data.',
          ],
        },
        {
          heading: 'Why it exists',
          body: [
            'Developers constantly need to format a snippet of JSON, compute a hash or convert a timestamp. Most existing tool sites share the same problems: intrusive ads, forced logins, uploading whatever you paste to a server, and slow page loads.',
            'This site makes a different trade-off: all computation happens locally in your browser, nothing you enter is uploaded, and the interface stays out of the way.',
          ],
        },
        {
          heading: 'How it is built',
          body: [
            'The site is built with Nuxt 4, Vue 3 and Tailwind CSS, deployed as a statically generated site (SSG) so every page is served as a plain static file, fronted by Cloudflare for speed and protection.',
            'Translations are handled by @nuxtjs/i18n. Chinese is the default locale; the other 13 languages live under their own paths (such as /en/ and /ja/) with correct hreflang annotations.',
          ],
        },
        {
          heading: 'Open source',
          body: [
            'The source code is released under the MIT license at https://github.com/qiuqyCN/qiuyun-tools . Issues and forks are welcome.',
          ],
        },
        {
          heading: 'Contact',
          body: [
            `Bug reports, feature requests or partnerships: ${CONTACT_EMAIL}`,
            'You can also open an issue on the GitHub repository.',
          ],
        },
      ],
    },
  },

  contact: {
    zh: {
      title: '联系我们',
      description: '通过邮件反馈问题、提出功能建议或联系商务合作，通常 3 个工作日内回复。',
      updated: UPDATED,
      sections: [
        {
          heading: '邮件联系',
          body: [
            `通用联系邮箱：${CONTACT_EMAIL}`,
            '我们通常在 3 个工作日内回复。请尽量在邮件中说明清楚，以便我们快速定位问题。',
          ],
        },
        {
          heading: '反馈 Bug',
          body: [
            '请尽量附上：① 出问题的工具名称与页面链接；② 浏览器名称与版本；③ 你的操作步骤与预期结果；④ 如涉及文件，请说明文件类型与大致大小（无需发送原始文件）。',
            '也可以在 GitHub 仓库提交 Issue：https://github.com/qiuqyCN/qiuyun-tools/issues',
          ],
        },
        {
          heading: '功能建议',
          body: [
            '欢迎告诉我们你希望增加的工具或改进点。如果该功能涉及数据处理，请说明数据是否必须留在本地，我们会优先考虑纯前端实现。',
          ],
        },
        {
          heading: '商务合作',
          body: [
            `如需广告、赞助或其他合作，请发送邮件至 ${CONTACT_EMAIL}，邮件标题请注明"合作"。`,
          ],
        },
        {
          heading: '安全问题',
          body: [
            `如发现安全漏洞，请直接邮件联系 ${CONTACT_EMAIL}，并在邮件标题标注"Security"。请在修复发布前避免公开披露细节。`,
          ],
        },
      ],
    },
    en: {
      title: 'Contact',
      description: 'Reach out by email for bug reports, feature requests or partnership enquiries. We usually reply within 3 business days.',
      updated: UPDATED,
      sections: [
        {
          heading: 'Email',
          body: [
            `General enquiries: ${CONTACT_EMAIL}`,
            'We usually reply within 3 business days. The more detail you include, the faster we can help.',
          ],
        },
        {
          heading: 'Reporting a bug',
          body: [
            'Please include: (a) the tool name and page URL; (b) browser name and version; (c) the steps you took and the expected result; (d) if a file is involved, its type and approximate size (no need to send the file itself).',
            'You can also open an issue at https://github.com/qiuqyCN/qiuyun-tools/issues',
          ],
        },
        {
          heading: 'Feature requests',
          body: [
            'Tell us which tool or improvement you would like. If the feature involves data processing, mention whether the data must stay on your device; we prioritise client-side implementations.',
          ],
        },
        {
          heading: 'Partnerships',
          body: [
            `For advertising, sponsorship or other partnerships, email ${CONTACT_EMAIL} with "Partnership" in the subject line.`,
          ],
        },
        {
          heading: 'Security',
          body: [
            `If you find a security vulnerability, email ${CONTACT_EMAIL} with "Security" in the subject. Please avoid public disclosure until a fix is released.`,
          ],
        },
      ],
    },
  },

  disclaimer: {
    zh: {
      title: '免责声明',
      description: '秋云工具免责声明：工具结果仅供参考，不构成专业建议，请对重要数据保留备份。',
      updated: UPDATED,
      sections: [
        {
          heading: '一、通用说明',
          body: [
            '本站提供的所有工具均"按现状"提供，用于辅助日常开发与办公。我们尽力保证结果正确，但不对任何具体用途下的准确性、完整性或适用性作出保证。',
          ],
        },
        {
          heading: '二、计算类工具',
          body: [
            'BMI、贷款/利息、单位换算、日期计算等工具的结果仅供参考，不构成医疗、财务、税务或法律建议。涉及健康、合同与资金的决定，请咨询具备资质的专业人士。',
          ],
        },
        {
          heading: '三、加密、哈希与安全类工具',
          body: [
            'MD5、SHA、Base64、JWT、RSA 等工具用于调试与学习目的。请勿将本站在线生成的结果直接用作生产环境的密钥管理方案；生产密钥应通过受控的离线流程生成与保管。',
            '请注意：Base64 是编码而非加密，MD5/SHA-1 已不适合用于密码存储，相关结果不能等同于安全保证。',
          ],
        },
        {
          heading: '四、文件处理类工具',
          body: [
            '图片压缩、格式转换、PDF 合并拆分等操作在你的浏览器内完成，不会上传文件。但任何文件处理都有出错的可能，请在操作前保留原始文件备份，不要对唯一副本直接处理。',
          ],
        },
        {
          heading: '五、外部链接',
          body: [
            '本站可能包含指向第三方网站的链接。我们无法控制其内容与服务，对其准确性、可用性或安全性不承担责任。',
          ],
        },
        {
          heading: '六、责任限制',
          body: [
            '对于因使用或无法使用本站工具而导致的任何直接或间接损失（包括数据丢失、业务中断、利润损失），在法律允许的范围内，我们不承担责任。',
            `如对本声明有疑问，请联系：${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
    en: {
      title: 'Disclaimer',
      description: 'Disclaimer for Qiuyun Tools: results are for reference only, not professional advice. Always keep a backup of important files.',
      updated: UPDATED,
      sections: [
        {
          heading: '1. General',
          body: [
            'All tools on this Site are provided "as is" to assist with everyday development and office work. We make reasonable efforts to keep results correct, but do not warrant accuracy, completeness or fitness for any particular purpose.',
          ],
        },
        {
          heading: '2. Calculation tools',
          body: [
            'Results from BMI, loan/interest, unit conversion and date calculators are for reference only and do not constitute medical, financial, tax or legal advice. Consult a qualified professional for decisions involving health, contracts or money.',
          ],
        },
        {
          heading: '3. Encryption, hashing and security tools',
          body: [
            'MD5, SHA, Base64, JWT and RSA tools are intended for debugging and learning. Do not use keys generated in this browser as a production key-management solution; production keys should be generated and stored through controlled offline processes.',
            'Note that Base64 is encoding, not encryption, and that MD5/SHA-1 are unsuitable for password storage. Results from these tools are not a security guarantee.',
          ],
        },
        {
          heading: '4. File processing tools',
          body: [
            'Image compression, format conversion, and PDF merge/split operations run in your browser and never upload your files. Any file operation can still fail: keep a backup of the original and never process your only copy.',
          ],
        },
        {
          heading: '5. External links',
          body: [
            'The Site may link to third-party websites. We do not control their content or services and accept no responsibility for their accuracy, availability or security.',
          ],
        },
        {
          heading: '6. Limitation of liability',
          body: [
            'To the extent permitted by law, we are not liable for any direct or indirect loss (including data loss, business interruption or lost profits) resulting from the use of, or inability to use, the tools on this Site.',
            `Questions about this disclaimer: ${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
  },
}

/** 根据当前语言取正文：中文系语言用中文，其余回退英文 */
export function getLegalDoc(key: LegalKey, locale: string): LegalDoc {
  return legalDocs[key][locale.startsWith('zh') ? 'zh' : 'en']
}

/** 页脚与页面标题用的简短标签 */
export const legalLabels: Record<LegalKey, Record<LegalLang, string>> = {
  privacy: { zh: '隐私政策', en: 'Privacy' },
  terms: { zh: '服务条款', en: 'Terms' },
  about: { zh: '关于我们', en: 'About' },
  contact: { zh: '联系我们', en: 'Contact' },
  disclaimer: { zh: '免责声明', en: 'Disclaimer' },
}

export function getLegalLabel(key: LegalKey, locale: string): string {
  return legalLabels[key][locale.startsWith('zh') ? 'zh' : 'en']
}
