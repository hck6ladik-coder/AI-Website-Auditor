export type ScoreCategory = 'overall' | 'performance' | 'seo' | 'accessibility' | 'security' | 'bestPractices';

export type StatusType = 'good' | 'needs-improvement' | 'poor' | 'pass' | 'warn' | 'fail';

export interface MetricItem {
  name: string;
  label: string;
  value: number;
  displayValue: string;
  score: number; // 0 - 100
  status: 'good' | 'needs-improvement' | 'poor';
  unit: string;
  description: string;
}

export interface CoreWebVitals {
  fcp: MetricItem;
  lcp: MetricItem;
  cls: MetricItem;
  tbt: MetricItem;
  ttfb: MetricItem;
  speedIndex: MetricItem;
}

export interface SeoAuditResult {
  title: {
    text: string;
    length: number;
    status: 'pass' | 'warn' | 'fail';
    recommendation: string;
  };
  description: {
    text: string;
    length: number;
    status: 'pass' | 'warn' | 'fail';
    recommendation: string;
  };
  headings: {
    h1: string[];
    h2Count: number;
    h3Count: number;
    hasH1: boolean;
    multipleH1: boolean;
    status: 'pass' | 'warn' | 'fail';
    recommendation: string;
    isH1Hidden?: boolean;
    isH1Logo?: boolean;
  };
  openGraph: {
    hasBasicOg: boolean;
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
  twitterCard: {
    hasCard: boolean;
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  canonical: {
    url?: string;
    matchesTarget: boolean;
    status: 'pass' | 'warn' | 'fail';
    recommendation: string;
  };
  schemaOrg: {
    hasSchema: boolean;
    types: string[];
    rawCount: number;
  };
  robots: {
    hasRobotsMeta: boolean;
    isNoindex: boolean;
    isNofollow: boolean;
    robotsTxtFound?: boolean;
    sitemapFound?: boolean;
  };
  contentStats: {
    wordCount: number;
    readingTimeMinutes: number;
    internalLinksCount: number;
    externalLinksCount: number;
    faviconFound: boolean;
    hreflangs: string[];
  };
}

export interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element?: string;
  wcagRule?: string;
}

export interface AccessibilityAuditResult {
  score: number;
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
    sampleMissingAlt: string[];
  };
  hasLangAttribute: boolean;
  htmlLang?: string;
  hasMainLandmark: boolean;
  hasNavLandmark: boolean;
  emptyLinksCount: number;
  formLabels: {
    total: number;
    withLabel: number;
    missingLabel: number;
  };
  issues: AccessibilityIssue[];
}

export interface SecurityHeaderCheck {
  name: string;
  value: string | null;
  status: 'pass' | 'fail' | 'warn';
  description: string;
  recommendation: string;
}

export interface SecurityAuditResult {
  score: number;
  isHttps: boolean;
  headers: SecurityHeaderCheck[];
}

export interface AssetsBreakdown {
  htmlSizeBytes: number;
  htmlSizeFormatted: string;
  scriptsCount: {
    total: number;
    external: number;
    inline: number;
  };
  stylesCount: {
    total: number;
    external: number;
    inline: number;
  };
  imagesCount: number;
  iframesCount: number;
  fontsDetected: string[];
  thirdPartyDomains: string[];
  renderBlockingScripts: number;
  lazyImagesCount: number;
}

export interface AgencyPitch {
  headline: string;
  problemSummary: string;
  recommendedPackages: Array<{
    name: string;
    description: string;
    estimatedTime: string;
    roi: string;
  }>;
}

export interface AiRecommendation {
  id: string;
  title: string;
  category: 'Performance' | 'SEO' | 'Accessibility' | 'Best Practices' | 'Security';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: 'low' | 'medium' | 'high';
  description: string;
  solution: string;
  codeSnippet?: string;
}

export interface AuditScores {
  overall: number;
  performance: number;
  seo: number;
  accessibility: number;
  security: number;
  bestPractices: number;
}

export interface AuditReport {
  id: string;
  url: string;
  normalizedUrl: string;
  timestamp: string;
  executionTimeMs: number;
  status: 'success' | 'partial' | 'error';
  errorMessage?: string;
  scores: AuditScores;
  coreWebVitals: CoreWebVitals;
  seo: SeoAuditResult;
  accessibility: AccessibilityAuditResult;
  security: SecurityAuditResult;
  assets: AssetsBreakdown;
  agencyPitch: AgencyPitch;
  aiRecommendations: AiRecommendation[];
  summary: string;
  techStack: string[];
}

export interface CompetitorComparison {
  target: AuditReport;
  competitor: AuditReport;
  deltas: {
    overall: number;
    performance: number;
    seo: number;
    accessibility: number;
    security: number;
    bestPractices: number;
  };
  winnerCategory: {
    overall: 'target' | 'competitor' | 'tie';
    performance: 'target' | 'competitor' | 'tie';
    seo: 'target' | 'competitor' | 'tie';
    accessibility: 'target' | 'competitor' | 'tie';
    security: 'target' | 'competitor' | 'tie';
  };
  comparisonInsights: string[];
}
