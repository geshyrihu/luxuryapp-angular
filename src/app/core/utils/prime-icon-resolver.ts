type LegacyIconRule = {
  iconClass: string;
  tokens: readonly string[];
};

const LEGACY_ICON_RULES: LegacyIconRule[] = [
  {
    tokens: ["\u{1F464}\u{1F5D1}", "\u{1F464}\u{1F5D1}\uFE0F"],
    iconClass: "pi pi-user-minus",
  },
  { tokens: ["\u2190"], iconClass: "pi pi-arrow-left" },
  { tokens: ["\u2705"], iconClass: "pi pi-check" },
  {
    tokens: ["\u270F", "\u270F\uFE0F", "\u{1F4DD}"],
    iconClass: "pi pi-pencil",
  },
  { tokens: ["\u2795"], iconClass: "pi pi-plus" },
  { tokens: ["\u2796"], iconClass: "pi pi-minus" },
  { tokens: ["\u274C"], iconClass: "pi pi-times-circle" },
  { tokens: ["\u{1F50D}", "\u{1F50E}"], iconClass: "pi pi-search" },
  { tokens: ["\u{1F441}"], iconClass: "pi pi-eye" },
  {
    tokens: ["\u{1F4E5}", "\u2B07", "\u2B07\uFE0F"],
    iconClass: "pi pi-download",
  },
  {
    tokens: ["\u{1F4E4}", "\u2B06", "\u2B06\uFE0F"],
    iconClass: "pi pi-upload",
  },
  { tokens: ["\u{1F4E7}"], iconClass: "pi pi-envelope" },
  { tokens: ["\u{1F4CD}"], iconClass: "pi pi-map-marker" },
  { tokens: ["\u{1F4D1}", "\u{1F4C4}", "\u{1F4DC}"], iconClass: "pi pi-file" },
  { tokens: ["\u{1F4CB}"], iconClass: "pi pi-clone" },
  { tokens: ["\u{1F4C2}", "\u{1F4C1}"], iconClass: "pi pi-folder" },
  { tokens: ["\u{1F5BC}", "\u{1F4F8}"], iconClass: "pi pi-image" },
  { tokens: ["\u{1F4CE}"], iconClass: "pi pi-paperclip" },
  { tokens: ["\u{1F4CA}"], iconClass: "pi pi-chart-bar" },
  { tokens: ["\u{1F4C5}"], iconClass: "pi pi-calendar" },
  { tokens: ["\u{1F4AC}"], iconClass: "pi pi-comments" },
  { tokens: ["\u{1F4BE}", "\u{1F504}"], iconClass: "pi pi-save" },
  { tokens: ["\u{1F4B2}"], iconClass: "pi pi-dollar" },
  { tokens: ["\u{1F465}", "\u{1F91D}"], iconClass: "pi pi-users" },
  { tokens: ["\u{1F464}"], iconClass: "pi pi-user" },
  { tokens: ["\u{1F511}"], iconClass: "pi pi-key" },
  { tokens: ["\u{1F512}"], iconClass: "pi pi-lock" },
  { tokens: ["\u{1F513}"], iconClass: "pi pi-lock-open" },
  { tokens: ["\u{1F517}"], iconClass: "pi pi-link" },
  { tokens: ["\u{1F550}", "\u23F3"], iconClass: "pi pi-clock" },
  { tokens: ["\u{1F680}"], iconClass: "pi pi-send" },
  { tokens: ["\u{1F5A8}"], iconClass: "pi pi-print" },
  { tokens: ["\u{1F4E6}"], iconClass: "pi pi-box" },
  { tokens: ["\u{1F4D8}", "\u{1F4DA}"], iconClass: "pi pi-book" },
  { tokens: ["\u{1F6AA}"], iconClass: "pi pi-sign-out" },
  { tokens: ["\u{1F6AB}"], iconClass: "pi pi-ban" },
  { tokens: ["\u{1F6E1}"], iconClass: "pi pi-shield" },
  { tokens: ["\u{1F6E0}", "\u2699", "\u2699\uFE0F"], iconClass: "pi pi-cog" },
  { tokens: ["\u{1F3C1}"], iconClass: "pi pi-flag" },
  { tokens: ["\u{1F3DB}"], iconClass: "pi pi-building" },
  { tokens: ["\u{1F9FE}"], iconClass: "pi pi-receipt" },
  { tokens: ["\u{1FA9F}"], iconClass: "pi pi-window-maximize" },
  {
    tokens: ["\u26A0", "\u26A0\uFE0F"],
    iconClass: "pi pi-exclamation-triangle",
  },
];

export function normalizePrimeIconClass(
  rawIconClass: string | null | undefined,
): string {
  const trimmed = (rawIconClass ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("pi ")) return trimmed;
  if (trimmed.startsWith("pi-")) return `pi ${trimmed}`;
  return trimmed;
}

export function resolvePrimeIcon(
  rawValue: string | null | undefined,
  fallback = "",
): string {
  const directIcon = normalizePrimeIconClass(rawValue);
  if (directIcon.startsWith("pi ")) {
    return directIcon;
  }

  const normalized = (rawValue ?? "")
    .normalize("NFKC")
    .replace(/\uFE0F/g, "")
    .trim();

  if (!normalized) {
    return fallback;
  }

  const matchedRule = LEGACY_ICON_RULES.find(({ tokens }) =>
    tokens.some((token) => normalized.includes(token)),
  );

  return matchedRule?.iconClass ?? fallback;
}
