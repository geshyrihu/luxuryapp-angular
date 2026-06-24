# Emoji Audit

- Generated at: 2026-06-24T17:48:31.258Z
- Scope: `src/`
- Total matches: 1562
- User-facing matches: 419
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- features/system: 698
- app/core: 224
- features/operations: 165
- features/accounting: 127
- app/root: 106
- features/hr: 76
- src/styles: 64
- features/maintenance: 31
- features/legal: 22
- features/purchasing: 20
- app/layout: 16
- features/recruitment: 7

## Top User-Facing Modules

- features/accounting: 100
- app/root: 83
- app/core: 78
- features/operations: 68
- features/hr: 45
- features/maintenance: 12
- features/system: 10
- features/recruitment: 6
- src/styles: 6
- app/layout: 4
- features/purchasing: 4
- features/legal: 2

## Top Categories

- docs: 670
- template_text: 209
- template_comment: 208
- code_string: 204
- code_comment: 172
- style_comment: 51
- code_misc: 28
- style_text: 13
- style_content: 6
- config: 1

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

