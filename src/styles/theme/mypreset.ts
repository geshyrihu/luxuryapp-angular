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
                    0: '#E8EEF6',     // on-surface · text (primary-100)
                    50: '#D1DEF0',    // primary-200
                    100: '#A6C2E3',   // primary-300 · on-surface-variant
                    200: '#78A4D4',   // primary-400 · outline
                    300: '#4A90E2',   // primary-500 · outline-strong
                    400: '#C5D0DB',   // neutral-300 · muted text
                    500: '#2A4D7C',   // primary-600
                    600: '#1B365D',   // primary-700
                    700: '#0A1422',   // primary-900 · surface-container-low
                    800: '#0A1422',   // primary-900 · content-hover
                    900: '#050A11',   // primary-950 · surface-container-lowest / content
                    950: '#050A11'    // primary-950 · form-field
                }
            }
        }
    }
});
