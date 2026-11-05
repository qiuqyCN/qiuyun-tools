// English language pack
export default {
  // ============ Site Info ============
  site: {
    name: 'Qiuyun Tools',
    fullName: 'Qiuyun Tools - All-in-One Developer Toolbox',
    tagline: 'All-in-One Developer Toolbox',
    description:
      'Free online developer toolbox with 60+ utilities: JSON formatter, encryption tools, image processing, code formatting, frontend tools, document conversion. All tools run purely in your browser, no data upload, fully secure.',
  },

  // ============ Common UI ============
  common: {
    loading: 'Loading...',
    back: 'Back',
    backHome: 'Back to Home',
    toolNotFound: 'Tool not found',
    category: 'Category',
    totalTools: 'tools',
  },

  // ============ Categories ============
  categories: {
    dev: { name: 'Dev Tools' },
    crypto: { name: 'Crypto Tools' },
    text: { name: 'Text Tools' },
    number: { name: 'Number Tools' },
    frontend: { name: 'Frontend Tools' },
    image: { name: 'Image Tools' },
    document: { name: 'Document Tools' },
    life: { name: 'Life Tools' },
  },

  // ============ Tool Names & Descriptions ============
  tools: {
    // Dev Tools
    'dev/json-formatter': { name: 'JSON Formatter', desc: 'JSON beautify, minify, validate' },
    'dev/yaml-json': { name: 'YAML / JSON Converter', desc: 'Bidirectional YAML & JSON conversion' },
    'dev/yaml-properties': { name: 'YAML / Properties Converter', desc: 'Java Properties & YAML conversion' },
    'dev/json-java': { name: 'JSON / Java Converter', desc: 'Generate Java POJO from JSON' },
    'dev/code-beautify': { name: 'Code Beautifier', desc: 'Multi-language code formatter' },
    'dev/regex-tester': { name: 'Regex Tester', desc: 'Real-time regex matching test' },
    'dev/timestamp': { name: 'Timestamp Converter', desc: 'Unix timestamp & date converter' },
    'dev/cron': { name: 'Cron Builder & Parser', desc: 'Visual cron expression editor & parser' },
    'dev/http-request': { name: 'HTTP Request Tester', desc: 'REST API debugging (limited by CORS)' },
    'dev/websocket': { name: 'WebSocket Tester', desc: 'WebSocket connection debugging' },
    'dev/ua-parser': { name: 'User-Agent Parser', desc: 'Parse UA for browser/device info' },
    'dev/device-info': { name: 'Device Info Detector', desc: 'Browser/Screen/WebGL information' },

    // Crypto Tools
    'crypto/base64': { name: 'Base64 Encoder/Decoder', desc: 'Text/file Base64 conversion' },
    'crypto/url-codec': { name: 'URL Encoder/Decoder', desc: 'URL encode / decode' },
    'crypto/md5': { name: 'MD5 Hash', desc: 'Text MD5 digest' },
    'crypto/hmac': { name: 'HMAC Generator', desc: 'WebCrypto HMAC signature' },
    'crypto/jwt': { name: 'JWT Parser', desc: 'JWT Token Payload parser' },
    'crypto/rsa': { name: 'RSA Key Generator', desc: 'WebCrypto RSA key pair generation' },

    // Text Tools
    'text/word-count': { name: 'Word Counter', desc: 'Character/word/line counter' },
    'text/dedup-lines': { name: 'Deduplicate Lines', desc: 'Remove duplicate lines from text' },
    'text/diff': { name: 'Text Diff', desc: 'Highlight differences between two texts' },
    'text/pinyin': { name: 'Chinese to Pinyin', desc: 'Convert Chinese characters to Pinyin' },

    // Number Tools
    'number/random': { name: 'Random Number Generator', desc: 'Custom range / integer / decimal' },
    'number/base-convert': { name: 'Base Converter', desc: 'Binary / Octal / Decimal / Hex' },
    'number/chinese-num': { name: 'Number to Chinese', desc: 'Convert numbers to Chinese uppercase' },
    'number/sci-calc': { name: 'Scientific Calculator', desc: 'Expression evaluator' },

    // Frontend Tools
    'frontend/flex-box': { name: 'Flexbox Generator', desc: 'Visual flexbox layout editor' },
    'frontend/css-formatter': { name: 'CSS Formatter', desc: 'CSS/SCSS/Less beautify & minify' },
    'frontend/color-picker': { name: 'Color Picker', desc: 'HEX/RGB/HSL color converter' },
    'frontend/box-shadow': { name: 'CSS Box-Shadow Generator', desc: 'Visual box-shadow editor' },
    'frontend/gradient': { name: 'Gradient Generator', desc: 'Linear/radial gradient editor' },
    'frontend/css-animation': { name: 'CSS Animation Generator', desc: 'Keyframes visual editor' },
    'frontend/favicon': { name: 'Favicon Generator', desc: 'Text/icon to Favicon' },
    'frontend/color-scheme': { name: 'Color Scheme Generator', desc: 'Complementary/Triadic/Tetradic schemes' },

    // Image Tools
    'image/image-compress': { name: 'Image Compressor', desc: 'Lossless/lossy image compression' },
    'image/image-watermark': { name: 'Image Watermark', desc: 'Text/image watermark overlay' },
    'image/image-convert': { name: 'Image Format Converter', desc: 'PNG/JPG/WebP/GIF converter' },
    'image/image-base64': { name: 'Image to Base64', desc: 'Image file & Base64 conversion' },
    'image/svg-editor': { name: 'SVG Editor', desc: 'Simple visual SVG editor' },
    'image/qrcode-generate': { name: 'QR Code Generator', desc: 'Text/URL to QR code' },
    'image/qrcode-parse': { name: 'QR Code Parser', desc: 'Recognize QR code from image' },

    // Document Tools
    'document/markdown-editor': { name: 'Markdown Editor', desc: 'Split-pane editor + live preview' },
    'document/markdown-convert': { name: 'Markdown Converter', desc: 'MD to HTML / plain text' },
    'document/pdf-merge': { name: 'PDF Merger', desc: 'Merge multiple PDF files (pure frontend)' },
    'document/pdf-split': { name: 'PDF Splitter', desc: 'Split by range / every N pages / extract pages' },

    // Life Tools
    'life/date-calc': { name: 'Date Calculator', desc: 'Date difference / date addition-subtraction' },
    'life/countdown': { name: 'Countdown Timer', desc: 'Custom target time countdown' },
    'life/bmi': { name: 'BMI Calculator', desc: 'Body Mass Index calculator' },
    'life/age': { name: 'Age Calculator', desc: 'Calculate age from birth date' },
    'life/unit-convert': { name: 'Unit Converter', desc: 'Length / Weight / Area / Volume' },
    'life/mortgage': { name: 'Mortgage Calculator', desc: 'Equal principal & interest / Equal principal' },
    'life/salary': { name: 'Salary Calculator', desc: 'Social insurance + Tax' },
  },

  // ============ SEO Keywords ============
  seoKeywords: {
    'dev/json-formatter': 'JSON formatter,JSON beautify,JSON minify,JSON validator,online JSON editor',
    'dev/yaml-json': 'YAML to JSON,JSON to YAML,YAML JSON converter,online format converter',
    'dev/yaml-properties': 'YAML to Properties,Properties to YAML,Java config converter',
    'dev/json-java': 'JSON to Java,JSON to POJO,JSON to entity,JavaBean generator',
    'dev/code-beautify': 'Code beautifier,code formatter,Javascript formatter,HTML formatter,CSS formatter',
    'dev/regex-tester': 'Regex tester,regex builder,regex matcher,online regex validator,RegEx Tester',
    'dev/timestamp': 'Timestamp converter,Unix timestamp,timestamp to date,date to timestamp',
    'dev/cron': 'Cron expression,cron generator,cron parser,scheduler expression,Cron Generator',
    'dev/http-request': 'HTTP request tester,API debug tool,POST tester,online API tester',
    'dev/websocket': 'WebSocket tester,WebSocket debugger,WS connection test,online WebSocket client',
    'dev/ua-parser': 'User-Agent parser,UA parser,browser detector,device detection',
    'dev/device-info': 'Device info,browser info,screen resolution checker,WebGL detection',
    'crypto/base64': 'Base64 encoder,Base64 decoder,text to Base64,image to Base64',
    'crypto/url-codec': 'URL encoder,URL decoder,URL encode,URL decode,online encode converter',
    'crypto/md5': 'MD5 hash,MD5 generator,online MD5,MD5 hash generator',
    'crypto/hmac': 'HMAC generator,HMAC signature,WebCrypto signature,online HMAC tool',
    'crypto/jwt': 'JWT parser,JWT token,JWT payload,online JWT decoder',
    'crypto/rsa': 'RSA key generator,RSA key pair,WebCrypto RSA,online RSA tool',
    'text/word-count': 'Word counter,character counter,line counter,online word count',
    'text/dedup-lines': 'Deduplicate,remove duplicates,text dedup,deduplicate lines',
    'text/diff': 'Text diff,text compare,diff tool,online file diff',
    'text/pinyin': 'Chinese to Pinyin,Pinyin converter,convert Chinese characters',
    'number/random': 'Random number generator,random integer,random decimal,online random',
    'number/base-convert': 'Base converter,binary to decimal,hex converter,online base calculator',
    'number/chinese-num': 'Number to Chinese,Chinese uppercase,RMB uppercase,amount converter',
    'number/sci-calc': 'Scientific calculator,expression calculator,online calculator,math evaluator',
    'frontend/flex-box': 'Flexbox generator,CSS flexbox,visual flexbox editor',
    'frontend/css-formatter': 'CSS formatter,CSS beautifier,SCSS formatter,Less formatter,CSS minifier',
    'frontend/color-picker': 'Color picker,color converter,HEX to RGB,RGB to HSL,online color',
    'frontend/box-shadow': 'CSS box-shadow generator,box-shadow,visual shadow editor',
    'frontend/gradient': 'Gradient generator,gradient background,linear-gradient,radial-gradient',
    'frontend/css-animation': 'CSS animation generator,keyframes editor,animation builder',
    'frontend/favicon': 'Favicon generator,icon generator,Favicon maker,website icon',
    'frontend/color-scheme': 'Color scheme generator,complementary,triadic,tetradic palette',
    'image/image-compress': 'Image compressor,image compression,JPG compressor,PNG compressor,lossless',
    'image/image-watermark': 'Image watermark,text watermark,online watermark tool',
    'image/image-convert': 'Image format converter,PNG to JPG,WebP converter,GIF converter',
    'image/image-base64': 'Image to Base64,Base64 to image,image encoder',
    'image/svg-editor': 'SVG editor,online SVG editor,visual SVG,vector editor',
    'image/qrcode-generate': 'QR code generator,online QR code,QR Code maker',
    'image/qrcode-parse': 'QR code parser,QR code reader,online QR scanner',
    'document/markdown-editor': 'Markdown editor,MD editor,online Markdown,Markdown preview',
    'document/markdown-convert': 'Markdown to HTML,MD to HTML,Markdown converter',
    'document/pdf-merge': 'PDF merger,online PDF merger,merge PDF files',
    'document/pdf-split': 'PDF splitter,split PDF,extract PDF pages,online PDF split',
    'life/date-calc': 'Date calculator,date difference,date arithmetic,online date calc',
    'life/countdown': 'Countdown,online countdown,event countdown timer',
    'life/bmi': 'BMI calculator,Body Mass Index,BMI checker,health calculator',
    'life/age': 'Age calculator,birthday calculator,date of birth to age',
    'life/unit-convert': 'Unit converter,length converter,weight converter,area converter',
    'life/mortgage': 'Mortgage calculator,home loan calc,loan EMI calculator',
    'life/salary': 'Salary calculator,take-home pay,income tax calculator',
  },
}
