# Emoji Audit

- Generated at: 2026-06-17T15:28:52.573Z
- Scope: `src/`
- Total matches: 1345
- User-facing matches: 419
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/core: 283
- features/operations: 214
- features/accounting: 191
- features/root: 147
- src/styles: 115
- app/root: 106
- features/system: 97
- features/hr: 76
- features/maintenance: 31
- features/legal: 22
- features/purchasing: 22
- app/layout: 16

## Top User-Facing Modules

- features/accounting: 104
- app/root: 83
- app/core: 80
- features/operations: 68
- features/hr: 45
- features/maintenance: 12
- features/recruitment: 6
- src/styles: 6
- app/layout: 4
- features/purchasing: 4
- features/system: 4
- features/legal: 2

## Top Categories

- docs: 388
- template_comment: 224
- code_comment: 215
- template_text: 209
- code_string: 204
- style_comment: 55
- code_misc: 33
- style_text: 10
- style_content: 6
- config: 1

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

