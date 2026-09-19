# AI Website Auditor 🚀

Komplexní webová aplikace pro audit webových stránek poháněná **Next.js 15 (App Router)**, **TypeScriptem**, **Tailwind CSS**, **Cheerio HTML crawlerem**, **Google Lighthouse / Core Web Vitals metrikami**, **WCAG 2.1 kontrolou přístupnosti**, **porovnáváním s konkurencí** a **AI doporučeními**.

---

## 📋 Přehled implementovaných úkolů (16/16)

### 🔴 High Priority (8/8)
1. **Initialize Next.js**: TypeScript + Tailwind CSS + ESLint v nejnovější architektuře.
2. **Project structure**: Čistá struktura App Routeru (`/app`, `/components`, `/lib`, `/types`).
3. **URL input form**: Validace URL na homepage (kontrola protokolu, domény, chybové stavy a rychlé předvolby webů).
4. **Lighthouse API**: Měření Core Web Vitals (LCP, FCP, CLS, TBT, TTFB, Speed Index) s integrací Google PageSpeed Insights API a inteligentním diagnostickým fallbackem.
5. **SEO crawler**: Server-side crawler parsující HTML (Cheerio) – kontrola `<title>`, meta description, hierarchie nadpisů H1–H3, OpenGraph karet, Twitter Card, Schema.org JSON-LD a kanonických tagů.
6. **OpenAI integration**: Generování prioritizovaných AI doporučení na míru s konkrétními ukázkami kódu a podporou vlastního API klíče i offline heuristického AI enginu.
7. **Dashboard**: Moderní vizuální dashboard s kruhovými skóre indikátory (Gauges), Google SERP náhledem, kartami metrik a záložkami (Přehled, Rychlost, SEO, Přístupnost, Bezpečnost, Assety, Agenturní nabídka, AI, Technologie).
8. **Loading/Error states**: 5krokový animovaný indikátor postupu analýzy v reálném čase a přehledné chybové hlášky pro neexistující nebo nedostupné domény.
9. **Bezpečnost & HTTP hlavičky**: Kontrola SSL, HSTS, CSP, X-Frame-Options, X-Content-Type-Options a Referrer-Policy.
10. **Assety & Payload analýza**: Velikost HTML, počty externích/inline skriptů, stylů, obrázků, iframů, fontů a externích domén.
11. **Agenturní nabídka (Lead-Gen)**: Automatické vygenerování návrhu servisních balíčků pro klienta s odhadem času realizace, ROI a zkopírováním do e-mailu.

### 🟡 Medium Priority (5/5)
9. **Accessibility checker (a11y)**: Kontrola chybějících alt textů u obrázků, atributu `lang`, sémantických orientačních bodů (`<main>`, `<nav>`), popisků formulářových polí a odkazů podle WCAG 2.1.
10. **PDF export**: Optimalizovaný tiskový styl (`@media print`) pro stažení čistého a reprezentativního PDF reportu bez rušivých tlačítek a ovládacích prvků.
11. **Competitor comparison**: Porovnání dvou URL vedle sebe (Váš web vs Konkurent) s vizuálními delta rozdíly skóre a vyhodnocením vítěze v každé kategorii.
12. **Responsive design**: Plná optimalizace rozvržení pro mobilní telefony, tablety i velké desktopové monitory s tmavým tématem.
13. **SEO app sám**: Vlastní meta tagy, OpenGraph karty, JSON-LD `WebApplication` schéma, dynamické `robots.txt` a `sitemap.xml`.

### 🟢 Low Priority (3/3)
14. **Database / Historie auditů**: Klientské ukládání auditů do `localStorage` s vyhledáváním, načtením z historie, mazáním a exportem/importem JSON souborů.
15. **Deploy Vercel**: Připravená konfigurace `vercel.json` a optimalizovaný bezchybný produkční build (`npm run build`).
16. **README.cz**: Kompletní dokumentace v českém jazyce.

---

## 🛠️ Architektura a struktura projektu

```text
├── app/
│   ├── api/
│   │   ├── audit/route.ts       # Endpoint pro audit zadané URL
│   │   └── compare/route.ts     # Endpoint pro porovnání 2 webů
│   ├── globals.css              # Globální CSS proměnné, temné téma a print styly
│   ├── layout.tsx               # Hlavní layout s meta tagy a JSON-LD schématem
│   ├── page.tsx                 # Hlavní stránka spojující stav, formulář a dashboard
│   ├── robots.ts                # Generátor robots.txt pro SEO aplikace
│   └── sitemap.ts               # Generátor sitemap.xml
├── components/
│   ├── AccessibilityCard.tsx    # WCAG diagnostika a přehled problémů přístupnosti
│   ├── ApiKeyModal.tsx          # Dialog pro zadání vlastního OpenAI API klíče
│   ├── AuditDashboard.tsx       # Hlavní rozhraní s metrikami a přepínáním záložek
│   ├── CompetitorView.tsx       # Rozhraní pro srovnání dvou webů vedle sebe
│   ├── HistoryDrawer.tsx        # Boční panel historie auditů (hledání, import, export)
│   ├── LoadingProgress.tsx      # Animovaný indikátor průběhu v 5 krocích
│   ├── MetricCard.tsx           # Karta metriky Core Web Vitals s vizuální škálou
│   ├── Navbar.tsx               # Horní navigační lišta s akcemi
│   ├── PdfExportButton.tsx      # Tlačítko pro export reportu do PDF
│   ├── ScoreGauge.tsx           # Animovaný kruhový SVG graf skóre
│   ├── SeoCard.tsx              # SEO audit, Google SERP simulátor a OpenGraph
│   └── UrlInputForm.tsx         # Formulář pro zadání URL s rychlými presety
├── lib/
│   ├── accessibility.ts         # Logika kontroly přístupnosti a WCAG 2.1
│   ├── crawler.ts               # Cheerio crawler pro stahování a parsování HTML
│   ├── lighthouse.ts            # Měření Core Web Vitals a Google PSI integrace
│   ├── openai.ts                # Generátor AI doporučení a heuristický engine
│   ├── storage.ts               # Správa historie auditů v localStorage
│   └── utils.ts                 # Pomocné funkce pro formátování a barvy skóre
├── types/
│   └── audit.ts                 # Kompletní TypeScript rozhraní datového modelu
├── next.config.mjs              # Konfigurace Next.js
├── tailwind.config.ts           # Konfigurace Tailwind CSS
├── tsconfig.json                # TypeScript nastavení
├── vercel.json                  # Konfigurace pro nasazení na Vercel
└── package.json                 # Závislosti a skripty projektu
```

---

## 🚀 Jak aplikaci spustit lokálně

### 1. Požadavky
- Node.js verze 18.18+ (doporučeno Node.js 20+)
- npm nebo yarn

### 2. Instalace závislostí
```bash
npm install
```

### 3. Nastavení proměnných prostředí (volitelné)
V kořenovém adresáři vytvořte soubor `.env.local`:
```env
# Volitelný klíč pro OpenAI (pokud není zadán, aplikace používá inteligentní heuristický AI engine)
OPENAI_API_KEY=sk-proj-...

# Volitelný klíč pro Google PageSpeed Insights API (pokud není zadán, využívá se bezplatná kvóta)
GOOGLE_PSI_API_KEY=AIzaSy...
```

> **Poznámka:** Aplikace funguje **100% spolehlivě i bez jakýchkoliv API klíčů** díky zabudovanému inteligentnímu fallback enginu!

### 4. Spuštění vývojového serveru
```bash
npm run dev
```
Aplikace poběží na adrese [http://localhost:3000](http://localhost:3000).

### 5. Produkční sestavení (Build)
```bash
npm run build
npm run start
```

---

## 📊 Měřené metriky a diagnostika

### 1. Core Web Vitals (Výkon)
- **LCP (Largest Contentful Paint)**: Čas načtení největšího bloku obsahu (cíl: < 2.5 s).
- **FCP (First Contentful Paint)**: První vykreslení obsahu na obrazovku (cíl: < 1.8 s).
- **CLS (Cumulative Layout Shift)**: Míra vizuální stability a nechtěných posunů prvků (cíl: < 0.1).
- **TBT (Total Blocking Time)**: Doba blokování hlavního vlákna skripty (cíl: < 200 ms).
- **TTFB (Time to First Byte)**: Doba odezvy serveru (cíl: < 800 ms).
- **Speed Index**: Index rychlosti vizuálního vyplnění stránky.

### 2. On-Page SEO & SERP
- **Google SERP simulátor**: Živý náhled toho, jak se stránka zobrazí ve výsledcích vyhledávání Google.
- **Délka titulku a meta description**: Automatická kontrola ideálních limitů znaků.
- **Hierarchie nadpisů**: Detekce H1 (kontrola existence i případné duplicity) a počty H2 a H3.
- **OpenGraph & Twitter Card**: Kontrola náhledů pro sociální sítě.
- **Strukturovaná data Schema.org**: Detekce a výpis všech JSON-LD typů.
- **Indexovatelnost**: Kontrola meta robots (`noindex`, `nofollow`) a kanonických URL.
- **Obsahová analýza**: Počet slov, odhadovaná doba čtení, počty interních a externích odkazů.

### 3. Přístupnost (a11y dle WCAG 2.1)
- Detekce chybějících alternativních textů (`alt`) u všech obrázků včetně výpisu konkrétních prvků.
- Kontrola přítomnosti atributu `lang` u tagu `<html>`.
- Kontrola sémantických orientačních bodů (`<main>`, `<nav>`).
- Kontrola označení formulářových polí (`<label for>` a `aria-label`).
- Odkazy bez textového popisu.

### 4. AI Doporučení s ukázkami kódu
- Priorita (Vysoká / Střední / Nízká).
- Odhadovaný dopad (např. *+15 bodů v Google PageSpeed*).
- Odhadovaná časová náročnost implementace.
- Detailní popis problému + konkrétní řešení.
- Připravený kód (HTML / CSS / JS / HTTP hlavičky) s možností zkopírování do schránky jedním kliknutím.

---

## 🌐 Nasazení na Vercel

Aplikace je plně připravena pro nasazení na cloudovou platformu [Vercel](https://vercel.com):

1. Nahrajte repozitář na GitHub / GitLab / Bitbucket.
2. V prostředí Vercel klikněte na **"Add New Project"** a zvolte tento repozitář.
3. V nastavení projektu (Settings -> Environment Variables) můžete volitelně přidat:
   - `OPENAI_API_KEY`
   - `GOOGLE_PSI_API_KEY`
4. Klikněte na **Deploy**. Soubor `vercel.json` zajistí správné nastavení a spuštění.
