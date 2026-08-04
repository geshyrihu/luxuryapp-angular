# Emoji Audit

- Generated at: 2026-08-02T00:57:26.388Z
- Scope: `src/`
- Total matches: 1260
- User-facing matches: 324
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/apps: 584
- app/shared: 228
- src/styles: 149
- app/routing: 136
- app/core: 116
- app/root: 38
- src/environments: 5
- src/root: 4

## Top User-Facing Modules

- app/apps: 225
- app/core: 59
- app/shared: 20
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 481
- code_string: 199
- code_comment: 192
- template_comment: 182
- template_text: 119
- style_comment: 51
- code_misc: 21
- style_content: 6
- style_text: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

