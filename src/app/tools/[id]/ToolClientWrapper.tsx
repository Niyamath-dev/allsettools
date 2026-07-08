// src/app/tools/[id]/ToolClientWrapper.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tool, getRelatedTools, TOOLS, CATEGORIES } from '@/lib/registry';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icons';
import { toast } from '@/components/Toast';
import { SecurityBadge } from '@/components/SecurityBadge';

import {
  WordCounter, CharacterCounter, CaseConverter, TextCompare,
  RemoveDuplicateLines, TextSorter, ReverseText, LoremIpsumGenerator,
  RandomTextGenerator, MarkdownEditor, HTMLFormatter, JSONFormatter,
  JSONToCSV, CSVToJSON, Base64ToImage, TextRepeater,
  TextToSpeech, ListRandomizer, ParaphrasingTool, GrammarChecker,
  HTMLToMarkdown
} from '@/components/tools/text-tools';

import {
  JSONValidator, JSONViewer, XMLFormatter, SQLFormatter,
  Base64EncodeDecode, JWTDecoder, URLEncoderDecoder, RegexTester,
  HashGenerator, UUIDGenerator, APITester, CronGenerator,
  ColorPicker, CSSMinifier, JSMinifier, HTMLMinifier,
  HTMLEntities, StringHex, JSONMinifier, XMLToJSON, Base32EncodeDecode,
  SVGMinifier, SQLMinifier, UserAgentParser, JSONSchemaGenerator, XMLMinifier
} from '@/components/tools/dev-tools';

import {
  ImageCompressor, ImageResizer, ImageCropper, ImageConverter,
  ImageToBase64, QRCodeGenerator, BarcodeGenerator, ScreenshotTool,
  ColorExtractor, BackgroundRemover, SVGToPNG, ColorContrastChecker, ImageInverter,
  QRCodeScanner
} from '@/components/tools/image-tools';



import {
  MetaTagGenerator, SitemapGenerator, RobotsTxtGenerator,
  KeywordDensityChecker, OpenGraphGenerator, SchemaGenerator, SEOAnalyzer,
  UTMBuilder, SERPPreview, HeadlineAnalyzer,
  CanonicalURLGenerator, LongTailKeywordGenerator, RobotsMetaGenerator,
  KeywordClusteringTool, SearchIntentAnalyzer, ContentCalendarGenerator
} from '@/components/tools/seo-tools';

import {
  InvoiceGenerator, GSTCalculator, ProfitMarginCalculator,
  EMICalculator, LoanCalculator, CurrencyConverter, PercentageCalculator,
  ROICalculator, CPCCPMCalculator, BrandNameGenerator,
  CPMCalculator, CPCCalculator, MarketingBudgetCalculator,
  ResumeBuilder, BusinessNameGenerator, DomainNameGenerator,
  MarketingFunnelCalculator, ROASCalculator, CACCalculator,
  CLVCalculator, StartupIdeaGenerator, PayrollCalculator
} from '@/components/tools/business-tools';

import {
  PasswordGenerator, PasswordStrengthChecker, UnitConverter,
  AgeCalculator, TimeZoneConverter, RandomNumberGenerator, UtilityUUIDGenerator,
  BMRCalculator, BodyFatCalculator, NumberToWords,
  LeapYearChecker, RomanNumerals, PDFTools, OCRTool, PomodoroTimer
} from '@/components/tools/utility-tools';

import {
  ProtectPDF, UnlockPDF, MergePDF, SplitPDF, PDFMetadataViewer, ImageToPDF
} from '@/components/tools/pdf-tools';

import {
  JWTGenerator, JWTValidator, YAMLFormatterValidator, JSONDiff, CSVViewerEditor
} from '@/components/tools/more-dev-tools';

import {
  VideoCompressor, VideoConverter, VideoTrimmer, VideoMerger,
  VideoCropper, VideoRotator, VideoSpeedController, GIFMaker,
  GIFCompressor, VideoToGIF, GIFToMP4, AudioExtractor,
  VideoThumbnailExtractor
} from '@/components/tools/video-tools';

import {
  MP3Converter, AudioCompressor, AudioTrimmer, AudioMerger,
  VoiceRecorder, VoiceChanger, NoiseRemover, AudioSpeedChanger,
  SpeechToText, PodcastIntroGenerator
} from '@/components/tools/audio-tools';

import {
  SIPCalculator, CompoundInterestCalculator, InflationCalculator,
  TaxCalculator, NetWorthCalculator, MortgageCalculator,
  SavingsGoalCalculator, RetirementCalculator, SalaryHikeCalculator,
  FreelanceRateCalculator
} from '@/components/tools/finance-tools';

import {
  YouTubeTagGenerator, YouTubeTitleGenerator, YouTubeDescriptionGenerator,
  InstagramBioGenerator, TikTokCaptionGenerator, PinterestDescriptionGenerator,
  LinkedInHeadlineGenerator, TweetFormatter, HashtagAnalytics,
  EmojiPicker
} from '@/components/tools/social-tools';

import {
  ZIPCreator, ZIPExtractor, RARExtractor, SevenZipExtractor,
  FileMetadataViewer, DuplicateFileFinder, FileHashChecker,
  FileSplitter, FileMerger, EXIFViewer, EXIFRemover
} from '@/components/tools/file-tools';

import {
  CitationGenerator, APAGenerator, MLAGenerator, HarvardCitationGenerator,
  PlagiarismChecker, ReadingTimeCalculator, StudyPlanner,
  FlashcardGenerator, QuizGenerator
} from '@/components/tools/education-tools';

import {
  SaaSPricingCalculator, RevenueProjectionCalculator, BurnRateCalculator,
  RunwayCalculator, StartupValuationCalculator, EquitySplitCalculator,
  CapTableGenerator, InvestorPitchOutlineGenerator
} from '@/components/tools/startup-tools';

import {
  CalendarGenerator, HolidayCalendar, RandomPicker, DiceRoller,
  CoinFlip, WheelSpinner, HabitTracker, DailyPlanner,
  ChecklistGenerator, MindMapGenerator
} from '@/components/tools/misc-tools';

const generateToolSEOContent = (tool: Tool) => {
  const name = tool.name;
  const category = tool.category;
  
  let steps = [
    `Enter or upload your raw inputs into the designated workspace field above.`,
    `Adjust the tool configuration options and control switches to customize the formatting, conversion, or generation logic to your liking.`,
    `Click the action button to process your data instantly.`,
    `Copy the processed outputs to your clipboard or download them directly to your device.`
  ];
  
  let faqs = [
    {
      q: `Is the ${name} secure to use?`,
      a: `Yes, completely. The ${name} runs entirely in your local web browser using client-side JavaScript. None of your data, files, or entries are uploaded or stored on our servers, ensuring absolute privacy.`
    },
    {
      q: `Do I need to sign up to use this tool?`,
      a: `No. All utilities on AllSetTools are 100% free, require no signup, and have no daily usage caps or feature limitations.`
    },
    {
      q: `Does this utility support offline access?`,
      a: `Yes, because the operations are compiled locally as static web assets, you can run this tool offline once the page has loaded.`
    },
    {
      q: `Do you log or compile my calculations?`,
      a: `No. We track only basic, anonymous page view counts. The values, texts, keys, and file contents you process are entirely restricted to your local browser execution context.`
    }
  ];

  let examples = [
    {
      title: `Standard Processing Example`,
      input: `Typical input payload or text raw content.`,
      output: `Formatted, optimized, or converted results based on default parameters.`
    }
  ];

  if (category === 'text') {
    steps = [
      `Paste your raw text dataset or string values into the main input textarea.`,
      `Configure formatting rules such as case sensitivity, separators, or cleaning criteria using the control widgets.`,
      `Review real-time character or line counts in the live analytics indicator.`,
      `Click "Copy" to retrieve your modified text data instantly.`
    ];
    faqs.push({
      q: `Does this counter/editor support non-English scripts?`,
      a: `Yes. Our text processors natively handle Unicode characters, supporting multi-byte international alphabets, emojis, and special symbols.`
    });
    examples = [
      {
        title: `Text Formatting Example`,
        input: `Hello World! Processing client-side utilities.`,
        output: `Cleaned, formatted, or counted metrics according to chosen options.`
      }
    ];
  } else if (category === 'dev') {
    steps = [
      `Paste your raw code, JSON payload, base64 block, or format keys into the editor field.`,
      `Use the formatting preferences (like tab space width, minification flags, or hashing algorithms) to set up processing rules.`,
      `Click the main button to format, validate, or convert the structure.`,
      `Click "Copy Result" or download the output payload file directly.`
    ];
    faqs.push({
      q: `Can this validate large datasets offline?`,
      a: `Yes, since it operates local Javascript compilation on the page, it processes even large payloads instantly without network lag or transmission risk.`
    });
    examples = [
      {
        title: `Developer Payload Example`,
        input: `{"status": "success", "data": {"items": [1, 2, 3]}}`,
        output: `Formatted / Validated payload results with clean line-indents.`
      }
    ];
  } else if (category === 'image') {
    steps = [
      `Upload your PNG, JPG, WebP, or SVG image file using the dropzone or file picker.`,
      `Select your preferences (compression quality percentages, scale dimensions, or target format conversions).`,
      `Use the canvas handles to crop, flip, or preview modifications in real-time.`,
      `Click "Download" to save the optimized image asset to your storage.`
    ];
    faqs.push({
      q: `Are my images uploaded to any server for compression?`,
      a: `Absolutely not. The compression, resizing, and rendering logic runs completely client-side in your browser via HTML5 Canvas. Your files never leave your computer.`
    });
    examples = [
      {
        title: `Image Optimization Example`,
        input: `Original size: 2.4 MB (Raw PNG image)`,
        output: `Optimized size: 480 KB (WebP image conversion at 80% quality)`
      }
    ];
  } else if (category === 'seo') {
    steps = [
      `Enter your website target URL, target keywords, or meta values in the inputs.`,
      `Adjust parameters such as search engine crawlers, sitemap priority frequencies, or schema attributes.`,
      `Click the button to compile correct indexing tags or sitemap XML maps.`,
      `Copy the compiled snippet and paste it directly into your HTML document header or upload it to your server root.`
    ];
    faqs.push({
      q: `How does this help my search ranking?`,
      a: `By outputting search-compliant metadata (JSON-LD schemas, Robots configurations, Sitemap structures), it helps search bots index your pages accurately, boosting organic visibility.`
    });
    examples = [
      {
        title: `SEO Metadata Example`,
        input: `Title: AllSetTools | Description: Free Client-side Web Utilities`,
        output: `<meta name="title" content="AllSetTools"><meta name="description" content="Free Client-side Web Utilities">`
      }
    ];
  } else if (category === 'business') {
    steps = [
      `Enter your cost price, tax percentage rate, loan principal value, or currency numbers.`,
      `Adjust percentages, amortization terms, or conversion units.`,
      `Review real-time dynamic totals and amortization schedules shown in tables or charts below.`,
      `Export calculated sheets or save billing statements as clean PDF invoices.`
    ];
    faqs.push({
      q: `Are these calculations accurate for tax filings?`,
      a: `These calculators use standardized mathematical models. While highly precise, they should be used as reference sheets. We recommend double-checking critical filings with a certified accountant.`
    });
    examples = [
      {
        title: `Business Calculation Example`,
        input: `Principal: $10,000 | Interest: 5.5% | Amortization: 12 months`,
        output: `Monthly payment (EMI): $858.42 | Total interest payable: $301.04`
      }
    ];
  } else if (category === 'utility') {
    steps = [
      `Select your utility conversion factors or configure length thresholds.`,
      `Input your numbers, dates, times, or age values.`,
      `Select target parameters such as uppercase letters, special character bounds, or target zones.`,
      `Review generated outputs shown on the workspace panel.`
    ];
    faqs.push({
      q: `How secure are the generated passwords?`,
      a: `Our password generator uses the browser's native window.crypto.getRandomValues() API, which provides cryptographically strong pseudo-random numbers ideal for security.`
    });
    examples = [
      {
        title: `Utility Computation Example`,
        input: `Input: 128-bit security flags or standard metric values`,
        output: `Result: Strong secure password or metric value conversions.`
      }
    ];
  }

  return { steps, faqs, examples };
};

interface WrapperProps {
  tool: Tool;
}

export default function ToolClientWrapper({ tool }: WrapperProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  // Update Recently Used and Analytics on Mount
  useEffect(() => {
    try {
      // 1. Favorites toggle initial load
      const favs = JSON.parse(localStorage.getItem('allsettools_favorites') || '[]');
      setIsFavorite(favs.includes(tool.id));

      // 2. Track usage counts
      const count = parseInt(localStorage.getItem('allsettools_usage_count') || '0') + 1;
      localStorage.setItem('allsettools_usage_count', String(count));
      setUsageCount(count);

      // 3. Update recently used list
      let recents: string[] = JSON.parse(localStorage.getItem('allsettools_recently_used') || '[]');
      // Filter out current tool, insert at start, and limit to 6 entries
      recents = [tool.id, ...recents.filter(id => id !== tool.id)].slice(0, 6);
      localStorage.setItem('allsettools_recently_used', JSON.stringify(recents));
      setRecentlyUsed(recents);

    } catch (e) {
      console.error(e);
    }
  }, [tool.id]);

  const toggleFavorite = () => {
    try {
      let favs: string[] = JSON.parse(localStorage.getItem('allsettools_favorites') || '[]');
      if (isFavorite) {
        favs = favs.filter(id => id !== tool.id);
        toast.show('Removed from favorites', 'info');
      } else {
        favs.push(tool.id);
        toast.success('Added to favorites!');
      }
      localStorage.setItem('allsettools_favorites', JSON.stringify(favs));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard!');
  };

  // Mapper to render correct tool
  const renderTool = () => {
    switch (tool.id) {
      // Text Tools
      case 'word-counter': return <WordCounter />;
      case 'character-counter': return <CharacterCounter />;
      case 'case-converter': return <CaseConverter />;
      case 'text-compare': return <TextCompare />;
      case 'remove-duplicate-lines': return <RemoveDuplicateLines />;
      case 'text-sorter': return <TextSorter />;
      case 'reverse-text': return <ReverseText />;
      case 'lorem-ipsum-generator': return <LoremIpsumGenerator />;
      case 'random-text-generator': return <RandomTextGenerator />;
      case 'markdown-editor': return <MarkdownEditor />;
      case 'html-formatter': return <HTMLFormatter />;
      case 'json-formatter': return <JSONFormatter />;
      case 'json-to-csv': return <JSONToCSV />;
      case 'csv-to-json': return <CSVToJSON />;
      case 'base64-to-image': return <Base64ToImage />;
      case 'text-repeater': return <TextRepeater />;
      case 'text-to-speech': return <TextToSpeech />;
      case 'list-randomizer': return <ListRandomizer />;
      case 'paraphrasing-tool': return <ParaphrasingTool />;
      case 'grammar-checker': return <GrammarChecker />;
      case 'html-to-markdown': return <HTMLToMarkdown />;

      // Developer Tools
      case 'json-validator': return <JSONValidator />;
      case 'json-viewer': return <JSONViewer />;
      case 'xml-formatter': return <XMLFormatter />;
      case 'sql-formatter': return <SQLFormatter />;
      case 'base64-encode-decode': return <Base64EncodeDecode />;
      case 'jwt-decoder': return <JWTDecoder />;
      case 'url-encoder-decoder': return <URLEncoderDecoder />;
      case 'regex-tester': return <RegexTester />;
      case 'hash-generator': return <HashGenerator />;
      case 'uuid-generator': return <UUIDGenerator />;
      case 'api-tester': return <APITester />;
      case 'cron-generator': return <CronGenerator />;
      case 'color-picker': return <ColorPicker />;
      case 'css-minifier': return <CSSMinifier />;
      case 'js-minifier': return <JSMinifier />;
      case 'html-minifier': return <HTMLMinifier />;
      case 'html-entities': return <HTMLEntities />;
      case 'string-hex': return <StringHex />;
      case 'json-minifier': return <JSONMinifier />;
      case 'xml-to-json': return <XMLToJSON />;
      case 'base32-encode-decode': return <Base32EncodeDecode />;
      case 'svg-minifier': return <SVGMinifier />;
      case 'sql-minifier': return <SQLMinifier />;
      case 'user-agent-parser': return <UserAgentParser />;
      case 'json-schema-generator': return <JSONSchemaGenerator />;
      case 'xml-minifier': return <XMLMinifier />;

      // New Developer Tools
      case 'jwt-generator': return <JWTGenerator />;
      case 'jwt-validator': return <JWTValidator />;
      case 'yaml-formatter':
      case 'yaml-validator': return <YAMLFormatterValidator />;
      case 'json-diff': return <JSONDiff />;
      case 'csv-viewer-editor': return <CSVViewerEditor />;

      // Image Tools
      case 'image-compressor': return <ImageCompressor />;
      case 'image-resizer': return <ImageResizer />;
      case 'image-cropper': return <ImageCropper />;
      case 'image-converter': return <ImageConverter />;
      case 'image-to-base64': return <ImageToBase64 />;
      case 'qr-code-generator': return <QRCodeGenerator />;
      case 'barcode-generator': return <BarcodeGenerator />;
      case 'screenshot-tool': return <ScreenshotTool />;
      case 'color-extractor': return <ColorExtractor />;
      case 'background-remover': return <BackgroundRemover />;
      case 'svg-to-png': return <SVGToPNG />;
      case 'color-contrast-checker': return <ColorContrastChecker />;
      case 'image-inverter': return <ImageInverter />;
      case 'qr-code-scanner': return <QRCodeScanner />;



      // SEO Tools
      case 'meta-tag-generator': return <MetaTagGenerator />;
      case 'sitemap-generator': return <SitemapGenerator />;
      case 'robots-txt-generator': return <RobotsTxtGenerator />;
      case 'keyword-density-checker': return <KeywordDensityChecker />;
      case 'open-graph-generator': return <OpenGraphGenerator />;
      case 'schema-generator': return <SchemaGenerator />;
      case 'seo-analyzer': return <SEOAnalyzer />;
      case 'utm-builder': return <UTMBuilder />;
      case 'serp-preview': return <SERPPreview />;
      case 'headline-analyzer': return <HeadlineAnalyzer />;
      case 'canonical-url-generator': return <CanonicalURLGenerator />;
      case 'long-tail-keyword-generator': return <LongTailKeywordGenerator />;
      case 'robots-meta-generator': return <RobotsMetaGenerator />;
      case 'keyword-clustering-tool': return <KeywordClusteringTool />;
      case 'search-intent-analyzer': return <SearchIntentAnalyzer />;
      case 'content-calendar-generator': return <ContentCalendarGenerator />;

      // Business Tools
      case 'invoice-generator': return <InvoiceGenerator />;
      case 'gst-calculator': return <GSTCalculator />;
      case 'profit-margin-calculator': return <ProfitMarginCalculator />;
      case 'emi-calculator': return <EMICalculator />;
      case 'loan-calculator': return <LoanCalculator />;
      case 'currency-converter': return <CurrencyConverter />;
      case 'percentage-calculator': return <PercentageCalculator />;
      case 'roi-calculator': return <ROICalculator />;
      case 'cpc-cpm-calculator': return <CPCCPMCalculator />;
      case 'brand-name-generator': return <BrandNameGenerator />;
      case 'cpm-calculator': return <CPMCalculator />;
      case 'cpc-calculator': return <CPCCalculator />;
      case 'marketing-budget-calculator': return <MarketingBudgetCalculator />;
      case 'resume-builder': return <ResumeBuilder />;
      case 'business-name-generator': return <BusinessNameGenerator />;
      case 'domain-name-generator': return <DomainNameGenerator />;
      case 'marketing-funnel-calculator': return <MarketingFunnelCalculator />;
      case 'roas-calculator': return <ROASCalculator />;
      case 'cac-calculator': return <CACCalculator />;
      case 'clv-calculator': return <CLVCalculator />;
      case 'startup-idea-generator': return <StartupIdeaGenerator />;
      case 'payroll-calculator': return <PayrollCalculator />;

      // Utility Tools
      case 'password-generator': return <PasswordGenerator />;
      case 'password-strength-checker': return <PasswordStrengthChecker />;
      case 'unit-converter': return <UnitConverter />;
      case 'age-calculator': return <AgeCalculator />;
      case 'time-zone-converter': return <TimeZoneConverter />;
      case 'random-number-generator': return <RandomNumberGenerator />;
      case 'utility-uuid-generator': return <UtilityUUIDGenerator />;
      case 'bmr-calculator': return <BMRCalculator />;
      case 'body-fat-calculator': return <BodyFatCalculator />;
      case 'number-to-words': return <NumberToWords />;
      case 'leap-year-checker': return <LeapYearChecker />;
      case 'roman-numerals': return <RomanNumerals />;
      case 'pdf-tools': return <PDFTools />;
      case 'ocr-tool': return <OCRTool />;
      case 'pomodoro-timer': return <PomodoroTimer />;

      // PDF Category Tools
      case 'protect-pdf': return <ProtectPDF />;
      case 'unlock-pdf': return <UnlockPDF />;
      case 'merge-pdf': return <MergePDF />;
      case 'split-pdf': return <SplitPDF />;
      case 'pdf-metadata': return <PDFMetadataViewer />;
      case 'jpg-to-pdf': return <ImageToPDF />;

      // Video & Audio Tools
      case 'video-compressor': return <VideoCompressor />;
      case 'video-converter': return <VideoConverter />;
      case 'video-trimmer': return <VideoTrimmer />;
      case 'video-merger': return <VideoMerger />;
      case 'video-cropper': return <VideoCropper />;
      case 'video-rotator': return <VideoRotator />;
      case 'video-speed-controller': return <VideoSpeedController />;
      case 'gif-maker': return <GIFMaker />;
      case 'gif-compressor': return <GIFCompressor />;
      case 'video-to-gif': return <VideoToGIF />;
      case 'gif-to-mp4': return <GIFToMP4 />;
      case 'audio-extractor': return <AudioExtractor />;
      case 'video-thumbnail-extractor': return <VideoThumbnailExtractor />;

      // Audio & Speech Tools
      case 'mp3-converter': return <MP3Converter />;
      case 'audio-compressor': return <AudioCompressor />;
      case 'audio-trimmer': return <AudioTrimmer />;
      case 'audio-merger': return <AudioMerger />;
      case 'voice-recorder': return <VoiceRecorder />;
      case 'voice-changer': return <VoiceChanger />;
      case 'noise-remover': return <NoiseRemover />;
      case 'audio-speed-changer': return <AudioSpeedChanger />;
      case 'speech-to-text': return <SpeechToText />;
      case 'podcast-intro-generator': return <PodcastIntroGenerator />;

      // Finance Tools
      case 'sip-calculator': return <SIPCalculator />;
      case 'compound-interest-calculator': return <CompoundInterestCalculator />;
      case 'inflation-calculator': return <InflationCalculator />;
      case 'tax-calculator': return <TaxCalculator />;
      case 'net-worth-calculator': return <NetWorthCalculator />;
      case 'mortgage-calculator': return <MortgageCalculator />;
      case 'savings-goal-calculator': return <SavingsGoalCalculator />;
      case 'retirement-calculator': return <RetirementCalculator />;
      case 'salary-hike-calculator': return <SalaryHikeCalculator />;
      case 'freelance-rate-calculator': return <FreelanceRateCalculator />;

      // Social Media Tools
      case 'youtube-tag-generator': return <YouTubeTagGenerator />;
      case 'youtube-title-generator': return <YouTubeTitleGenerator />;
      case 'youtube-description-generator': return <YouTubeDescriptionGenerator />;
      case 'instagram-bio-generator': return <InstagramBioGenerator />;
      case 'tiktok-caption-generator': return <TikTokCaptionGenerator />;
      case 'pinterest-description-generator': return <PinterestDescriptionGenerator />;
      case 'linkedin-headline-generator': return <LinkedInHeadlineGenerator />;
      case 'tweet-formatter': return <TweetFormatter />;
      case 'hashtag-analytics': return <HashtagAnalytics />;
      case 'emoji-picker': return <EmojiPicker />;

      // File Tools
      case 'zip-creator': return <ZIPCreator />;
      case 'zip-extractor': return <ZIPExtractor />;
      case 'rar-extractor': return <RARExtractor />;
      case '7z-extractor': return <SevenZipExtractor />;
      case 'file-metadata-viewer': return <FileMetadataViewer />;
      case 'duplicate-file-finder': return <DuplicateFileFinder />;
      case 'file-hash-checker': return <FileHashChecker />;
      case 'file-splitter': return <FileSplitter />;
      case 'file-merger': return <FileMerger />;
      case 'exif-viewer': return <EXIFViewer />;
      case 'exif-remover': return <EXIFRemover />;

      // Education Tools
      case 'citation-generator': return <CitationGenerator />;
      case 'apa-generator': return <APAGenerator />;
      case 'mla-generator': return <MLAGenerator />;
      case 'harvard-citation-generator': return <HarvardCitationGenerator />;
      case 'plagiarism-checker': return <PlagiarismChecker />;
      case 'reading-time-calculator': return <ReadingTimeCalculator />;
      case 'study-planner': return <StudyPlanner />;
      case 'flashcard-generator': return <FlashcardGenerator />;
      case 'quiz-generator': return <QuizGenerator />;

      // Startup Tools
      case 'saas-pricing-calculator': return <SaaSPricingCalculator />;
      case 'revenue-projection-calculator': return <RevenueProjectionCalculator />;
      case 'burn-rate-calculator': return <BurnRateCalculator />;
      case 'runway-calculator': return <RunwayCalculator />;
      case 'startup-valuation-calculator': return <StartupValuationCalculator />;
      case 'equity-split-calculator': return <EquitySplitCalculator />;
      case 'cap-table-generator': return <CapTableGenerator />;
      case 'investor-pitch-outline-generator': return <InvestorPitchOutlineGenerator />;

      // Miscellaneous Tools
      case 'calendar-generator': return <CalendarGenerator />;
      case 'holiday-calendar': return <HolidayCalendar />;
      case 'random-picker': return <RandomPicker />;
      case 'dice-roller': return <DiceRoller />;
      case 'coin-flip': return <CoinFlip />;
      case 'wheel-spinner': return <WheelSpinner />;
      case 'habit-tracker': return <HabitTracker />;
      case 'daily-planner': return <DailyPlanner />;
      case 'checklist-generator': return <ChecklistGenerator />;
      case 'mind-map-generator': return <MindMapGenerator />;

      default:
        return <div>Tool component not found.</div>;
    }
  };

  const relatedTools = getRelatedTools(tool);
  const recentTools = TOOLS.filter(t => recentlyUsed.includes(t.id) && t.id !== tool.id).slice(0, 4);

  // Generate SEO content (steps, faqs) for layout and JSON-LD schema
  const seoData = generateToolSEOContent(tool);

  // Resolve category friendly name
  const categoryObj = CATEGORIES.find(c => c.id === tool.category);
  const categoryName = categoryObj ? categoryObj.name : (tool.category.charAt(0).toUpperCase() + tool.category.slice(1) + ' Tools');

  // Map category to schema.org SoftwareApplication category
  const getApplicationCategory = (cat: string) => {
    switch (cat) {
      case 'text':
      case 'utility':
      case 'pdf':
      case 'file':
      case 'misc':
        return 'UtilitiesApplication';
      case 'dev':
        return 'DeveloperApplication';
      case 'image':
      case 'video':
        return 'MultimediaApplication';
      case 'seo':
      case 'business':
      case 'startup':
        return 'BusinessApplication';
      case 'social':
        return 'SocialNetworkingApplication';
      case 'education':
        return 'EducationalApplication';
      default:
        return 'UtilitiesApplication';
    }
  };

  const appCategory = getApplicationCategory(tool.category);

  // Construct comprehensive JSON-LD schemas
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://allsettools.com/#organization",
        "name": "AllSetTools",
        "url": "https://allsettools.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://allsettools.com/#logo",
          "url": "https://allsettools.com/ALL%20Set%20Tools%20logo.png",
          "caption": "AllSetTools Logo"
        },
        "image": {
          "@id": "https://allsettools.com/#logo"
        },
        "description": "Free 100% offline-ready web utilities and programmatic toolsets."
      },
      {
        "@type": "WebSite",
        "@id": "https://allsettools.com/#website",
        "url": "https://allsettools.com",
        "name": "AllSetTools",
        "description": "Free 100% offline-ready web utilities and programmatic toolsets.",
        "publisher": {
          "@id": "https://allsettools.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://allsettools.com/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `https://allsettools.com/tools/${tool.id}#webpage`,
        "url": `https://allsettools.com/tools/${tool.id}`,
        "name": tool.name,
        "description": tool.description,
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": `https://allsettools.com/tools/${tool.id}#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://allsettools.com/tools/${tool.id}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://allsettools.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryName,
            "item": `https://allsettools.com/tools/${tool.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": tool.name,
            "item": `https://allsettools.com/tools/${tool.id}`
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": `https://allsettools.com/tools/${tool.id}#software`,
        "name": tool.name,
        "description": tool.description,
        "applicationCategory": appCategory,
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5, Web Browser with JavaScript support.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@id": "https://allsettools.com/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://allsettools.com/tools/${tool.id}#faq`,
        "mainEntity": seoData.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      {/* JSON-LD Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Dynamic Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', url: '/' },
          { label: tool.category.charAt(0).toUpperCase() + tool.category.slice(1) + ' Tools', url: `/#category-${tool.category}` },
          { label: tool.name }
        ]}
      />

      <div className="tool-container">
        
        {/* LEFT COLUMN: MAIN WORKSPACE */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{tool.name}</h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-fg-muted)' }}>{tool.description}</p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            {renderTool()}
          </div>

          {/* Dynamic SEO Content: Guide, Examples, and FAQs */}
          <div style={{ marginTop: '3.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* How-to Guide */}
            <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', padding: 0 }}>
                <Icon name="book-open" style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
                How to Use {tool.name}
              </h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: 0, listStyle: 'none' }}>
                {seoData.steps.map((step, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-fg)'
                    }}>{idx + 1}</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)', margin: 0, paddingTop: '2px', lineHeight: '1.5' }}>{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQs */}
            <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', padding: 0 }}>
                <Icon name="help-circle" style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
                FAQs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {seoData.faqs.map((faq, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-fg)', border: 'none', padding: 0, margin: 0 }}>{faq.q}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <SecurityBadge />
          
          {/* Quick Actions Panel */}
          <div className="card" style={{ padding: '1.25rem', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Quick Actions</h4>
            <button onClick={toggleFavorite} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Icon name="tag" style={{ width: '15px', height: '15px', fill: isFavorite ? 'currentColor' : 'none' }} />
              {isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
            </button>
            <button onClick={copyShareLink} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Icon name="share-2" style={{ width: '15px', height: '15px' }} />
              Share Link
            </button>
          </div>

          {/* Usage Analytics */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Analytics Tracker</h4>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', lineHeight: '1.5' }}>
              You have completed <span style={{ fontWeight: 'bold', color: 'var(--color-fg)' }}>{usageCount}</span> local tool operations in this workspace. All tasks ran 100% secure in-browser.
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', paddingLeft: '4px' }}>Related Utilities</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedTools.map(t => (
                  <Link href={`/tools/${t.id}`} key={t.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-card)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    gap: '10px',
                    transition: 'all var(--transition-fast)'
                  }} className="card-hover">
                    <Icon name={t.icon} style={{ width: '16px', height: '16px', color: 'var(--color-fg-muted)' }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recently Used Sidebar */}
          {recentTools.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', paddingLeft: '4px' }}>Recently Visited</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentTools.map(t => (
                  <Link href={`/tools/${t.id}`} key={t.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-card)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    gap: '10px',
                    transition: 'all var(--transition-fast)'
                  }} className="card-hover">
                    <Icon name={t.icon} style={{ width: '16px', height: '16px', color: 'var(--color-fg-muted)' }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
        </aside>

      </div>
    </div>
  );
}
