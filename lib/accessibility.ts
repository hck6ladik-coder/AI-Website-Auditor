import * as cheerio from "cheerio";
import { AccessibilityAuditResult, AccessibilityIssue } from "@/types/audit";

export function checkAccessibility(html: string): AccessibilityAuditResult {
  const $ = cheerio.load(html);
  const issues: AccessibilityIssue[] = [];

  // 1. Check HTML Lang attribute
  const htmlEl = $("html");
  const htmlLang = htmlEl.attr("lang")?.trim();
  const hasLangAttribute = Boolean(htmlLang && htmlLang.length >= 2);

  if (!hasLangAttribute) {
    issues.push({
      id: "a11y-missing-lang",
      title: "Chybí atribut lang u elementu <html>",
      description:
        "Čtečky obrazovky potřebují znát jazyk stránky (např. lang='cs' nebo lang='en') pro správnou výslovnost a intonaci.",
      severity: "serious",
      element: "<html>",
      wcagRule: "WCAG 2.1 - 3.1.1 Language of Page (Level A)",
    });
  }

  // 2. Images missing alt attributes
  const allImages = $("img");
  const missingAltSample: string[] = [];
  let withAlt = 0;
  let missingAlt = 0;

  allImages.each((_, el) => {
    const alt = $(el).attr("alt");
    const src = $(el).attr("src") || $(el).attr("data-src") || "obrázek";
    if (alt === undefined || alt === null) {
      missingAlt++;
      if (missingAltSample.length < 5) {
        missingAltSample.push(src.slice(0, 80));
      }
    } else {
      withAlt++;
    }
  });

  if (missingAlt > 0) {
    issues.push({
      id: "a11y-images-missing-alt",
      title: `${missingAlt} ${missingAlt === 1 ? "obrázek nemá" : "obrázků nemá"} alternativní text (alt)`,
      description:
        "Obrázky bez atributu alt jsou pro zrakově postižené uživatele nečitelné. Přidejte smysluplný alt popis nebo prázdný alt='' pro dekorativní grafiku.",
      severity: missingAlt > 3 ? "critical" : "serious",
      element: missingAltSample.join(", "),
      wcagRule: "WCAG 2.1 - 1.1.1 Non-text Content (Level A)",
    });
  }

  // 3. Semantic Landmarks
  const hasMainLandmark = $("main, [role='main']").length > 0;
  const hasNavLandmark = $("nav, [role='navigation']").length > 0;

  if (!hasMainLandmark) {
    issues.push({
      id: "a11y-missing-main",
      title: "Chybí sémantický orientační bod <main>",
      description:
        "Stránka neobsahuje element <main> ani role='main'. Asistivní technologie jej využívají k rychlému přeskočení na hlavní obsah.",
      severity: "moderate",
      element: "<body>",
      wcagRule: "WCAG 2.1 - 1.3.1 Info and Relationships (Level A)",
    });
  }

  if (!hasNavLandmark) {
    issues.push({
      id: "a11y-missing-nav",
      title: "Chybí sémantická navigace <nav>",
      description:
        "Hlavní navigační menu by mělo být uzavřeno v tagu <nav> pro snadnou navigaci zrakově znevýhodněných uživatelů.",
      severity: "minor",
      element: "<nav>",
      wcagRule: "WCAG 2.1 - 1.3.1 Info and Relationships (Level A)",
    });
  }

  // 4. Empty links without accessible name
  let emptyLinksCount = 0;
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    const ariaLabelledby = $(el).attr("aria-labelledby");
    const title = $(el).attr("title");
    const hasImgWithAlt = $(el).find("img[alt]:not([alt=''])").length > 0;
    const hasSvg = $(el).find("svg").length > 0;

    if (!text && !ariaLabel && !ariaLabelledby && !title && !hasImgWithAlt) {
      if (hasSvg && !$(el).find("svg[aria-label], svg title").length) {
        emptyLinksCount++;
      } else if (!hasSvg) {
        emptyLinksCount++;
      }
    }
  });

  if (emptyLinksCount > 0) {
    issues.push({
      id: "a11y-empty-links",
      title: `Nalezeno ${emptyLinksCount} odkazů bez textového popisu`,
      description:
        "Odkazy obsahující pouze ikony bez textu nebo bez 'aria-label' neposkytují čtečkám informaci o svém cíli.",
      severity: "serious",
      wcagRule: "WCAG 2.1 - 2.4.4 Link Purpose (In Context) (Level A)",
    });
  }

  // 5. Form inputs without associated labels
  const inputs = $("input:not([type='hidden']):not([type='submit']):not([type='button']), textarea, select");
  let missingLabels = 0;
  let withLabels = 0;

  inputs.each((_, el) => {
    const id = $(el).attr("id");
    const ariaLabel = $(el).attr("aria-label");
    const ariaLabelledby = $(el).attr("aria-labelledby");
    const hasParentLabel = $(el).closest("label").length > 0;
    const hasLinkedLabel = id ? $(`label[for='${id}']`).length > 0 : false;

    if (ariaLabel || ariaLabelledby || hasParentLabel || hasLinkedLabel) {
      withLabels++;
    } else {
      missingLabels++;
    }
  });

  if (missingLabels > 0) {
    issues.push({
      id: "a11y-missing-form-labels",
      title: `${missingLabels} formulářových polí postrádá přiřazený popisek (label)`,
      description:
        "Všechna vstupní pole formulářů musí mít explicitní <label for='...'> nebo atribut 'aria-label'.",
      severity: "critical",
      wcagRule: "WCAG 2.1 - 3.3.2 Labels or Instructions (Level A)",
    });
  }

  // 6. Viewport scale restriction check
  const viewportMeta = $('meta[name="viewport" i]').attr("content") || "";
  if (
    viewportMeta.includes("user-scalable=no") ||
    viewportMeta.includes("maximum-scale=1")
  ) {
    issues.push({
      id: "a11y-viewport-zoom-disabled",
      title: "Zakázané přibližování (zoom) v meta viewport",
      description:
        "Nastavení 'user-scalable=no' nebo 'maximum-scale=1' brání slabozrakým uživatelům zvětšit text na mobilních zařízeních.",
      severity: "serious",
      element: "<meta name='viewport'>",
      wcagRule: "WCAG 2.1 - 1.4.4 Resize text (Level AA)",
    });
  }

  // 7. Heading hierarchy skip detection (e.g. H1 → H3 without H2)
  const headingEls = $("h1, h2, h3, h4, h5, h6");
  const headingLevels: number[] = [];
  headingEls.each((_, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() || "";
    const level = parseInt(tag.replace("h", "") || "0", 10);
    if (level >= 1 && level <= 6) headingLevels.push(level);
  });

  const skippedLevels: string[] = [];
  for (let i = 1; i < headingLevels.length; i++) {
    const prev = headingLevels[i - 1];
    const curr = headingLevels[i];
    // Only flag when going deeper (e.g., H1→H3), not when going back up
    if (curr > prev + 1) {
      skippedLevels.push(`H${prev} → H${curr}`);
    }
  }

  if (skippedLevels.length > 0) {
    issues.push({
      id: "a11y-heading-hierarchy-skip",
      title: `Přeskočení úrovně nadpisů: ${skippedLevels.join(", ")}`,
      description:
        "Nadpisy by měly postupovat hierarchicky (H1 → H2 → H3). Přeskakování úrovní (např. H1 → H3 bez H2) ztěžuje navigaci pro uživatele čteček obrazovky.",
      severity: "moderate",
      element: skippedLevels.join(", "),
      wcagRule: "WCAG 2.1 - 1.3.1 Info and Relationships (Level A)",
    });
  }

  // Calculate score
  // Start with 100, deduct based on severity
  let deduction = 0;
  issues.forEach((issue) => {
    if (issue.severity === "critical") deduction += 20;
    else if (issue.severity === "serious") deduction += 12;
    else if (issue.severity === "moderate") deduction += 7;
    else if (issue.severity === "minor") deduction += 3;
  });

  const score = Math.max(25, Math.min(100, 100 - deduction));

  return {
    score,
    hasLangAttribute,
    htmlLang,
    hasMainLandmark,
    hasNavLandmark,
    emptyLinksCount,
    images: {
      total: allImages.length,
      withAlt,
      missingAlt,
      sampleMissingAlt: missingAltSample,
    },
    formLabels: {
      total: inputs.length,
      withLabel: withLabels,
      missingLabel: missingLabels,
    },
    issues,
  };
}
