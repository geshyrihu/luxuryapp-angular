# Emoji Audit

- Generated at: 2026-09-25T02:15:45.912Z
- Scope: `src/`
- Total matches: 2005
- User-facing matches: 452
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/modules: 1274
- app/shared: 282
- src/styles: 148
- app/routing: 136
- app/core: 117
- app/root: 38
- src/environments: 5
- src/root: 5

## Top User-Facing Modules

- app/modules: 347
- app/core: 63
- app/shared: 20
- app/root: 16
- src/styles: 6

## Top Categories

- docs: 1101
- code_string: 229
- template_text: 217
- code_comment: 198
- template_comment: 173
- style_comment: 44
- code_misc: 25
- style_text: 9
- style_content: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

