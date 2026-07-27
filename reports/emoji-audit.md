# Emoji Audit

- Generated at: 2026-07-26T16:14:05.231Z
- Scope: `src/`
- Total matches: 1250
- User-facing matches: 323
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/apps: 574
- app/shared: 225
- src/styles: 156
- app/routing: 136
- app/core: 116
- app/root: 38
- src/root: 4
- src/environments: 1

## Top User-Facing Modules

- app/apps: 223
- app/core: 60
- app/shared: 20
- app/root: 14
- src/styles: 6

## Top Categories

- docs: 484
- code_string: 196
- template_comment: 185
- code_comment: 177
- template_text: 121
- style_comment: 57
- code_misc: 17
- style_content: 6
- style_text: 6
- config: 1

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

