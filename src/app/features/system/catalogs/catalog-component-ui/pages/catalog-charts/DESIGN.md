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

The design system is engineered for corporate reliability and operational efficiency. It targets a professional workforce, prioritizing clarity, security, and a "zero-friction" user experience.

The aesthetic follows a **Modern Corporate** approach with a focus on **High-Contrast** accessibility. It utilizes a structured hierarchy, ample white space, and a refined professional finish to evoke feelings of institutional trust and systemic precision.

## Colors

The palette is anchored by the "Azul Institucional" deep navy scale. 

- **Primary (#00050E):** Nearly black — used for primary text, icons, and top-level actions demanding maximum contrast.
- **Primary Container (#0B1F33):** Dark navy for navigation backgrounds, headings, and selected states.
- **Secondary (#446083):** Muted blue for secondary actions and active states.
- **Tertiary (#00040A):** Near-black for deep structural elements.
- **Surface (#FBF9FB):** Warm off-white background reducing eye strain.
- **Surface Container Lowest (#FFFFFF):** Crisp white for cards and elevated surfaces.

## Typography

The typography system uses **Inter** exclusively for a systematic, utilitarian, and highly legible character.

## Layout & Spacing

This design system employs an 8px base grid for consistent alignment and rhythmic vertical stacking.

- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Tablet:** 8-column grid, fluid width, 16px gutters.
- **Mobile:** 4-column grid, fluid width, 16px margins.

## Elevation & Depth

Depth is communicated primarily through **Tonal Layers** rather than heavy shadows.

- **Level 0 (Base):** Surface container (#EFEDEF).
- **Level 1 (Cards/Containers):** Surface container lowest (#FFFFFF) with a soft neutral shadow.
- **Level 2 (Dropdowns/Modals):** Surface container lowest (#FFFFFF) with a stronger shadow and a 1px border using Outline variant (#C4C6CD).
- Avoid background blurs or aggressive gradients to maintain the professional tone.

## Shapes

The shape language is **Rounded (8px)** globally. 

- **Standard Elements:** Buttons and input fields use 8px (0.5rem) radius.
- **Large Elements:** Cards and modals use 16px (1rem) radius.
- **Small Elements:** Chips and tags use 4px (0.25rem) radius.

## Components

### Buttons
- **Primary:** Solid #00050E background with white text.
- **Secondary:** Transparent with #00050E 1px border and text.
- **High-priority:** Gold accent (#C9A74D) for approvals and critical actions.

### Cards & Lists
- Surface container lowest (#FFFFFF) background, 16px padding, 8px border radius.

### Input Fields
- **States:** Surface container lowest (#FFFFFF) background with 1px Outline border. Focus uses 2px Surface tint (#4E6077).
- **Validation:** Use Danger (#BA1A1A) for errors and Success (#006837) for verified states.

### Status Indicators
- Use small, solid circular pips. Success (Green), Warning (Gold), and Error (Deep Red) slightly desaturated to match the institutional palette.