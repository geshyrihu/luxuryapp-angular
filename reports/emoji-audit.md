# Emoji Audit

- Generated at: 2026-07-29T19:59:38.318Z
- Scope: `src/`
- Total matches: 1378
- User-facing matches: 360
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/apps: 698
- app/shared: 225
- src/styles: 156
- app/routing: 136
- app/core: 116
- app/root: 38
- src/environments: 5
- src/root: 4

## Top User-Facing Modules

- app/apps: 260
- app/core: 60
- app/shared: 20
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 480
- code_string: 217
- code_comment: 215
- template_comment: 185
- template_text: 137
- code_misc: 72
- style_comment: 57
- style_content: 6
- style_text: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

