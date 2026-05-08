#!/usr/bin/env node

/**
 * check-keywords.js
 * Checks a new keyword against your existing keywords.json for similarity
 * Usage: node scripts/check-keywords.js "your new keyword here"
 *
 * Similarity is measured using Jaccard similarity on word sets.
 * A score of 1.0 = identical, 0.0 = completely different.
 * Keywords scoring >= 0.6 are flagged as too similar.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYWORDS_FILE = path.join(__dirname, "../keywords.json");
const SIMILARITY_THRESHOLD = 0.6; // flag if 60%+ words overlap

// ─── Similarity logic ───────────────────────────────────────────────────────

function normalize(keyword) {
    return keyword
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")  // remove special chars
        .replace(/\b(a|an|the|in|on|at|for|to|of|and|or|with|how|what|why|best|top)\b/g, "") // strip stopwords
        .replace(/\s+/g, " ")
        .trim();
}

function jaccardSimilarity(a, b) {
    const setA = new Set(normalize(a).split(" ").filter(Boolean));
    const setB = new Set(normalize(b).split(" ").filter(Boolean));

    const intersection = [...setA].filter((w) => setB.has(w));
    const union = new Set([...setA, ...setB]);

    if (union.size === 0) return 0;
    return intersection.length / union.size;
}

function getSimilarityLabel(score) {
    if (score >= 0.85) return "🔴 Nearly identical";
    if (score >= 0.7) return "🟠 Very similar";
    if (score >= 0.6) return "🟡 Similar";
    return "🟢 Different enough";
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
    const newKeyword = process.argv[2];

    if (!newKeyword) {
        console.log(`
Usage: node scripts/check-keywords.js "your new keyword"

Example:
  node scripts/check-keywords.js "roblox grow a garden pets that give xp"
`);
        process.exit(1);
    }

    if (!fs.existsSync(KEYWORDS_FILE)) {
        console.error(`❌ keywords.json not found at ${KEYWORDS_FILE}`);
        process.exit(1);
    }

    const keywords = JSON.parse(fs.readFileSync(KEYWORDS_FILE, "utf-8"));

    console.log(`\n🔎 Checking: "${newKeyword}"\n`);
    console.log(`Comparing against ${keywords.length} existing keywords...\n`);

    const results = keywords
        .map((entry) => ({
            ...entry,
            score: jaccardSimilarity(newKeyword, entry.keyword),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

    const flagged = results.filter((r) => r.score >= SIMILARITY_THRESHOLD);
    const safe = results.filter((r) => r.score < SIMILARITY_THRESHOLD && r.score >= 0.3);

    if (flagged.length === 0) {
        console.log("✅ No similar keywords found — safe to add!\n");
    } else {
        console.log(`⚠️  Found ${flagged.length} similar keyword(s) — review before adding:\n`);
        flagged.forEach(({ keyword, type, status, slug, score }) => {
            const label = getSimilarityLabel(score);
            const pct = Math.round(score * 100);
            console.log(`  ${label} (${pct}% overlap)`);
            console.log(`  keyword : "${keyword}"`);
            console.log(`  type    : ${type || "not set"}`);
            console.log(`  status  : ${status}`);
            if (slug) console.log(`  slug    : ${slug}`);
            console.log();
        });
    }

    if (safe.length > 0) {
        console.log(`ℹ️  Loosely related (30–59% overlap) — probably fine:\n`);
        safe.forEach(({ keyword, score }) => {
            const pct = Math.round(score * 100);
            console.log(`  ${pct}% — "${keyword}"`);
        });
        console.log();
    }

    // Recommendation
    if (flagged.length > 0) {
        console.log(`💡 Recommendation:`);
        console.log(`   The flagged keywords cover similar ground.`);
        console.log(`   Consider whether "${newKeyword}" brings a different angle.`);
        console.log(`   If not, add it with status "skipped" to keep a record:\n`);
        console.log(`   { "keyword": "${newKeyword}", "type": "longtail", "status": "skipped", "skipReason": "too similar to existing keyword" }\n`);
    }
}

main();