# Emoji Audit

- Generated at: 2026-08-09T20:15:40.606Z
- Scope: `src/`
- Total matches: 1287
- User-facing matches: 333
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/apps: 591
- app/shared: 244
- src/styles: 149
- app/routing: 136
- app/core: 120
- app/root: 38
- src/environments: 5
- src/root: 4

## Top User-Facing Modules

- app/apps: 230
- app/core: 63
- app/shared: 20
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 495
- code_string: 209
- code_comment: 195
- template_comment: 182
- template_text: 118
- style_comment: 51
- code_misc: 22
- style_content: 6
- style_text: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

