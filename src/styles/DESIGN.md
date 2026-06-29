---
name: ERP Premium · Deep Navy
colors:
  # ─── PRIMARIO (Azul Profundo) ───
  primary: "#1B365D"
  on-primary: "#FFFFFF"
  primary-dark: "#12243D"
  primary-light: "#2A4D7C"
  primary-container: "#E8EEF6"
  on-primary-container: "#1B365D"

  # ─── SECUNDARIO (Acentos) ───
  secondary-gold: "#D4A74A"
  on-secondary-gold: "#1B365D"
  secondary-emerald: "#1E9B6D"
  on-secondary-emerald: "#FFFFFF"
  secondary-crimson: "#D34B4B"
  on-secondary-crimson: "#FFFFFF"
  secondary-cyan: "#4A90E2"
  on-secondary-cyan: "#FFFFFF"

  # ─── NEUTROS ───
  surface: "#F8F9FC"
  surface-card: "#FFFFFF"
  surface-dim: "#E8EEF6"
  on-surface: "#1A2634"
  on-surface-secondary: "#5A6878"
  on-surface-tertiary: "#9AACBB"
  outline: "#E2E8F0"
  outline-strong: "#C5D0DB"

  # ─── ESTADOS (Feedback) ───
  success: "#1E9B6D"
  success-container: "#E6F7F0"
  on-success-container: "#0D5E3F"

  error: "#D34B4B"
  error-container: "#FDE8E8"
  on-error-container: "#8A1F1F"

  warning: "#D4A74A"
  warning-container: "#FCF3E0"
  on-warning-container: "#7A5E15"

  info: "#4A90E2"
  info-container: "#E8EEF6"
  on-info-container: "#1B365D"

  # ─── SOMBRAS ───
  shadow: "rgba(27, 54, 93, 0.15)"

typography:
  font-family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"

  display-lg:
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: "-0.02em"

  display-md:
    fontSize: 40px
    fontWeight: "700"
    lineHeight: 48px
    letterSpacing: "-0.02em"

  headline-lg:
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: "-0.01em"

  headline-md:
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: "-0.01em"

  title-lg:
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px

  title-md:
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px

  body-lg:
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px

  body-md:
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px

  body-sm:
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 18px

  label-lg:
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
    letterSpacing: "0.02em"

  label-md:
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: "0.04em"

  label-sm:
    fontSize: 10px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: "0.06em"
    textTransform: "uppercase"

rounded:
  xs: 4px # 0.25rem — Botones, inputs
  sm: 6px # 0.375rem
  md: 8px # 0.5rem — Tarjetas, modales
  lg: 12px # 0.75rem
  xl: 16px # 1rem
  full: 9999px

spacing:
  unit: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 32px
  stack-2xl: 48px

elevation:
  level-0: "none"
  level-1: "0 1px 2px rgba(27,54,93,0.06)"
  level-2: "0 2px 8px rgba(27,54,93,0.08)"
  level-3: "0 4px 16px rgba(27,54,93,0.10)"
  level-4: "0 8px 32px rgba(27,54,93,0.12)"
---

## Brand & Style

**ERP Premium · Deep Navy** is a design system engineered for high-stakes corporate environments where clarity, authority, and efficiency are paramount. The brand personality is "Institutional Modernism"—combining the stability of traditional corporate identities with the fluid, data-driven interfaces of modern SaaS.

The aesthetic leans into **Minimalism** with a **Corporate Modern** execution. It prioritizes high-quality typography and strategic whitespace to reduce cognitive load for executive decision-makers. Visual interest is generated through precise geometry and a "Content-First" hierarchy, ensuring that data visualization and key performance indicators remain the focal point of every view.

### Brand Pillars

- **Trust** — Deep navy (`#1B365D`) conveys stability, security, and institutional authority.
- **Precision** — Every spacing, type size, and color is mathematically grounded in an 8px grid.
- **Clarity** — High contrast ratios (WCAG AA+ minimum) ensure legibility for all users.
- **Efficiency** — Designed for dense data interfaces where information density is balanced with readability.

---

## Colors

This design system utilizes a **single authoritative primary palette** anchored by `#1B365D` (Deep Navy), supported by a curated set of accent colors for interaction and feedback.

### Primary Palette (Deep Navy)

The primary color is used for navigation bars, primary buttons, headers, and key UI anchors. Its dark value provides excellent contrast against white and light surfaces.

| Token               | Hex       | Usage                                                     |
| :------------------ | :-------- | :-------------------------------------------------------- |
| `primary`           | `#1B365D` | Primary buttons, headers, tab bars, active states         |
| `primary-dark`      | `#12243D` | Pressed states, deep shadows, dark mode surfaces          |
| `primary-light`     | `#2A4D7C` | Hover states, active borders, progress indicators         |
| `primary-container` | `#E8EEF6` | Selected cell backgrounds, subtle badges, tinted surfaces |
| `on-primary`        | `#FFFFFF` | All text and icons on primary backgrounds                 |

**Contrast:** White text on `#1B365D` achieves a **9.5:1** contrast ratio (AAA).

---

### Secondary Palette (Accents)

Accent colors are used sparingly to draw attention to specific actions or statuses. They should never compete with the primary navy for dominance.

| Token               | Hex       | Usage                                                            |
| :------------------ | :-------- | :--------------------------------------------------------------- |
| `secondary-gold`    | `#D4A74A` | High-priority modules, VIP badges, premium features, key metrics |
| `secondary-emerald` | `#1E9B6D` | Success states, "Save" / "Confirm" actions, positive trends      |
| `secondary-crimson` | `#D34B4B` | Danger states, "Delete" / "Reject" actions, critical errors      |
| `secondary-cyan`    | `#4A90E2` | Informational links, help icons, non-critical notifications      |

**Gold on Navy:** The gold accent (`#D4A74A`) on `#1B365D` achieves a **6.8:1** contrast ratio and is the signature "premium" combination.

---

### Neutral Palette

Neutrals are subtly tinted with a cool blue undertone to maintain harmony with the primary navy.

| Token                  | Hex       | Usage                                                 |
| :--------------------- | :-------- | :---------------------------------------------------- |
| `surface`              | `#F8F9FC` | Main application background (white with 2% blue)      |
| `surface-card`         | `#FFFFFF` | Cards, modals, input fields, elevated surfaces        |
| `surface-dim`          | `#E8EEF6` | Disabled surfaces, subtle section backgrounds         |
| `on-surface`           | `#1A2634` | Primary text (headlines, body copy)                   |
| `on-surface-secondary` | `#5A6878` | Secondary text (subtitles, placeholders, dates)       |
| `on-surface-tertiary`  | `#9AACBB` | Tertiary text (disabled states, non-essential labels) |
| `outline`              | `#E2E8F0` | Dividers, input borders, card strokes                 |
| `outline-strong`       | `#C5D0DB` | Active input borders, focused states                  |

---

### Feedback States (Containers)

These container colors provide visual feedback without overwhelming the interface.

| Token | Hex | Usage |
| :
