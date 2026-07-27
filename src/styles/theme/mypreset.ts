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
                    0: '#121212',     // surface-card
                    50: '#0A0A0A',    // surface base
                    100: '#1A1A1A',   // surface-dim
                    200: '#2A2A2A',   // outline
                    300: '#3D3D3D',   // outline-strong
                    400: '#545454',
                    500: '#708599',   // [WCAG AA Corrección] on-surface-tertiary
                    600: '#A1B1C2',   // on-surface-secondary
                    700: '#C3CED9',
                    800: '#E2E8F0',
                    900: '#FFFFFF',   // on-surface (high contrast)
                    950: '#F8F9FC'
                }
            }
        }
    }
});
