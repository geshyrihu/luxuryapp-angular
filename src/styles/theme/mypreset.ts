import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Luxury Design System Preset para PrimeNG 22
 * Basado en la paleta ERP Premium · Deep Navy.
 */
export const LuxuryPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#E8EEF6',   // primary-container
            100: '#D1DEEF',
            200: '#A3BDDF',
            300: '#759DCE',
            400: '#487CBD',
            500: '#1B365D',  // primary base
            600: '#12243D',  // primary-dark
            700: '#0C182A',
            800: '#060C15',
            900: '#020305',
            950: '#000000'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',     // surface-card
                    50: '#F8F9FC',    // surface base
                    100: '#E8EEF6',   // surface-dim / primary-container
                    200: '#E2E8F0',   // outline
                    300: '#C5D0DB',   // outline-strong
                    400: '#9AACBB',   // (Legado) original tertiary, no usar para texto
                    500: '#708599',   // [WCAG AA Corrección] on-surface-tertiary
                    600: '#5A6878',   // on-surface-secondary
                    700: '#4A5664',
                    800: '#394350',
                    900: '#1A2634',   // on-surface
                    950: '#0C131A'
                }
            },
            dark: {
                surface: {
                    0: "var(--surface-dark-0)",   // on-surface · text (primary-100)
                    50: "var(--surface-dark-50)",  // primary-200
                    100: "var(--surface-dark-100)", // primary-300 · on-surface-variant
                    200: "var(--surface-dark-200)", // primary-400 · outline
                    300: "var(--surface-dark-300)", // primary-500 · outline-strong
                    400: "var(--surface-dark-400)", // neutral-300 · muted text
                    500: "var(--surface-dark-500)", // primary-600
                    600: "var(--surface-dark-600)", // primary-700
                    700: "var(--surface-dark-700)", // primary-900 · surface-container-low
                    800: "var(--surface-dark-800)", // primary-900 · content-hover
                    900: "var(--surface-dark-900)", // primary-950 · content / bg
                    950: "var(--surface-dark-950)"  // primary-950 · form-field
                }
            }
        }
    }
});
