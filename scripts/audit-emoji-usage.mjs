import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "src");
const reportsDir = path.join(projectRoot, "reports");
const jsonReportPath = path.join(reportsDir, "emoji-audit.json");
const markdownReportPath = path.join(reportsDir, "emoji-audit.md");

const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".ts",
  ".js",
  ".scss",
  ".css",
  ".md",
  ".txt",
]);

const EMOJI_PATTERN =
  /[\p{Extended_Pictographic}\u2190-\u21FF\u2600-\u27BF]/gu;

const SKIP_SEGMENTS = new Set([
  "node_modules",
  ".angular",
  "dist",
  "android",
  "public",
  "assets",
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function collectFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (SKIP_SEGMENTS.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(absolutePath));
      continue;
    }

    if (ALLOWED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function getModuleName(relativePath) {
  const segments = toPosix(relativePath).split("/");

  if (segments[0] !== "src") {
    return segments[0] ?? "root";
  }

  if (segments[1] === "app") {
    if (!segments[2] || segments[2].includes(".")) {
      return "app/root";
    }

    if (segments[2] === "features") {
      if (!segments[3] || segments[3].includes(".")) {
        return "features/root";
      }

      return `features/${segments[3] ?? "misc"}`;
    }

    return `app/${segments[2]}`;
  }

  if (!segments[1] || segments[1].includes(".")) {
    return "src/root";
  }

  return `src/${segments[1]}`;
}

function classifyUsage(relativePath, line) {
  const normalizedPath = toPosix(relativePath);
  const extension = path.extname(relativePath);
  const trimmed = line.trim();

  if (/\[emoji\]\s*=|emoji\s*=/.test(line)) {
    return "button_emoji_input";
  }

  if (extension === ".html") {
    if (trimmed.startsWith("<!--")) {
      return "template_comment";
    }

    return "template_text";
  }

  if (extension === ".scss" || extension === ".css") {
    if (/content\s*:/.test(line)) {
      return "style_content";
    }

    if (trimmed.startsWith("/*") || trimmed.startsWith("//")) {
      return "style_comment";
    }

    return "style_text";
  }

  if (extension === ".md" || extension === ".txt") {
    return "docs";
  }

  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*")
  ) {
    return "code_comment";
  }

  if (/["'`].*[\p{Extended_Pictographic}\u2190-\u21FF\u2600-\u27BF].*["'`]/u.test(line)) {
    return "code_string";
  }

  if (/console\.(log|warn|error|info)/.test(line)) {
    return "code_log";
  }

  if (normalizedPath.includes("/environments/")) {
    return "config";
  }

  return "code_misc";
}

function severityFor(category) {
  switch (category) {
    case "button_emoji_input":
      return "high";
    case "template_text":
    case "style_content":
    case "code_string":
      return "medium";
    default:
      return "low";
  }
}

function aggregate(entries, keySelector) {
  const map = new Map();

  for (const entry of entries) {
    const key = keySelector(entry);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function summarizeTop(items, limit = 12) {
  return items.slice(0, limit).map(({ key, count }) => `- ${key}: ${count}`);
}

function collectEntries() {
  const files = collectFiles(sourceRoot);
  const entries = [];

  for (const absolutePath of files) {
    const relativePath = path.relative(projectRoot, absolutePath);
    const content = readFileSync(absolutePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const matches = line.match(EMOJI_PATTERN);
      if (!matches) {
        return;
      }

      entries.push({
        file: toPosix(relativePath),
        line: index + 1,
        category: classifyUsage(relativePath, line),
        module: getModuleName(relativePath),
        severity: severityFor(classifyUsage(relativePath, line)),
        symbols: [...new Set(matches)],
        preview: line.trim().slice(0, 180),
      });
    });
  }

  return entries.sort((a, b) => {
    if (a.file === b.file) {
      return a.line - b.line;
    }

    return a.file.localeCompare(b.file);
  });
}

function buildMarkdown(summary) {
  return [
    "# Emoji Audit",
    "",
    `- Generated at: ${summary.generatedAt}`,
    `- Scope: \`src/\``,
    `- Total matches: ${summary.totalMatches}`,
    `- User-facing matches: ${summary.userFacingMatches}`,
    `- Button emoji inputs: ${summary.buttonEmojiInputs}`,
    "",
    "## Priority Order",
    "",
    "1. `button_emoji_input`: migrate templates/components still passing `emoji`.",
    "2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.",
    "3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.",
    "4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.",
    "",
    "## Top Modules",
    "",
    ...summarizeTop(summary.byModule),
    "",
    "## Top User-Facing Modules",
    "",
    ...summarizeTop(summary.byUserFacingModule),
    "",
    "## Top Categories",
    "",
    ...summarizeTop(summary.byCategory),
    "",
    "## Highest Priority Files",
    "",
    ...summary.topPriorityFiles.map(
      ({ key, count }) => `- ${key}: ${count} high-priority matches`,
    ),
    "",
    "## Notes",
    "",
    "- Full detail lives in `reports/emoji-audit.json`.",
    "- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.",
    "- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.",
    "",
  ].join("\n");
}

function main() {
  const entries = collectEntries();
  const userFacingEntries = entries.filter((entry) =>
    ["button_emoji_input", "template_text", "style_content", "code_string"].includes(
      entry.category,
    ),
  );

  const highPriorityEntries = entries.filter(
    (entry) => entry.severity === "high",
  );

  const summary = {
    generatedAt: new Date().toISOString(),
    totalMatches: entries.length,
    userFacingMatches: userFacingEntries.length,
    buttonEmojiInputs: entries.filter(
      (entry) => entry.category === "button_emoji_input",
    ).length,
    byModule: aggregate(entries, (entry) => entry.module),
    byUserFacingModule: aggregate(userFacingEntries, (entry) => entry.module),
    byCategory: aggregate(entries, (entry) => entry.category),
    topPriorityFiles: aggregate(highPriorityEntries, (entry) => entry.file).slice(
      0,
      20,
    ),
    entries,
  };

  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(jsonReportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  writeFileSync(markdownReportPath, `${buildMarkdown(summary)}\n`, "utf8");

  console.log(`Emoji audit created:
- ${path.relative(projectRoot, markdownReportPath)}
- ${path.relative(projectRoot, jsonReportPath)}
Total matches: ${summary.totalMatches}
User-facing matches: ${summary.userFacingMatches}
Button emoji inputs: ${summary.buttonEmojiInputs}`);
}

main();
