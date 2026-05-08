#!/usr/bin/env node

/**
 * generate-post.js
 * AI-powered SEO blog post generator for Blogirator
 * Supports pillar and longtail keyword types
 * Usage: node scripts/generate-post.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ────────────────────────────────────────────────────────────────
const SITE_URL = process.env.SITE_URL || "https://yoursite.com";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const KEYWORDS_FILE = path.join(__dirname, "../keywords.json");
const CONTENT_DIR = path.join(__dirname, "../content"); // ← flat content/ folder
const DATE = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set.");
  process.exit(1);
}

// ─── Gemini API call ────────────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 4096 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ─── Step 1: SEO Research ───────────────────────────────────────────────────
async function generateSeoMetadata(keyword, type = "longtail") {
  console.log(`\n🔍 Step 1: Generating SEO metadata for "${keyword}" [${type}]...`);

  const isPillar = type === "pillar";
  const outlineCount = isPillar ? 7 : 5;
  const wordCount = isPillar ? 2500 : 1500;
  const outlinePlaceholders = Array.from(
    { length: outlineCount },
    (_, i) => `H2 section ${i + 1}`
  );
  const postTypeNote = isPillar
    ? "PILLAR — broad overview covering the full topic at a high level, suitable for linking out to more specific subtopics"
    : "LONGTAIL — specific deep-dive targeting a precise search query, goes into practical detail";

  const system = `You are an expert SEO strategist. 
You MUST respond with valid JSON only — no markdown, no backticks, no explanation.`;

  const user = `Analyze the keyword "${keyword}" and return a JSON object with these exact fields:
{
  "title": "Compelling blog post title, keyword-rich, under 60 characters",
  "slug": "url-friendly-slug-from-title",
  "description": "Meta description exactly 150-155 characters, includes keyword, compelling CTA",
  "outline": ${JSON.stringify(outlinePlaceholders)},
  "related_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "search_intent": "informational",
  "target_word_count": ${wordCount}
}

Post type: ${postTypeNote}`;

  const raw = await callGemini(system, user);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error(`Failed to parse SEO metadata JSON:\n${raw}`);
  }
}

// ─── Step 2: Blog Writing ───────────────────────────────────────────────────
async function generateBlogContent(keyword, meta, type = "longtail") {
  console.log(`\n✍️  Step 2: Writing ${type} blog post (~${meta.target_word_count} words)...`);

  const isPillar = type === "pillar";

  const system = `You are an expert SEO content writer who writes engaging, 
authoritative blog posts that rank well and provide genuine value to readers.
Write in a clear, friendly, professional tone. Avoid fluff and filler sentences.
${isPillar
      ? "This is a PILLAR post — write a broad, comprehensive overview that introduces all major subtopics. Each section should be informative but not exhaustively detailed, since readers will click through to dedicated posts for depth."
      : "This is a LONGTAIL post — write a specific, detailed deep-dive. Be practical and thorough. Include steps, examples, and actionable advice."
    }`;

  const user = `Write a complete blog post for the keyword: "${keyword}"

Title: ${meta.title}
Target word count: ${meta.target_word_count} words
Search intent: ${meta.search_intent}
Post type: ${isPillar ? "Pillar (broad overview)" : "Longtail (specific deep-dive)"}

Follow this exact outline:
${meta.outline.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Naturally incorporate these related keywords throughout the post:
${meta.related_keywords.join(", ")}

Requirements:
- Start with a strong 2-3 sentence intro that hooks the reader and includes the main keyword
- Use ## for H2 headings (from the outline) and ### for H3 subheadings where helpful
- Include practical tips, examples, or steps inside each section
${isPillar
      ? "- Each section should briefly introduce the subtopic and naturally invite the reader to explore more\n- End with a conclusion that summarizes all subtopics covered"
      : "- Go deep on each section with specific details, not general advice\n- End with a clear, actionable conclusion the reader can apply immediately"
    }
- Do NOT include frontmatter or the main H1 title — just the body content starting from the intro paragraph
- Output plain MDX content only`;

  return await callGemini(system, user);
}

// ─── Step 3: JSON-LD Schema ─────────────────────────────────────────────────
async function generateJsonLd(meta) {
  console.log(`\n🏷️  Step 3: Generating JSON-LD structured data...`);

  const system = `You are an SEO technical specialist. 
Respond with valid JSON only — no markdown, no backticks, no explanation.`;

  const user = `Generate an Article JSON-LD schema for this blog post:

Title: ${meta.title}
Description: ${meta.description}
URL: ${SITE_URL}/blog/${meta.slug}
Date published: ${DATE}
Site name: ${SITE_URL.replace("https://", "")}

Return a complete JSON-LD object following schema.org Article spec.`;

  const raw = await callGemini(system, user);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error(`Failed to parse JSON-LD:\n${raw}`);
  }
}

// ─── Step 4: Assemble MDX file ──────────────────────────────────────────────
function assembleMdx(meta, content, jsonLd, type) {
  const frontmatter = `---
title: "${meta.title.replace(/"/g, '\\"')}"
description: "${meta.description.replace(/"/g, '\\"')}"
date: ${DATE}
slug: ${meta.slug}
type: ${type}
canonical: ${SITE_URL}/blog/${meta.slug}
keywords: [${meta.related_keywords.map((k) => `"${k}"`).join(", ")}]
---`;

  // Inline JSON-LD as a script tag at the top of the MDX
  const jsonLdBlock = `<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: \`${JSON.stringify(jsonLd)}\` }}
/>`;

  const h1 = `# ${meta.title}`;

  return `${frontmatter}\n\n${jsonLdBlock}\n\n${h1}\n\n${content.trim()}\n`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function loadKeywords() {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    console.error(`❌ keywords.json not found at ${KEYWORDS_FILE}`);
    console.log(`\nCreate it with this structure:
[
  { "keyword": "roblox", "type": "pillar", "status": "pending" },
  { "keyword": "roblox grow a garden xp pets", "type": "longtail", "status": "pending" }
]`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(KEYWORDS_FILE, "utf-8"));
}

function saveKeywords(keywords) {
  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(keywords, null, 2));
}

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(`📁 Created content directory at ${CONTENT_DIR}`);
  }
}

// ─── Slug duplicate check ───────────────────────────────────────────────────
function getExistingSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting Blogirator post generator...\n");

  // 1. Load keywords and find next pending
  const keywords = loadKeywords();
  const pendingIndex = keywords.findIndex((k) => k.status === "pending");

  if (pendingIndex === -1) {
    console.log("✅ No pending keywords found. Add more to keywords.json.");
    process.exit(0);
  }

  const { keyword, type = "longtail" } = keywords[pendingIndex];
  console.log(`📌 Picked keyword: "${keyword}" [${type}]`);

  try {
    // 2. Generate SEO metadata first so we have the slug early
    const meta = await generateSeoMetadata(keyword, type);

    // 3. Slug duplicate check
    const existingSlugs = getExistingSlugs();
    if (existingSlugs.includes(meta.slug)) {
      console.log(`\n⚠️  Post already exists for slug "${meta.slug}", skipping.`);
      keywords[pendingIndex].status = "done";
      keywords[pendingIndex].slug = meta.slug;
      keywords[pendingIndex].skipReason = "slug already exists";
      saveKeywords(keywords);
      process.exit(0);
    }

    // 4. Generate content and JSON-LD
    const content = await generateBlogContent(keyword, meta, type);
    const jsonLd = await generateJsonLd(meta);

    // 5. Assemble and write the MDX file
    ensureContentDir();
    const mdx = assembleMdx(meta, content, jsonLd, type);
    const outputPath = path.join(CONTENT_DIR, `${meta.slug}.mdx`);
    fs.writeFileSync(outputPath, mdx);
    console.log(`\n✅ Blog post written to: ${outputPath}`);

    // 6. Mark keyword as done
    keywords[pendingIndex].status = "done";
    keywords[pendingIndex].slug = meta.slug;
    keywords[pendingIndex].generatedAt = DATE;
    saveKeywords(keywords);
    console.log(`\n🔖 Marked "${keyword}" as done in keywords.json`);

    // 7. Summary
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Post generated successfully!
   Type        : ${type}
   Title       : ${meta.title}
   Slug        : ${meta.slug}
   File        : content/${meta.slug}.mdx
   Live URL    : ${SITE_URL}/blog/${meta.slug}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  } catch (err) {
    console.error(`\n❌ Error generating post for "${keyword}":`, err.message);
    process.exit(1);
  }
}

main();