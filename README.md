# AI Website Auditor 🚀

> **Moderní full-stack platforma pro 360° audit webových stránek** — analýza výkonu, technického SEO, bezpečnosti, přístupnosti (WCAG 2.1), srovnání s konkurencí a generování akčních AI doporučení včetně agenturní obchodní nabídky.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![WCAG](https://img.shields.io/badge/WCAG-2.1_AA-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)

---

## ✨ Klíčové funkce

### ⚡ 1. Výkon & Core Web Vitals
- Měření klíčových uživatelských metrik: **LCP**, **FID / TBT**, **CLS**, **FCP** a **TTFB**.
- Integrace s **Google PageSpeed Insights API** pro přesná laboratorní i reálná data.
- Detekce **render-blocking skriptů** a vyhodnocení odloženého načítání obrázků (**lazy loading**).

### 🔍 2. Hloubkové technické SEO
- Analýza `<title>`, meta description, kanonických tagů, OpenGraph a Twitter Cards.
- **Validace strukturovaných dat:** Schema.org JSON-LD parser.
- **Inteligentní heading tree parser:** Bez falešně pozitivních hlášení — extrahuje přístupné názvy z `img[alt]`, SVG a detekuje vizuálně skryté nadpisy (`sr-only`).
- **Živé ověření robots.txt a sitemap.xml:** Včetně automatického dohledání sitemap deklarovaných přímo uvnitř `robots.txt`.
- **Interaktivní Google SERP simulátor:** Živý náhled zobrazení ve výsledcích vyhledávání.

### 🛡️ 3. Bezpečnost & HTTP hlavičky
- Kontrola implementace moderních bezpečnostních hlaviček:
  - **HSTS** (Strict-Transport-Security)
  - **CSP** (Content-Security-Policy)
  - **X-Frame-Options** (Ochrana proti Clickjackingu)
  - **X-Content-Type-Options** (Ochrana proti MIME sniffing)
  - **Referrer-Policy** a SSL/TLS certifikace

### ♿ 4. Přístupnost (WCAG 2.1 AA)
- Diagnostika chybějících alternativních textů (`alt`).
- Kontrola atributu `lang`, sémantických HTML5 orientačních bodů (`<main>`, `<nav>`, `<header>`).
- Validace popisků formulářových polí a detekce porušení hierarchie nadpisů (přeskoky úrovní).

### 🤖 5. AI doporučení & Agenturní Pitch Generator
- **Prioritizovaná doporučení:** Konkrétní návrhy úprav rozdělené podle dopadu (vysoký / střední / nízký) s ukázkami kódu (HTML/CSS/JS).
- **Agency Pitch Generator:** Automatická kalkulace člověkohodin, odhad ROI pro klienta a vygenerování konceptu e-mailové nabídky připravené k odeslání.

### 📊 6. Export do PDF & Srovnání konkurence
- **Kompletní tiskový report:** Připraveno pro A4 formát s čistou typografií a zamezením nevhodných zlomů stránek (`break-inside: avoid`).
- **Side-by-side srovnání:** Porovnání dvou domén vedle sebe s vizuálním vyhodnocením rozdílů a určením vítěze v jednotlivých kategoriích.
- **Lokální historie auditů:** Ukládání výsledků do `localStorage` s možností exportu a importu JSON dat.

---

## 🛠️ Použité technologie

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Jazyk:** [TypeScript 5](https://www.typescriptlang.org/) (striktní typová kontrola)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (moderní temný UI design)
- **HTML Crawler & Parser:** [Cheerio](https://cheerio.js.org/) (rychlý serverový DOM parser)
- **Ikony & UI:** [Lucide React](https://lucide.dev/)
- **AI Integrace:** OpenAI API (GPT-4o-mini) + inteligentní offline heuristický engine

---

## 📂 Struktura projektu

```text
├── app/
│   ├── api/
│   │   ├── audit/route.ts       # Endpoint pro audit zadané URL
│   │   └── compare/route.ts     # Endpoint pro porovnání 2 webů
│   ├── globals.css              # Globální styly, dark theme a @media print pravidla
│   ├── layout.tsx               # Root layout se SEO metadaty a JSON-LD
│   └── page.tsx                 # Hlavní stránka aplikace
├── components/
│   ├── AccessibilityCard.tsx    # WCAG 2.1 diagnostika přístupnosti
│   ├── AgencyPitchCard.tsx      # Generátor obchodní nabídky pro agentury
│   ├── AssetsCard.tsx           # Analýza assetů, skriptů a payloadu
│   ├── AuditDashboard.tsx       # Hlavní dashboard s navigací v záložkách
│   ├── CompetitorView.tsx       # Porovnání dvou webů vedle sebe
│   ├── PrintReport.tsx          # Ucelený reprezentativní report pro tisk a PDF
│   ├── ScoreGauge.tsx           # Animovaný kruhový SVG graf skóre
│   ├── SecurityCard.tsx         # Audit HTTP bezpečnostních hlaviček
│   ├── SeoCard.tsx              # SEO audit s interaktivním SERP simulátorem
│   └── UrlInputForm.tsx         # Vstupní formulář s presety a validací
├── lib/
│   ├── accessibility.ts         # WCAG evaluační pravidla
│   ├── crawler.ts               # Server-side HTML & meta crawler (Cheerio)
│   ├── lighthouse.ts            # Integrace Google PageSpeed Insights
│   └── openai.ts                # AI generátor doporučení a klientského pitche
└── types/
    └── audit.ts                 # TypeScript definice auditních dat
```

---

## 🚀 Rychlý start

### Požadavky
- Node.js 18+
- npm / yarn / pnpm

### Instalace a spuštění

```bash
# 1. Klonování repozitáře
git clone https://github.com/hck6ladik-coder/AI-Website-Auditor.git
cd AI-Website-Auditor

# 2. Instalace závislostí
npm install

# 3. Spuštění vývojového serveru
npm run dev
```

Aplikace bude dostupná na adrese `http://localhost:3000`.

### Volitelná konfigurace (Environment Variables)
Aplikace funguje plnohodnotně i bez externích klíčů díky vestavěným heuristickým enginům. Pro reálná Google Lighthouse data a GPT-4o-mini lze volitelně přidat `.env.local`:

```env
PAGESPEED_API_KEY=vase_google_api_key
OPENAI_API_KEY=vase_openai_api_key
```

---

## 📄 Licence

Tento projekt je licencován pod licencí [MIT](LICENSE).
