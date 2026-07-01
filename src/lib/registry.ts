// src/lib/registry.ts

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'dev' | 'image' | 'seo' | 'business' | 'utility' | 'pdf' | 'video' | 'social' | 'file' | 'education' | 'startup' | 'misc';
  keywords: string[];
  icon: string;
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Format, inspect, parse, and generate text datasets.',
    icon: 'text'
  },
  {
    id: 'dev',
    name: 'Developer Tools',
    description: 'Format codes, decode payloads, generate mock values, and test regexes.',
    icon: 'code'
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, crop, resize, and convert images client-side.',
    icon: 'image'
  },
  {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Optimize metadata, verify density, and generate robots/sitemaps.',
    icon: 'search'
  },
  {
    id: 'business',
    name: 'Business Tools',
    description: 'Generate invoices, calculate loan EMIs, margins, percentages, and convert currencies.',
    icon: 'briefcase'
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    description: 'Generate strong passwords, inspect strength, convert units, and compute age.',
    icon: 'settings'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Merge, split, protect, unlock, and manage PDF documents client-side.',
    icon: 'file-text'
  },
  {
    id: 'video',
    name: 'Video & Audio Tools',
    description: 'Compress, convert, trim, merge, and edit video and audio files client-side.',
    icon: 'video'
  },
  {
    id: 'social',
    name: 'Social Media Tools',
    description: 'Generate post copy, format tweets, analyze hashtags, and search emojis.',
    icon: 'social'
  },
  {
    id: 'file',
    name: 'File Tools',
    description: 'Create ZIPs, extract archives, inspect metadata, strip EXIF data, and check hashes.',
    icon: 'folder'
  },
  {
    id: 'education',
    name: 'Education Tools',
    description: 'Generate citations, compute reading times, construct study plans, and build quiz flashcards.',
    icon: 'book'
  },
  {
    id: 'startup',
    name: 'Startup Tools',
    description: 'Calculate SaaS pricing tiers, runway cash horizons, cap tables, and investor pitches.',
    icon: 'rocket'
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description: 'Generate calendars, spin wheels, roll dice, track habits, plan days, and build mind maps.',
    icon: 'grid'
  }
];

export const TOOLS: Tool[] = [
  // TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, sentences, paragraphs, and estimated reading time.',
    category: 'text',
    keywords: ['word', 'count', 'text', 'length', 'paragraphs', 'statistics'],
    icon: 'count',
    isPopular: true
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Detailed character count, letter/digit density, and byte calculations.',
    category: 'text',
    keywords: ['character', 'count', 'text', 'letters', 'digits', 'bytes'],
    icon: 'abc'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    category: 'text',
    keywords: ['case', 'convert', 'uppercase', 'lowercase', 'titlecase', 'snakecase', 'camelcase'],
    icon: 'case',
    isTrending: true
  },
  {
    id: 'text-compare',
    name: 'Text Compare',
    description: 'Compare two text documents side-by-side to highlight differences.',
    category: 'text',
    keywords: ['compare', 'diff', 'text', 'difference', 'side-by-side', 'matching'],
    icon: 'diff',
    isPopular: true
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    description: 'Clean your lists by filtering out repeated rows instantly.',
    category: 'text',
    keywords: ['duplicate', 'lines', 'remove', 'dedupe', 'clean', 'list'],
    icon: 'dedupe'
  },
  {
    id: 'text-sorter',
    name: 'Text Sorter',
    description: 'Sort lines alphabetically, numerically, reversely, or by length.',
    category: 'text',
    keywords: ['sort', 'lines', 'alphabetical', 'reverse', 'length', 'text-sorter'],
    icon: 'sort'
  },
  {
    id: 'reverse-text',
    name: 'Reverse Text',
    description: 'Flip your text strings backwards or reverse individual word characters.',
    category: 'text',
    keywords: ['reverse', 'flip', 'mirror', 'backwards', 'text'],
    icon: 'reverse'
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate standard dummy placeholder text for website drafts.',
    category: 'text',
    keywords: ['lorem', 'ipsum', 'generator', 'placeholder', 'dummy', 'latin'],
    icon: 'placeholder'
  },
  {
    id: 'random-text-generator',
    name: 'Random Text Generator',
    description: 'Generate secure random string sequences, letters, or integers.',
    category: 'text',
    keywords: ['random', 'text', 'strings', 'alphanumeric', 'passphrase'],
    icon: 'hash'
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write Markdown code and preview it instantly in beautiful HTML format.',
    category: 'text',
    keywords: ['markdown', 'editor', 'preview', 'md', 'html', 'live-compiler'],
    icon: 'markdown'
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format or prettify nested HTML documents with clean spacing.',
    category: 'text',
    keywords: ['html', 'formatter', 'prettify', 'beautify', 'clean-code'],
    icon: 'html'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify, sort keys, or compact JSON data structures instantly.',
    category: 'text',
    keywords: ['json', 'formatter', 'pretty', 'minify', 'compact', 'beautify'],
    icon: 'json',
    isPopular: true
  },

  // DEVELOPER TOOLS
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Check for syntax errors, missing brackets, or bad formatting in your JSON data.',
    category: 'dev',
    keywords: ['json', 'validate', 'check', 'syntax', 'linter', 'parser'],
    icon: 'shield-check',
    isTrending: true
  },
  {
    id: 'json-viewer',
    name: 'JSON Viewer',
    description: 'Interactive tree-view representation to traverse massive JSON arrays/objects.',
    category: 'dev',
    keywords: ['json', 'viewer', 'tree', 'expand', 'object', 'inspector'],
    icon: 'eye'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Prettify and index raw XML files with indent structures.',
    category: 'dev',
    keywords: ['xml', 'formatter', 'beautify', 'clean-xml'],
    icon: 'file-code'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format SQL queries (SELECT, JOINs, WHEREs) for improved legibility.',
    category: 'dev',
    keywords: ['sql', 'formatter', 'query', 'mysql', 'postgres', 'beautify'],
    icon: 'database'
  },
  {
    id: 'base64-encode-decode',
    name: 'Base64 Encode Decode',
    description: 'Encode strings to Base64 values or decode them back to text representations.',
    category: 'dev',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text-conversion'],
    icon: 'refresh',
    isPopular: true
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode JSON Web Tokens instantly to inspect header, payload, and signatures.',
    category: 'dev',
    keywords: ['jwt', 'decoder', 'token', 'auth', 'inspect', 'claims'],
    icon: 'key',
    isTrending: true
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder Decoder',
    description: 'Process URL components, encoding query values or decoding escape characters.',
    category: 'dev',
    keywords: ['url', 'encode', 'decode', 'percent-encoding', 'uri'],
    icon: 'link'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Validate regular expressions dynamically against match text with capture group displays.',
    category: 'dev',
    keywords: ['regex', 'regexp', 'pattern', 'match', 'test', 'capture-groups'],
    icon: 'terminal'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from input strings.',
    category: 'dev',
    keywords: ['hash', 'md5', 'sha256', 'cryptography', 'checksum', 'sha512'],
    icon: 'lock'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate multiple version 4 UUID strings instantly.',
    category: 'dev',
    keywords: ['uuid', 'guid', 'generator', 'unique-id', 'random-uuid'],
    icon: 'binary-code',
    isPopular: true
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Client-side REST API requester (GET, POST, custom headers) for checking API nodes.',
    category: 'dev',
    keywords: ['api', 'tester', 'rest', 'request', 'postman', 'fetch', 'json'],
    icon: 'server',
    isTrending: true
  },
  {
    id: 'cron-generator',
    name: 'Cron Generator',
    description: 'Translate crontab schedules to English and generate expression setups.',
    category: 'dev',
    keywords: ['cron', 'crontab', 'schedule', 'cron-generator', 'expression'],
    icon: 'clock'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors, convert formats (HEX, RGB, HSL) and check contrast scores.',
    category: 'dev',
    keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'canvas-color'],
    icon: 'palette'
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Compress stylesheet documents by removing unnecessary whitespace and comments.',
    category: 'dev',
    keywords: ['css', 'minify', 'compress', 'shrink-code'],
    icon: 'css'
  },
  {
    id: 'js-minifier',
    name: 'JS Minifier',
    description: 'Minify Javascript files to minimize script sizes.',
    category: 'dev',
    keywords: ['js', 'javascript', 'minify', 'compress', 'optimize-code'],
    icon: 'javascript'
  },
  {
    id: 'html-minifier',
    name: 'HTML Minifier',
    description: 'Reduce HTML payload weight by scrubbing extra linebreaks and quotes.',
    category: 'dev',
    keywords: ['html', 'minify', 'compress', 'size-reduction'],
    icon: 'html-mini'
  },

  // IMAGE TOOLS
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP assets completely in the browser for small footprints.',
    category: 'image',
    keywords: ['image', 'compress', 'optimize', 'quality', 'file-size', 'png-compress'],
    icon: 'image-compress',
    isPopular: true
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize image dimensions by percentage, pixel boundary, or crop scale ratios.',
    category: 'image',
    keywords: ['resize', 'image', 'dimensions', 'width', 'height', 'scale'],
    icon: 'crop-free'
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Interactive canvas cropping interface to outline and extract image portions.',
    category: 'image',
    keywords: ['crop', 'image', 'aspect-ratio', 'extract', 'trim-image'],
    icon: 'crop'
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images between PNG, JPEG, WEBP, GIF, and PDF client-side.',
    category: 'image',
    keywords: ['convert', 'image-format', 'png-to-jpg', 'webp-converter', 'pdf'],
    icon: 'refresh-cw',
    isTrending: true
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 strings for CSS styles or HTML image inline tags.',
    category: 'image',
    keywords: ['image', 'base64', 'inline-img', 'dataurl', 'base64-string'],
    icon: 'image-link'
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create customized high-quality QR codes for URLs, text contents, or Wi-Fi logins.',
    category: 'image',
    keywords: ['qr', 'qrcode', 'generator', 'scan', 'matrix'],
    icon: 'qr-code',
    isPopular: true
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    description: 'Generate standard barcodes (Code 128, EAN) for labels and packages.',
    category: 'image',
    keywords: ['barcode', 'code128', 'ean', 'label', 'generator'],
    icon: 'barcode'
  },
  {
    id: 'screenshot-tool',
    name: 'Screenshot Tool',
    description: 'Take high-fidelity client screenshots using standard Web Media Capture API.',
    category: 'image',
    keywords: ['screenshot', 'capture', 'screen', 'media-api', 'record-canvas'],
    icon: 'camera'
  },
  {
    id: 'color-extractor',
    name: 'Color Extractor',
    description: 'Extract dominant color palettes and HEX structures from any uploaded image.',
    category: 'image',
    keywords: ['color', 'extractor', 'palette', 'image-palette', 'hex-codes'],
    icon: 'color-palette'
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Clean background boundaries using transparent canvas contrast overrides.',
    category: 'image',
    keywords: ['background', 'remover', 'bg', 'transparent', 'chromakey'],
    icon: 'eraser'
  },


  // SEO TOOLS
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Generate search engine tags, Open Graph meta fields, and Twitter cards easily.',
    category: 'seo',
    keywords: ['seo', 'meta-tag', 'og-tags', 'open-graph', 'meta-generator'],
    icon: 'meta',
    isPopular: true
  },
  {
    id: 'sitemap-generator',
    name: 'Sitemap Generator',
    description: 'Build custom visual mapping XML sitemaps for search engine directories.',
    category: 'seo',
    keywords: ['sitemap', 'xml', 'generator', 'indexing', 'pages'],
    icon: 'map'
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Scaffold structured Robots.txt directives to configure search crawlers.',
    category: 'seo',
    keywords: ['robots', 'crawler', 'allow', 'disallow', 'seo-robots'],
    icon: 'bot',
    isTrending: true
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density Checker',
    description: 'Analyze content bodies for term occurrences and optimize density keywords.',
    category: 'seo',
    keywords: ['keyword', 'density', 'frequency', 'seo-audit', 'term-count'],
    icon: 'trending-up'
  },
  {
    id: 'open-graph-generator',
    name: 'Open Graph Generator',
    description: 'Generate Facebook OG, Twitter preview metadata, and schema codes.',
    category: 'seo',
    keywords: ['og', 'open-graph', 'social-share', 'meta-generator', 'facebook'],
    icon: 'share-2'
  },
  {
    id: 'schema-generator',
    name: 'Schema Generator',
    description: 'Build JSON-LD structured schemas for LocalBusiness, FAQ, or Articles.',
    category: 'seo',
    keywords: ['schema', 'json-ld', 'structured-data', 'faq-schema', 'article-schema'],
    icon: 'brackets',
    isPopular: true
  },
  {
    id: 'seo-analyzer',
    name: 'SEO Analyzer',
    description: 'Paste text or inspect markup segments for titles, headings, and formatting errors.',
    category: 'seo',
    keywords: ['seo', 'analyzer', 'audit', 'check-markup', 'meta-checker'],
    icon: 'activity',
    isTrending: true
  },

  // BUSINESS TOOLS
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    description: 'Build professional PDF invoices with custom items, VAT/taxes, and payment methods.',
    category: 'business',
    keywords: ['invoice', 'pdf', 'billing', 'invoice-generator', 'tax', 'receipt'],
    icon: 'receipt',
    isPopular: true
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    description: 'Calculate inclusive or exclusive Goods and Services Taxes (GST) with rate values.',
    category: 'business',
    keywords: ['gst', 'calculator', 'cgst', 'sgst', 'igst', 'tax-calculator'],
    icon: 'calculator'
  },
  {
    id: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    description: 'Calculate net margins, cost prices, markups, and gross revenue streams.',
    category: 'business',
    keywords: ['profit', 'margin', 'markup', 'revenue', 'markup-calculator'],
    icon: 'percent'
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Determine Monthly Equated Installment plans based on loan figures and variables.',
    category: 'business',
    keywords: ['emi', 'calculator', 'installment', 'monthly-payment'],
    icon: 'credit-card',
    isTrending: true
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Calculate amortization schedules, accumulated interest, and final loan payoffs.',
    category: 'business',
    keywords: ['loan', 'interest', 'amortization', 'repayment'],
    icon: 'trending-down-business'
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert international currencies based on current reference rates.',
    category: 'business',
    keywords: ['currency', 'convert', 'forex', 'exchange', 'usd', 'eur'],
    icon: 'dollar-sign'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Quickly solve standard percentage shifts, fractions, increases, and ratios.',
    category: 'business',
    keywords: ['percentage', 'increase', 'decrease', 'fraction', 'ratio'],
    icon: 'percent-sign'
  },

  // UTILITY TOOLS
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Build complex cryptographic random strings utilizing symbols, digits, and cases.',
    category: 'utility',
    keywords: ['password', 'generator', 'security', 'random-string', 'secret'],
    icon: 'key-utility',
    isPopular: true
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    description: 'Analyze entropy, cracking times, complexity rules, and password flaws.',
    category: 'utility',
    keywords: ['password', 'strength', 'linter', 'entropy', 'check-security'],
    icon: 'shield',
    isTrending: true
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert dimensions (length, temperature, weight, bytes, velocity) instantly.',
    category: 'utility',
    keywords: ['unit', 'convert', 'metric', 'imperial', 'celsius-to-fahrenheit', 'bytes'],
    icon: 'scale-utility'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Determine actual years, months, weeks, days, and seconds between dates.',
    category: 'utility',
    keywords: ['age', 'birthday', 'days', 'time-diff', 'anniversary'],
    icon: 'calendar'
  },
  {
    id: 'time-zone-converter',
    name: 'Time Zone Converter',
    description: 'Compare local timestamps against UTC, EST, GMT, PST, and other target timezones.',
    category: 'utility',
    keywords: ['timezone', 'utc', 'gmt', 'compare-time', 'zone', 'clock'],
    icon: 'globe'
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    description: 'Generate high-entropy random numbers within your custom boundaries.',
    category: 'utility',
    keywords: ['random', 'number', 'integer', 'dice', 'entropy'],
    icon: 'refresh-cw-utility'
  },
  {
    id: 'utility-uuid-generator',
    name: 'UUID Generator',
    description: 'Create unique RFC-compliant UUID/GUID identifiers.',
    category: 'utility',
    keywords: ['uuid', 'guid', 'unique-id', 'utility'],
    icon: 'fingerprint'
  },
  {
    id: 'utm-builder',
    name: 'UTM Builder',
    description: 'Easily add UTM parameters to your tracking links to track campaigns in Analytics.',
    category: 'seo',
    keywords: ['utm', 'builder', 'campaign', 'url-builder', 'tracking', 'marketing'],
    icon: 'link'
  },
  {
    id: 'serp-preview',
    name: 'SERP Preview Tool',
    description: 'Visualize exactly how your page will look on Google search engine result pages (SERPs).',
    category: 'seo',
    keywords: ['serp', 'google', 'preview', 'seo-title', 'snippets', 'seo'],
    icon: 'eye',
    isPopular: true
  },
  {
    id: 'headline-analyzer',
    name: 'Headline Analyzer',
    description: 'Score your titles, headings, and email subject lines for clickability and SEO value.',
    category: 'seo',
    keywords: ['headline', 'title', 'analyzer', 'clickability', 'sentiment', 'power-words'],
    icon: 'trending-up'
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Calculate Return on Investment (ROI) and annualized yields for marketing campaigns.',
    category: 'business',
    keywords: ['roi', 'calculator', 'marketing-roi', 'profit', 'investment', 'yield'],
    icon: 'calculator',
    isTrending: true
  },
  {
    id: 'cpc-cpm-calculator',
    name: 'CPC & CPM Calculator',
    description: 'Convert between cost per click (CPC), cost per thousand (CPM), CTR, and budget limits.',
    category: 'business',
    keywords: ['cpc', 'cpm', 'ctr', 'advertising', 'calculator', 'ad-spend'],
    icon: 'percent'
  },
  {
    id: 'brand-name-generator',
    name: 'Brand Name Generator',
    description: 'Generate hundreds of memorable brand, startup, and business name suggestions.',
    category: 'business',
    keywords: ['brand-name', 'business-name', 'generator', 'startup', 'naming', 'ideas'],
    icon: 'briefcase'
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert structured JSON arrays into CSV spreadsheet datasets instantly.',
    category: 'text',
    keywords: ['json', 'csv', 'converter', 'export', 'spreadsheet'],
    icon: 'json'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Parse raw CSV text streams into organized JSON arrays client-side.',
    category: 'text',
    keywords: ['csv', 'json', 'converter', 'parse', 'tabular'],
    icon: 'brackets'
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image Decoder',
    description: 'Decode Base64 strings back into previewable and downloadable image files.',
    category: 'text',
    keywords: ['base64', 'image', 'decode', 'dataurl', 'base64-to-image'],
    icon: 'image'
  },
  {
    id: 'text-repeater',
    name: 'Text Repeater',
    description: 'Repeat a text string multiple times with custom line breaks or separators.',
    category: 'text',
    keywords: ['repeat', 'multiplier', 'text-repeater', 'duplicate', 'clone'],
    icon: 'dedupe'
  },
  {
    id: 'html-entities',
    name: 'HTML Entity Encoder/Decoder',
    description: 'Encode special characters to HTML entities or decode them back to plain text.',
    category: 'dev',
    keywords: ['html', 'entities', 'encode', 'decode', 'escape', 'unescape'],
    icon: 'html'
  },
  {
    id: 'string-hex',
    name: 'String to Hex Converter',
    description: 'Convert character strings into hex numbers or decode hex strings back into text.',
    category: 'dev',
    keywords: ['hex', 'string-to-hex', 'hex-to-string', 'encoder', 'binary'],
    icon: 'binary-code'
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Compress and minify JSON files into single-line formats by stripping whitespaces.',
    category: 'dev',
    keywords: ['json', 'minify', 'compress', 'compact', 'size-reduction'],
    icon: 'json'
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON Converter',
    description: 'Translate nested XML tree data structures into parsed JSON objects.',
    category: 'dev',
    keywords: ['xml', 'json', 'convert', 'xml-to-json', 'transform'],
    icon: 'file-code'
  },
  {
    id: 'base32-encode-decode',
    name: 'Base32 Encoder/Decoder',
    description: 'Encode text strings into Base32 format or decode Base32 back to readable text.',
    category: 'dev',
    keywords: ['base32', 'encode', 'decode', 'rfc4648', 'obfuscator'],
    icon: 'key'
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG Converter',
    description: 'Render scalable SVG vectors on canvas and download them as high-quality PNGs.',
    category: 'image',
    keywords: ['svg', 'png', 'convert', 'vector', 'rasterize'],
    icon: 'image-compress'
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    description: 'Verify WCAG compliance contrast ratios between foreground and background colors.',
    category: 'image',
    keywords: ['contrast', 'wcag', 'color', 'accessibility', 'ratio'],
    icon: 'color-palette'
  },
  {
    id: 'image-inverter',
    name: 'Image Color Inverter',
    description: 'Invert the RGB color values of uploaded image files instantly.',
    category: 'image',
    keywords: ['invert', 'color-inverter', 'negative', 'filters', 'canvas'],
    icon: 'eraser'
  },
  {
    id: 'canonical-url-generator',
    name: 'Canonical URL Generator',
    description: 'Generate correct canonical link elements to prevent duplicate content flags.',
    category: 'seo',
    keywords: ['canonical', 'url', 'seo-tag', 'duplicate-content', 'link'],
    icon: 'meta'
  },
  {
    id: 'long-tail-keyword-generator',
    name: 'Long-Tail Keyword Generator',
    description: 'Expand core search keywords into highly targeted long-tail search questions.',
    category: 'seo',
    keywords: ['long-tail', 'keyword', 'generator', 'phrases', 'seo-research'],
    icon: 'trending-up'
  },
  {
    id: 'robots-meta-generator',
    name: 'Robots Meta Tag Generator',
    description: 'Generate robots meta directives to instruct indexation policies to search bots.',
    category: 'seo',
    keywords: ['robots', 'meta-tag', 'noindex', 'nofollow', 'crawler'],
    icon: 'bot'
  },
  {
    id: 'cpm-calculator',
    name: 'CPM Calculator',
    description: 'Calculate Cost Per Mille, cost, or impressions target easily.',
    category: 'business',
    keywords: ['cpm', 'advertising', 'cost-per-thousand', 'calculator', 'impressions'],
    icon: 'percent'
  },
  {
    id: 'cpc-calculator',
    name: 'CPC Calculator',
    description: 'Calculate Cost Per Click, click metrics, and conversion stats.',
    category: 'business',
    keywords: ['cpc', 'advertising', 'cost-per-click', 'calculator', 'clicks'],
    icon: 'calculator'
  },
  {
    id: 'marketing-budget-calculator',
    name: 'Marketing Budget Calculator',
    description: 'Distribute ad spend budget projections across your advertising channels.',
    category: 'business',
    keywords: ['marketing', 'budget', 'ad-spend', 'roi', 'allocation'],
    icon: 'briefcase'
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate (BMR) using standard demographic metrics.',
    category: 'utility',
    keywords: ['bmr', 'metabolic', 'calories', 'calculator', 'fitness'],
    icon: 'activity'
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    description: 'Calculate body fat percentage estimations using US Navy tape measurements.',
    category: 'utility',
    keywords: ['body-fat', 'calculator', 'navy-method', 'fitness', 'waist'],
    icon: 'settings'
  },
  {
    id: 'number-to-words',
    name: 'Number to Words Converter',
    description: 'Translate decimal numeric values into their English word representations.',
    category: 'utility',
    keywords: ['number-to-words', 'words', 'currency-writing', 'converter'],
    icon: 'abc'
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech Converter',
    description: 'Use client-side speech synthesis to read aloud your entered text blocks.',
    category: 'text',
    keywords: ['speech', 'tts', 'audio', 'voice', 'read-aloud'],
    icon: 'count'
  },
  {
    id: 'list-randomizer',
    name: 'List Randomizer',
    description: 'Shuffle and randomize lists of items or lines instantly.',
    category: 'text',
    keywords: ['shuffle', 'randomize', 'list', 'sort', 'random'],
    icon: 'sort'
  },
  {
    id: 'leap-year-checker',
    name: 'Leap Year Checker',
    description: 'Check if a specific calendar year is a leap year.',
    category: 'utility',
    keywords: ['leap-year', 'calendar', 'year', 'date', 'checker'],
    icon: 'clock'
  },
  {
    id: 'roman-numerals',
    name: 'Roman Numerals Converter',
    description: 'Convert standard numbers into Roman numerals or vice-versa.',
    category: 'utility',
    keywords: ['roman', 'numerals', 'convert', 'arabic', 'math'],
    icon: 'abc'
  },
  {
    id: 'paraphrasing-tool',
    name: 'Paraphrasing Tool',
    description: 'Rewrite sentences, paragraphs, or articles using alternative phrasing and vocabulary.',
    category: 'text',
    keywords: ['paraphrase', 'rewrite', 'rewriter', 'synonyms', 'rephrase'],
    icon: 'abc',
    isPopular: true
  },
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    description: 'Check your writing for grammatical mistakes, spelling slips, and punctuation errors.',
    category: 'text',
    keywords: ['grammar', 'spelling', 'checker', 'linter', 'proofread', 'english'],
    icon: 'shield-check'
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create a professional resume by filling out a simple multi-step form and exporting a clean copy.',
    category: 'business',
    keywords: ['resume', 'cv', 'builder', 'job-application', 'cv-maker', 'career'],
    icon: 'briefcase',
    isTrending: true
  },
  {
    id: 'pdf-tools',
    name: 'PDF Word Converter',
    description: 'Perform conversion operations to turn Word files into PDF or decode PDFs back into docx files.',
    category: 'pdf',
    keywords: ['pdf', 'word', 'convert', 'pdf-to-word', 'word-to-pdf', 'document'],
    icon: 'file-text'
  },
  {
    id: 'ocr-tool',
    name: 'OCR Image Text Extractor',
    description: 'Extract editable text from images, screenshots, scans, and photos entirely client-side.',
    category: 'utility',
    keywords: ['ocr', 'text-extractor', 'image-to-text', 'scan', 'read-image'],
    icon: 'camera',
    isPopular: true
  },
  {
    id: 'business-name-generator',
    name: 'Business Name Generator',
    description: 'Generate creative, memorable, and industry-targeted business and brand name ideas.',
    category: 'business',
    keywords: ['business-name', 'brand', 'naming', 'startup-names', 'ideas'],
    icon: 'briefcase'
  },
  {
    id: 'domain-name-generator',
    name: 'Domain Name Generator',
    description: 'Generate available domain name recommendations and check basic suffix rules.',
    category: 'business',
    keywords: ['domain', 'website', 'domain-search', 'name-generator', 'com'],
    icon: 'link'
  },
  {
    id: 'keyword-clustering-tool',
    name: 'Keyword Clustering Tool',
    description: 'Group lists of keywords into semantic clusters based on text matching similarity.',
    category: 'seo',
    keywords: ['seo', 'keywords', 'clustering', 'semantic-groups', 'keyword-grouping'],
    icon: 'brackets'
  },
  {
    id: 'search-intent-analyzer',
    name: 'Search Intent Analyzer',
    description: 'Analyze keyword lists to determine search intent categories (Informational, Transactional, etc.).',
    category: 'seo',
    keywords: ['seo', 'intent', 'transactional', 'informational', 'search-intent', 'analysis'],
    icon: 'activity',
    isTrending: true
  },
  {
    id: 'marketing-funnel-calculator',
    name: 'Marketing Funnel Calculator',
    description: 'Calculate traffic, lead rates, conversions, and customer drop-offs across funnel stages.',
    category: 'business',
    keywords: ['marketing-funnel', 'funnel', 'conversion', 'leads', 'dropoff', 'calculator'],
    icon: 'percent',
    isPopular: true
  },
  {
    id: 'roas-calculator',
    name: 'ROAS Calculator',
    description: 'Compute Return on Ad Spend (ROAS) to evaluate the performance of your marketing campaigns.',
    category: 'business',
    keywords: ['roas', 'ad-spend', 'roi', 'campaign-performance', 'calculator'],
    icon: 'calculator'
  },
  {
    id: 'cac-calculator',
    name: 'CAC Calculator',
    description: 'Calculate Customer Acquisition Cost (CAC) to measure marketing spend efficiency.',
    category: 'business',
    keywords: ['cac', 'acquisition-cost', 'spend', 'efficiency', 'calculator'],
    icon: 'calculator'
  },
  {
    id: 'clv-calculator',
    name: 'CLV Calculator',
    description: 'Determine Customer Lifetime Value (CLV) based on repeat purchase rate and margins.',
    category: 'business',
    keywords: ['clv', 'lifetime-value', 'retention', 'revenue', 'calculator'],
    icon: 'calculator'
  },
  {
    id: 'startup-idea-generator',
    name: 'Startup Idea Generator',
    description: 'Brainstorm creative, high-potential startup business models and target value taglines.',
    category: 'business',
    keywords: ['startup', 'business-ideas', 'brainstorm', 'niche', 'taglines'],
    icon: 'briefcase'
  },
  {
    id: 'content-calendar-generator',
    name: 'Content Calendar Generator',
    description: 'Generate weekly social media or blog content editorial calendars with topics and posts.',
    category: 'seo',
    keywords: ['content-calendar', 'editorial', 'schedule', 'social-media', 'planner'],
    icon: 'calendar'
  },
  {
    id: 'svg-minifier',
    name: 'SVG Minifier',
    description: 'Compress and optimize SVG graphics by removing metadata, comments, and redundant namespaces.',
    category: 'dev',
    keywords: ['svg', 'minifier', 'compress', 'vector', 'graphics', 'optimize'],
    icon: 'server'
  },
  {
    id: 'sql-minifier',
    name: 'SQL Minifier',
    description: 'Compress and format raw SQL queries into a single line by stripping comments and spaces.',
    category: 'dev',
    keywords: ['sql', 'minifier', 'compress', 'minify-sql', 'query', 'database'],
    icon: 'server'
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown Converter',
    description: 'Convert raw HTML code blocks into clean Github-flavored Markdown syntax.',
    category: 'text',
    keywords: ['html', 'markdown', 'convert', 'parser', 'rich-text'],
    icon: 'abc'
  },
  {
    id: 'user-agent-parser',
    name: 'User Agent Parser',
    description: 'Parse browser user agent strings to extract OS, engine, browser details, and device category.',
    category: 'dev',
    keywords: ['user-agent', 'ua-parser', 'browser', 'os', 'detect-device'],
    icon: 'activity'
  },
  {
    id: 'json-schema-generator',
    name: 'JSON Schema Generator',
    description: 'Generate standard JSON Schema templates dynamically from input JSON payloads.',
    category: 'dev',
    keywords: ['json-schema', 'schema-generator', 'json', 'data-validation'],
    icon: 'brackets'
  },
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    description: 'Scan and decode QR code values from images uploaded client-side.',
    category: 'image',
    keywords: ['qr-scanner', 'scan-qr', 'decode', 'image-reader', 'qr-code'],
    icon: 'camera'
  },
  {
    id: 'xml-minifier',
    name: 'XML Minifier',
    description: 'Optimize XML documents by stripping empty indentation, comments, and spacing.',
    category: 'dev',
    keywords: ['xml', 'minifier', 'compress', 'minify-xml', 'soap'],
    icon: 'server'
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Increase focus and track productiveness using customizable work-break session timers.',
    category: 'utility',
    keywords: ['pomodoro', 'timer', 'focus', 'productivity', 'countdown', 'clock'],
    icon: 'clock',
    isTrending: true
  },
  {
    id: 'payroll-calculator',
    name: 'Payroll Salary Calculator',
    description: 'Convert annual gross salaries into monthly, weekly, and hourly post-tax take-home earnings.',
    category: 'business',
    keywords: ['salary', 'payroll', 'tax', 'hourly-rate', 'take-home', 'calculator'],
    icon: 'percent'
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Easily protect a PDF file with a password and set security permissions client-side.',
    category: 'pdf',
    keywords: ['pdf', 'protect', 'encrypt', 'password', 'secure', 'lock'],
    icon: 'lock',
    isTrending: true
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Easily unlock a password-protected PDF file client-side.',
    category: 'pdf',
    keywords: ['pdf', 'unlock', 'decrypt', 'password', 'remove-password', 'open'],
    icon: 'unlock',
    isPopular: true
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Easily merge multiple PDF files into a single PDF in the order you want.',
    category: 'pdf',
    keywords: ['pdf', 'merge', 'combine', 'join', 'concatenate'],
    icon: 'merge',
    isPopular: true
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split a PDF into separate files by page range or extract individual pages.',
    category: 'pdf',
    keywords: ['pdf', 'split', 'extract', 'range', 'cut'],
    icon: 'split'
  },
  {
    id: 'pdf-metadata',
    name: 'PDF Metadata Reader & Editor',
    description: 'Preview and edit a PDF\'s internal metadata (Title, Author, etc.) online.',
    category: 'pdf',
    keywords: ['pdf', 'metadata', 'properties', 'tags', 'edit-pdf', 'view-pdf'],
    icon: 'file-text'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG/PNG to PDF Converter',
    description: 'Convert JPG, JPEG, and PNG images into a PDF with layout settings.',
    category: 'pdf',
    keywords: ['pdf', 'jpg-to-pdf', 'png-to-pdf', 'image-to-pdf', 'converter'],
    icon: 'image',
    isTrending: true
  },
  {
    id: 'jwt-generator',
    name: 'JWT Generator',
    description: 'Generate custom signed JSON Web Tokens (JWT) client-side using Web Crypto API.',
    category: 'dev',
    keywords: ['jwt', 'token', 'generator', 'signer', 'security', 'auth'],
    icon: 'key',
    isTrending: true
  },
  {
    id: 'jwt-validator',
    name: 'JWT Validator',
    description: 'Validate and verify JWT token signatures and expiration claims client-side.',
    category: 'dev',
    keywords: ['jwt', 'validator', 'verify', 'signature', 'claims', 'auth'],
    icon: 'shield-check',
    isPopular: true
  },
  {
    id: 'yaml-formatter',
    name: 'YAML Formatter',
    description: 'Pretty-print, format, and validate YAML documents client-side.',
    category: 'dev',
    keywords: ['yaml', 'formatter', 'beautify', 'syntax', 'parse'],
    icon: 'file-code'
  },
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    description: 'Validate YAML syntax and identify structural issues and line-level parsing errors.',
    category: 'dev',
    keywords: ['yaml', 'validator', 'linter', 'syntax', 'errors'],
    icon: 'shield-check'
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    description: 'Compare two JSON objects side-by-side and highlight structural line-level differences.',
    category: 'dev',
    keywords: ['json', 'diff', 'compare', 'difference', 'match'],
    icon: 'diff',
    isPopular: true
  },
  {
    id: 'video-compressor',
    name: 'Video Compressor',
    description: 'Compress video size by adjusting bitrate and resolution client-side.',
    category: 'video',
    keywords: ['video', 'compress', 'shrink', 'resize', 'mp4', 'webm'],
    icon: 'video',
    isTrending: true
  },
  {
    id: 'video-converter',
    name: 'Video Converter',
    description: 'Convert videos to different formats client-side in the browser.',
    category: 'video',
    keywords: ['video', 'convert', 'transcode', 'webm', 'mp4'],
    icon: 'refresh'
  },
  {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    description: 'Trim, cut, or crop video segments by setting custom start and end timestamps.',
    category: 'video',
    keywords: ['video', 'trim', 'cut', 'clip', 'crop-time'],
    icon: 'scissors',
    isPopular: true
  },
  {
    id: 'video-merger',
    name: 'Video Merger',
    description: 'Combine and merge multiple video files sequentially into a single video file.',
    category: 'video',
    keywords: ['video', 'merge', 'join', 'combine', 'concatenate'],
    icon: 'plus'
  },
  {
    id: 'video-cropper',
    name: 'Video Cropper',
    description: 'Crop visual dimensions of a video using custom bounding boxes or predefined aspect ratios.',
    category: 'video',
    keywords: ['video', 'crop', 'visual-crop', 'aspect-ratio'],
    icon: 'crop'
  },
  {
    id: 'video-rotator',
    name: 'Video Rotator',
    description: 'Rotate videos 90, 180, or 270 degrees client-side.',
    category: 'video',
    keywords: ['video', 'rotate', 'flip', 'turn', 'orientation'],
    icon: 'refresh'
  },
  {
    id: 'video-speed-controller',
    name: 'Video Speed Controller',
    description: 'Speed up or slow down video playback and save the speed-adjusted output.',
    category: 'video',
    keywords: ['video', 'speed', 'fast-motion', 'slow-motion', 'playback-rate'],
    icon: 'activity'
  },
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    description: 'Convert multiple uploaded images into an animated GIF client-side.',
    category: 'video',
    keywords: ['gif', 'maker', 'animate', 'images-to-gif', 'create-gif'],
    icon: 'image',
    isPopular: true
  },
  {
    id: 'gif-compressor',
    name: 'GIF Compressor',
    description: 'Compress and optimize GIF files by resizing or reducing color frames.',
    category: 'video',
    keywords: ['gif', 'compress', 'optimize', 'shrink'],
    icon: 'file-text'
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF Converter',
    description: 'Convert short video segments or whole video files into high-quality animated GIFs.',
    category: 'video',
    keywords: ['video', 'gif', 'convert', 'video-to-gif', 'frame-extractor'],
    icon: 'image',
    isTrending: true
  },
  {
    id: 'gif-to-mp4',
    name: 'GIF to MP4 Converter',
    description: 'Decompile animated GIF frames and export them as a WebM/MP4 video file.',
    category: 'video',
    keywords: ['gif', 'mp4', 'webm', 'convert', 'gif-to-video'],
    icon: 'video'
  },
  {
    id: 'audio-extractor',
    name: 'Audio Extractor',
    description: 'Extract raw audio tracks from video files and download them as high-quality WAV files.',
    category: 'video',
    keywords: ['audio', 'extract', 'sound', 'mp3', 'wav', 'mp4-to-mp3', 'rip'],
    icon: 'volume-x',
    isTrending: true
  },
  {
    id: 'mp3-converter',
    name: 'MP3 Converter',
    description: 'Convert different audio file formats (WAV, M4A, OGG) to standard audio files client-side.',
    category: 'video',
    keywords: ['audio', 'convert', 'mp3', 'wav', 'm4a', 'transcode'],
    icon: 'refresh',
    isTrending: true
  },
  {
    id: 'audio-compressor',
    name: 'Audio Compressor',
    description: 'Compress audio dynamic range using threshold, knee, and ratio controls and export the output.',
    category: 'video',
    keywords: ['audio', 'compress', 'volume', 'dynamics', 'shrink'],
    icon: 'activity'
  },
  {
    id: 'audio-trimmer',
    name: 'Audio Trimmer',
    description: 'Trim or cut custom time ranges from any audio clip and download the trimmed segment.',
    category: 'video',
    keywords: ['audio', 'trim', 'cut', 'crop-audio', 'clip'],
    icon: 'scissors',
    isPopular: true
  },
  {
    id: 'audio-merger',
    name: 'Audio Merger',
    description: 'Merge and concatenate multiple audio files sequentially into a single unified audio track.',
    category: 'video',
    keywords: ['audio', 'merge', 'join', 'combine', 'concatenate'],
    icon: 'plus'
  },
  {
    id: 'voice-recorder',
    name: 'Voice Recorder',
    description: 'Record audio directly from your microphone with a live waveform visualizer.',
    category: 'video',
    keywords: ['audio', 'record', 'microphone', 'dictaphone', 'voice'],
    icon: 'volume-2',
    isTrending: true
  },
  {
    id: 'voice-changer',
    name: 'Voice Changer',
    description: 'Apply funny pitch-shifting and filter effects (Robot, Deep Voice, Echo) to your voice clips.',
    category: 'video',
    keywords: ['voice', 'effects', 'pitch-shift', 'robot-voice', 'echo'],
    icon: 'activity'
  },
  {
    id: 'noise-remover',
    name: 'Noise Remover',
    description: 'Remove background rumble and low-end/high-end frequencies from your vocal tracks.',
    category: 'video',
    keywords: ['audio', 'noise', 'clean', 'gate', 'filter', 'hiss'],
    icon: 'shield-check'
  },
  {
    id: 'audio-speed-changer',
    name: 'Audio Speed Changer',
    description: 'Change the playback speed of audio files (0.5x to 2x) client-side.',
    category: 'video',
    keywords: ['audio', 'speed', 'tempo', 'slow-motion', 'fast-motion'],
    icon: 'activity'
  },
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Transcribe spoken words from your microphone into written text in real-time.',
    category: 'video',
    keywords: ['audio', 'speech', 'speech-to-text', 'transcribe', 'recognition'],
    icon: 'file-text',
    isPopular: true
  },
  {
    id: 'podcast-intro-generator',
    name: 'Podcast Intro Generator',
    description: 'Generate professional podcast intros by mixing vocal recordings with background music beats.',
    category: 'video',
    keywords: ['podcast', 'intro', 'mixer', 'voice-over', 'bg-music'],
    icon: 'volume-2',
    isTrending: true
  },
  {
    id: 'video-thumbnail-extractor',
    name: 'Video Thumbnail Extractor',
    description: 'Extract and download individual high-quality image frames from any video at custom timestamps.',
    category: 'video',
    keywords: ['video', 'thumbnail', 'frame', 'capture', 'extract-image', 'screenshot'],
    icon: 'camera',
    isPopular: true
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    description: 'Calculate the future wealth and returns of your Systematic Investment Plan (SIP) contributions.',
    category: 'business',
    keywords: ['sip', 'calculator', 'invest', 'mutual-funds', 'future-value', 'wealth'],
    icon: 'activity',
    isTrending: true
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Calculate future wealth projections with compounding interest intervals (monthly, quarterly, annually).',
    category: 'business',
    keywords: ['interest', 'compound-interest', 'calculator', 'savings', 'wealth'],
    icon: 'activity',
    isPopular: true
  },
  {
    id: 'inflation-calculator',
    name: 'Inflation Calculator',
    description: 'Calculate how price inflation impacts the purchasing power of your money over time.',
    category: 'business',
    keywords: ['inflation', 'purchasing-power', 'cpi', 'money', 'value-depreciation'],
    icon: 'trending-up'
  },
  {
    id: 'tax-calculator',
    name: 'Tax Calculator',
    description: 'Estimate your taxable income, progressive tax slabs, and net tax payable client-side.',
    category: 'business',
    keywords: ['tax', 'income-tax', 'calculator', 'deductions', 'slabs'],
    icon: 'briefcase',
    isTrending: true
  },
  {
    id: 'net-worth-calculator',
    name: 'Net Worth Calculator',
    description: 'Calculate your net worth by detailing your financial assets and liabilities.',
    category: 'business',
    keywords: ['net-worth', 'assets', 'liabilities', 'debt', 'wealth'],
    icon: 'briefcase'
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly home loan payments, down payments, and view a complete amortization schedule.',
    category: 'business',
    keywords: ['mortgage', 'loan', 'home-loan', 'emi', 'amortization'],
    icon: 'briefcase',
    isPopular: true
  },
  {
    id: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    description: 'Calculate the monthly contributions needed to reach your target savings goal.',
    category: 'business',
    keywords: ['savings', 'goal', 'invest', 'target', 'calculator'],
    icon: 'briefcase'
  },
  {
    id: 'retirement-calculator',
    name: 'Retirement Calculator',
    description: 'Plan your retirement by forecasting nest egg size and post-retirement monthly income.',
    category: 'business',
    keywords: ['retirement', 'pension', 'savings', 'nest-egg', 'age'],
    icon: 'briefcase',
    isTrending: true
  },
  {
    id: 'salary-hike-calculator',
    name: 'Salary Hike Calculator',
    description: 'Calculate annual or monthly salary increments, percentage hikes, and new take-home pay.',
    category: 'business',
    keywords: ['salary', 'hike', 'increment', 'paycheck', 'promotion'],
    icon: 'percent'
  },
  {
    id: 'freelance-rate-calculator',
    name: 'Freelance Rate Calculator',
    description: 'Determine your required billable hourly or daily rates based on target income and business expenses.',
    category: 'business',
    keywords: ['freelance', 'hourly-rate', 'contractor', 'income', 'billing'],
    icon: 'briefcase'
  },
  {
    id: 'youtube-tag-generator',
    name: 'YouTube Tag Generator',
    description: 'Generate high-ranking SEO tags and variations for your YouTube videos from your primary keywords.',
    category: 'social',
    keywords: ['youtube', 'tags', 'seo', 'keywords', 'tag-generator'],
    icon: 'social',
    isTrending: true
  },
  {
    id: 'youtube-title-generator',
    name: 'YouTube Title Generator',
    description: 'Generate catchy, high-CTR titles for your YouTube videos using proven SEO formats.',
    category: 'social',
    keywords: ['youtube', 'titles', 'seo', 'ctr', 'clickbait', 'generator'],
    icon: 'social',
    isPopular: true
  },
  {
    id: 'youtube-description-generator',
    name: 'YouTube Description Generator',
    description: 'Create professional structured video descriptions with social links, timelines, and call-to-actions.',
    category: 'social',
    keywords: ['youtube', 'description', 'metadata', 'template', 'timeline'],
    icon: 'social'
  },
  {
    id: 'instagram-bio-generator',
    name: 'Instagram Bio Generator',
    description: 'Generate unique, creative, and professional Instagram bios with custom formatting and emojis.',
    category: 'social',
    keywords: ['instagram', 'bio', 'profile', 'aesthetic', 'emoji', 'generator'],
    icon: 'social',
    isTrending: true
  },
  {
    id: 'tiktok-caption-generator',
    name: 'TikTok Caption Generator',
    description: 'Generate viral caption options, hook phrases, and matching hashtags for your TikTok videos.',
    category: 'social',
    keywords: ['tiktok', 'caption', 'hook', 'hashtags', 'viral'],
    icon: 'social'
  },
  {
    id: 'pinterest-description-generator',
    name: 'Pinterest Description Generator',
    description: 'Generate optimized pin descriptions with keywords and call-to-actions for higher visibility.',
    category: 'social',
    keywords: ['pinterest', 'pin', 'description', 'seo', 'keywords'],
    icon: 'social'
  },
  {
    id: 'linkedin-headline-generator',
    name: 'LinkedIn Headline Generator',
    description: 'Generate professional LinkedIn headlines highlighting your job, value proposition, and key skills.',
    category: 'social',
    keywords: ['linkedin', 'headline', 'profile', 'bio', 'resume', 'job-title'],
    icon: 'social',
    isPopular: true
  },
  {
    id: 'tweet-formatter',
    name: 'Tweet Formatter & Threader',
    description: 'Split long paragraphs into numbered, formatted Twitter/X threads within the 280-character limit.',
    category: 'social',
    keywords: ['twitter', 'tweet', 'thread', 'formatter', 'split-tweets', 'limit'],
    icon: 'social',
    isTrending: true
  },
  {
    id: 'hashtag-analytics',
    name: 'Hashtag Analytics',
    description: 'Inspect hashtag density, length, readability, and sort them into optimized categorization groups.',
    category: 'social',
    keywords: ['hashtag', 'analytics', 'instagram', 'twitter', 'tiktok', 'seo'],
    icon: 'social'
  },
  {
    id: 'emoji-picker',
    name: 'Emoji Picker & Copier',
    description: 'Browse, search, and instantly copy categorized emojis to the clipboard for social posts.',
    category: 'social',
    keywords: ['emoji', 'picker', 'copier', 'search-emojis', 'smileys'],
    icon: 'social',
    isPopular: true
  },
  {
    id: 'zip-creator',
    name: 'ZIP Creator',
    description: 'Archive and compress multiple files into a standard ZIP archive client-side.',
    category: 'file',
    keywords: ['zip', 'compress', 'archive', 'creator', 'uncompressed'],
    icon: 'folder',
    isTrending: true
  },
  {
    id: 'zip-extractor',
    name: 'ZIP Extractor',
    description: 'Unpack and extract files from ZIP archives directly in your browser.',
    category: 'file',
    keywords: ['zip', 'unzip', 'extractor', 'unpack', 'archive'],
    icon: 'folder',
    isPopular: true
  },
  {
    id: 'rar-extractor',
    name: 'RAR Extractor',
    description: 'Browse and inspect file lists inside RAR archives client-side.',
    category: 'file',
    keywords: ['rar', 'unrar', 'extractor', 'decompress', 'list-files'],
    icon: 'folder'
  },
  {
    id: '7z-extractor',
    name: '7z Extractor',
    description: 'Inspect and preview file list structures inside 7z compressed archives.',
    category: 'file',
    keywords: ['7z', '7zip', 'extractor', 'decompress', 'inspect'],
    icon: 'folder'
  },
  {
    id: 'file-metadata-viewer',
    name: 'File Metadata Viewer',
    description: 'Inspect size, timestamps, mime types, and detailed metadata of any local file.',
    category: 'file',
    keywords: ['file', 'metadata', 'inspector', 'stats', 'size', 'mime'],
    icon: 'folder',
    isTrending: true
  },
  {
    id: 'duplicate-file-finder',
    name: 'Duplicate File Finder',
    description: 'Identify and group duplicate files based on sizes and structural signatures.',
    category: 'file',
    keywords: ['duplicate', 'finder', 'cleaner', 'duplicates', 'signature'],
    icon: 'folder'
  },
  {
    id: 'file-hash-checker',
    name: 'File Hash Checker',
    description: 'Calculate SHA-256, SHA-1, and MD5 hashes of any local file client-side.',
    category: 'file',
    keywords: ['hash', 'sha256', 'sha1', 'md5', 'checksum', 'integrity'],
    icon: 'folder',
    isPopular: true
  },
  {
    id: 'file-splitter',
    name: 'File Splitter',
    description: 'Split large files into smaller sequential partition blocks for easier transfer.',
    category: 'file',
    keywords: ['split', 'file-splitter', 'parts', 'slice', 'chunk'],
    icon: 'folder'
  },
  {
    id: 'file-merger',
    name: 'File Merger',
    description: 'Merge split file partitions (part1, part2, etc.) back into a single output file.',
    category: 'file',
    keywords: ['merge', 'join', 'file-merger', 'combine', 'parts'],
    icon: 'folder'
  },
  {
    id: 'exif-viewer',
    name: 'EXIF Viewer',
    description: 'Read and display EXIF metadata tags (camera settings, capture dates) of JPEG images.',
    category: 'file',
    keywords: ['exif', 'metadata', 'viewer', 'jpeg', 'gps', 'camera'],
    icon: 'folder',
    isTrending: true
  },
  {
    id: 'exif-remover',
    name: 'EXIF Remover',
    description: 'Strip JPEG APP1 EXIF tags client-side to clean privacy metadata before sharing.',
    category: 'file',
    keywords: ['exif', 'remove', 'clean', 'privacy', 'strip-metadata', 'jpeg'],
    icon: 'folder'
  },
  {
    id: 'citation-generator',
    name: 'Citation Generator',
    description: 'Format academic references into APA, MLA, and Harvard citation templates client-side.',
    category: 'education',
    keywords: ['citation', 'apa', 'mla', 'harvard', 'bibliography', 'referencing'],
    icon: 'book',
    isTrending: true
  },
  {
    id: 'apa-generator',
    name: 'APA Citation Generator',
    description: 'Generate APA 7th edition referencing citations for books, journals, and websites.',
    category: 'education',
    keywords: ['citation', 'apa', 'apa-style', 'academic', 'referencing'],
    icon: 'book',
    isPopular: true
  },
  {
    id: 'mla-generator',
    name: 'MLA Citation Generator',
    description: 'Generate MLA 9th edition citations for academic research papers and bibliographies.',
    category: 'education',
    keywords: ['citation', 'mla', 'mla-style', 'referencing', 'academic'],
    icon: 'book'
  },
  {
    id: 'harvard-citation-generator',
    name: 'Harvard Citation Generator',
    description: 'Create Harvard style in-text and bibliography reference structures client-side.',
    category: 'education',
    keywords: ['citation', 'harvard', 'referencing', 'academic', 'bibliography'],
    icon: 'book'
  },
  {
    id: 'plagiarism-checker',
    name: 'Plagiarism Checker',
    description: 'Scan and analyze local texts for repetitive content, structures, and stylistic uniqueness.',
    category: 'education',
    keywords: ['plagiarism', 'scanner', 'duplicate-text', 'uniqueness', 'seo', 'write'],
    icon: 'book',
    isTrending: true
  },
  {
    id: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    description: 'Calculate average reading times, speaking speed rates, and length characteristics of any text.',
    category: 'education',
    keywords: ['reading-time', 'speaking-time', 'calculator', 'words-per-minute', 'tempo'],
    icon: 'book'
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    description: 'Structure custom schedules and study plans based on timelines and daily target hours.',
    category: 'education',
    keywords: ['study', 'planner', 'schedule', 'timetable', 'calendar', 'productivity'],
    icon: 'book',
    isPopular: true
  },
  {
    id: 'flashcard-generator',
    name: 'Flashcard Generator',
    description: 'Build interactive cards for self-study and test revision. Save/load deck profiles.',
    category: 'education',
    keywords: ['flashcard', 'revision', 'study', 'cards', 'test-prep', 'active-recall'],
    icon: 'book',
    isTrending: true
  },
  {
    id: 'quiz-generator',
    name: 'Quiz Generator',
    description: 'Construct multiple-choice test quizzes, track scores, and export quiz decks.',
    category: 'education',
    keywords: ['quiz', 'test', 'exam', 'multiple-choice', 'generator', 'revision'],
    icon: 'book',
    isPopular: true
  },
  {
    id: 'saas-pricing-calculator',
    name: 'SaaS Pricing Calculator',
    description: 'Model SaaS subscription tier options, ARPU goals, target margins, and CAC recoup horizons.',
    category: 'startup',
    keywords: ['saas', 'pricing', 'tiers', 'arpu', 'cac', 'ltv', 'startup', 'calculator'],
    icon: 'rocket',
    isTrending: true
  },
  {
    id: 'revenue-projection-calculator',
    name: 'Revenue Projection Calculator',
    description: 'Calculate MRR growth trajectories, user expansions, and annual cash run rates.',
    category: 'startup',
    keywords: ['revenue', 'projection', 'mrr', 'growth', 'arr', 'run-rate', 'calculator'],
    icon: 'rocket',
    isPopular: true
  },
  {
    id: 'burn-rate-calculator',
    name: 'Burn Rate Calculator',
    description: 'Calculate gross and net monthly cash expenses to identify burn characteristics.',
    category: 'startup',
    keywords: ['burn-rate', 'expenses', 'cashflow', 'net-burn', 'startup', 'calculator'],
    icon: 'rocket'
  },
  {
    id: 'runway-calculator',
    name: 'Runway Calculator',
    description: 'Determine the remaining monthly runway based on total cash reserves and net burn rates.',
    category: 'startup',
    keywords: ['runway', 'cash', 'survial', 'burn-rate', 'calculator', 'startup'],
    icon: 'rocket',
    isTrending: true
  },
  {
    id: 'startup-valuation-calculator',
    name: 'Startup Valuation Calculator',
    description: 'Estimate pre-money and post-money valuation metrics using scorecard or multiples.',
    category: 'startup',
    keywords: ['valuation', 'pre-money', 'post-money', 'multiples', 'scorecard', 'calculator'],
    icon: 'rocket',
    isPopular: true
  },
  {
    id: 'equity-split-calculator',
    name: 'Equity Split Calculator',
    description: 'Calculate co-founder equity divisions based on task contributions and commitments.',
    category: 'startup',
    keywords: ['equity', 'shares', 'split', 'cofounder', 'ownership', 'calculator'],
    icon: 'rocket'
  },
  {
    id: 'cap-table-generator',
    name: 'Cap Table Generator',
    description: 'Generate investor share capitalization grids, showing dilution shares and values.',
    category: 'startup',
    keywords: ['cap-table', 'equity', 'shareholder', 'shares', 'dilution', 'round'],
    icon: 'rocket',
    isTrending: true
  },
  {
    id: 'investor-pitch-outline-generator',
    name: 'Investor Pitch Outline Generator',
    description: 'Create slide layouts and content frameworks for high-converting pitch decks.',
    category: 'startup',
    keywords: ['pitch-deck', 'slides', 'investor', 'pitch', 'outline', 'funding'],
    icon: 'rocket',
    isPopular: true
  },

  // MISCELLANEOUS TOOLS
  {
    id: 'calendar-generator',
    name: 'Calendar Generator',
    description: 'Generate printable monthly and yearly calendars with custom first day of week.',
    category: 'misc',
    keywords: ['calendar', 'month', 'year', 'printable', 'date', 'schedule'],
    icon: 'calendar',
    isPopular: true
  },
  {
    id: 'holiday-calendar',
    name: 'Holiday Calendar',
    description: 'Browse public holidays by country and year, with date highlights.',
    category: 'misc',
    keywords: ['holiday', 'calendar', 'public holiday', 'country', 'dates', 'events'],
    icon: 'calendar'
  },
  {
    id: 'random-picker',
    name: 'Random Picker',
    description: 'Pick random items from a custom list — great for giveaways, teams, or decisions.',
    category: 'misc',
    keywords: ['random', 'picker', 'choose', 'giveaway', 'select', 'list', 'winner'],
    icon: 'sparkles',
    isTrending: true
  },
  {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll 1–10 dice of any standard type (d4, d6, d8, d10, d12, d20) with animation.',
    category: 'misc',
    keywords: ['dice', 'roll', 'd6', 'd20', 'random', 'game', 'tabletop'],
    icon: 'grid'
  },
  {
    id: 'coin-flip',
    name: 'Coin Flip',
    description: 'Flip a virtual coin with animated flip and track heads/tails history.',
    category: 'misc',
    keywords: ['coin', 'flip', 'heads', 'tails', 'random', 'decision'],
    icon: 'sparkles'
  },
  {
    id: 'wheel-spinner',
    name: 'Wheel Spinner',
    description: 'Spin a customizable prize wheel with your own items and animated results.',
    category: 'misc',
    keywords: ['wheel', 'spinner', 'spin', 'random', 'picker', 'prize', 'fortune'],
    icon: 'grid',
    isTrending: true
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Define and track daily habits with streak counts and completion heatmaps.',
    category: 'misc',
    keywords: ['habit', 'tracker', 'streak', 'daily', 'routine', 'goals', 'progress'],
    icon: 'count',
    isPopular: true
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Plan your day with timed task blocks, priorities, and completion tracking.',
    category: 'misc',
    keywords: ['planner', 'daily', 'schedule', 'task', 'time', 'organizer', 'productivity'],
    icon: 'calendar'
  },
  {
    id: 'checklist-generator',
    name: 'Checklist Generator',
    description: 'Build custom checklists with nested items, reordering, and PDF export.',
    category: 'misc',
    keywords: ['checklist', 'todo', 'list', 'tasks', 'export', 'pdf', 'items'],
    icon: 'text',
    isPopular: true
  },
  {
    id: 'mind-map-generator',
    name: 'Mind Map Generator',
    description: 'Create interactive mind maps with expandable branches and export as PNG.',
    category: 'misc',
    keywords: ['mind-map', 'brainstorm', 'diagram', 'nodes', 'ideas', 'visual', 'tree'],
    icon: 'diff',
    isTrending: true
  }
];

export function getToolById(id: string): Tool | undefined {
  // If the request points to utility-uuid-generator, return uuid-generator or resolve it directly
  if (id === 'uuid-generator') {
    return TOOLS.find(t => t.id === 'uuid-generator');
  }
  return TOOLS.find(t => t.id === id);
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return TOOLS.filter(t => t.id !== tool.id && (t.category === tool.category || t.keywords.some(k => tool.keywords.includes(k))))
    .slice(0, limit);
}
