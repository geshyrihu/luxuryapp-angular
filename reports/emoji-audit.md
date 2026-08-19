# Emoji Audit

- Generated at: 2026-08-18T13:03:27.068Z
- Scope: `src/`
- Total matches: 1924
- User-facing matches: 428
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/apps: 1220
- app/shared: 249
- src/styles: 150
- app/routing: 136
- app/core: 122
- app/root: 38
- src/environments: 5
- src/root: 4

## Top User-Facing Modules

- app/apps: 321
- app/core: 64
- app/shared: 23
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 1035
- code_string: 213
- template_text: 209
- code_comment: 198
- template_comment: 178
- style_comment: 52
- code_misc: 24
- style_content: 6
- style_text: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

