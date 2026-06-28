---
name: Azul Institucional
colors:
  surface: '#fbf9fb'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#efedef'
  surface-container-high: '#e9e7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4e6077'
  primary: '#00050e'
  on-primary: '#ffffff'
  primary-container: '#0b1f33'
  on-primary-container: '#7587a0'
  inverse-primary: '#b5c8e3'
  secondary: '#446083'
  on-secondary: '#ffffff'
  secondary-container: '#bad7ff'
  on-secondary-container: '#415d80'
  tertiary: '#00040a'
  on-tertiary: '#ffffff'
  tertiary-container: '#002033'
  on-tertiary-container: '#578bb2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b5c8e3'
  on-primary-fixed: '#081d30'
  on-primary-fixed-variant: '#36485e'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#acc9f1'
  on-secondary-fixed: '#001c37'
  on-secondary-fixed-variant: '#2b486a'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#99ccf6'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#074b6f'
  background: '#fbf9fb'
  on-background: '#1b1c1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style
The brand personality is rooted in institutional stability, executive precision, and unwavering reliability. This design system is crafted for high-stakes environments—finance, legal, or corporate governance—where clarity and authority are paramount. 

The aesthetic follows a **Modern Corporate** direction. It avoids unnecessary flourishes in favor of a structured, high-contrast interface that prioritizes information density and legible hierarchy. The visual language evokes a sense of "quiet luxury" through a deep monochromatic blue palette punctuated by a singular, prestigious gold accent. The emotional response should be one of confidence, security, and professional excellence.

## Colors
The color strategy utilizes a "Deep Sea" monochromatic scale to establish a serious and stable foundation. 

*   **Primary (#00050E):** The darkest anchor — used for primary text, icons on light surfaces, and top-level actions. It provides maximum contrast.
*   **Primary Container (#0B1F33):** Used for navigation backgrounds, primary headings, and selected states. Represents the "anchor" of the visual identity.
*   **Secondary (#446083):** Muted blue for secondary UI elements, active states in sidebars, and icon containers.
*   **Tertiary (#00040A):** Near-black tertiary reserved for the deepest structural elements.
*   **Accent Gold (#C9A74D):** Reserved exclusively for high-priority calls to action, success states, or prestigious highlights. Use sparingly to maintain its impact.
*   **Surface System:** The surface and surface-variant colors provide a soft, cool-toned environment for content, reducing eye strain compared to pure white while maintaining a crisp, clean appearance.

## Typography
This design system utilizes **Inter** exclusively to leverage its systematic, utilitarian, and highly legible characteristics. 

The type scale is designed for clarity in data-dense environments. **Headlines** use tighter letter-spacing and heavier weights to project authority. **Body text** utilizes a generous line height to ensure readability in long-form reports or legal documents. **Labels** are occasionally set in uppercase with increased letter-spacing to differentiate them from body content in complex forms or metadata tags.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain an executive, organized feel, transitioning to a fluid model for mobile.

*   **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
*   **Tablet:** 8-column grid, fluid width, 16px gutters.
*   **Mobile:** 4-column grid, fluid width, 16px margins.

We use an 8px base unit for all spacing. Consistent padding should be applied to containers to maintain a rhythmic, structured appearance that feels engineered and deliberate.

## Elevation & Depth
Depth is communicated primarily through **Tonal Layers** rather than heavy shadows, keeping the UI flat and professional.

1.  **Level 0 (Base):** Surface container (#EFEDEF).
2.  **Level 1 (Cards/Containers):** Surface container lowest (#FFFFFF) with a soft neutral shadow to lift it slightly from the background.
3.  **Level 2 (Dropdowns/Modals):** Surface container lowest (#FFFFFF) with a stronger shadow and a 1px border using Outline variant (#C4C6CD) for definition.

Avoid background blurs or aggressive gradients to maintain the "Serious" and "Stable" personality.

## Shapes
A **Rounded (8px)** corner strategy is applied globally. This "Medium" roundness strikes a balance between the clinical coldness of sharp corners and the overly casual nature of pill shapes. 

*   **Standard Elements (Buttons, Inputs):** 8px (0.5rem)
*   **Large Elements (Cards, Modals):** 16px (1rem)
*   **Small Elements (Chips, Tags):** 4px (0.25rem)

## Components

*   **Buttons:** Primary buttons use the Primary color (#00050E) with white text. High-priority actions use the Gold Accent (#C9A74D). Secondary buttons use a 1px Primary border with no fill.
*   **Input Fields:** Use surface container lowest (#FFFFFF) background with a 1px Outline border. On focus, the border thickens to 2px using Surface tint (#4E6077).
*   **Cards:** Surface container lowest (#FFFFFF) background, 16px padding, and 8px border radius. Use subtle Primary-colored icons for category headers.
*   **Chips:** Semi-transparent versions of the Secondary color for a sophisticated, subdued look.
*   **Data Tables:** A core component for this system. Use Surface container (#EFEDEF) for header backgrounds and 1px horizontal dividers using Outline variant (#C4C6CD). No vertical dividers to keep the look modern.
*   **Status Indicators:** Use small, solid circular pips. Success (Green), Warning (Gold), and Error (Deep Red) should be slightly desaturated to match the institutional palette.