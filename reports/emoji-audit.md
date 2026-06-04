# Emoji Audit

- Generated at: 2026-06-03T14:51:00.906Z
- Scope: `src/`
- Total matches: 1236
- User-facing matches: 417
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/core: 306
- features/root: 147
- src/styles: 114
- app/root: 107
- features/contabilidad: 89
- features/configuration: 70
- features/recursos-humanos: 53
- features/biblioteca: 35
- features/entrega-recepcion-check: 31
- features/calendar: 23
- features/funding: 18
- app/layout: 16

## Top User-Facing Modules

- app/core: 99
- app/root: 83
- features/recursos-humanos: 46
- features/contabilidad: 37
- features/funding: 18
- app/login: 14
- features/funding-accounting: 14
- features/dashboard: 13
- features/supervision: 13
- features/recepcion-pipas-agua: 12
- features/calendar: 9
- features/service-order: 8

## Top Categories

- docs: 327
- code_string: 237
- code_comment: 225
- template_comment: 176
- template_text: 174
- style_comment: 51
- code_misc: 29
- style_text: 10
- style_content: 6
- config: 1

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

