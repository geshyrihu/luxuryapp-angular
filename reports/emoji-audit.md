# Emoji Audit

- Generated at: 2026-09-17T17:37:23.257Z
- Scope: `src/`
- Total matches: 1946
- User-facing matches: 419
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/modules: 1244
- app/shared: 247
- src/styles: 153
- app/routing: 136
- app/core: 119
- app/root: 38
- src/environments: 5
- src/root: 4

## Top User-Facing Modules

- app/modules: 313
- app/core: 62
- app/shared: 24
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 1059
- template_text: 216
- code_comment: 201
- code_string: 197
- template_comment: 178
- style_comment: 52
- code_misc: 25
- style_text: 9
- style_content: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

