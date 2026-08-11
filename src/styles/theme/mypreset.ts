import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Luxury Design System Preset para PrimeNG 22
 * Basado en la paleta ERP Premium · Deep Navy.
 *
 * Rampa primary monocroma H=204 anclada en #003152 (slot 700).
 * El ancla de marca se declara explícitamente en colorScheme.*.primary.color
 * para evitar que Aura use {primary.500} = azul claro como color de marca.
 * (Plan de Unificación de Color — Ancla única #003152, 2026-08-09)
 */
export const LuxuryPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: 'var(--primary-50)',
            100: 'var(--primary-100)',
            200: 'var(--primary-200)',
            300: 'var(--primary-300)',
            400: 'var(--primary-400)',
            500: 'var(--primary-500)',
            600: 'var(--primary-600)',
            700: 'var(--primary-700)',
            800: 'var(--primary-800)',
            900: 'var(--primary-900)',
            950: 'var(--primary-950)'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.700}', // #003152 · ancla de marca
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.800}',
                    activeColor: '{primary.900}'
                },
                surface: {
                    0: 'var(--ds-surface)', // #ffffff · surface-card
                    50: 'var(--secondary-50)',
                    100: 'var(--secondary-100)', // surface-dim / primary-container
                    200: 'var(--secondary-200)', // outline
                    300: 'var(--secondary-300)', // outline-strong
                    400: 'var(--secondary-400)', // on-surface-tertiary
                    500: 'var(--secondary-500)', // on-surface-tertiary
                    600: 'var(--secondary-600)', // on-surface-secondary
                    700: 'var(--secondary-700)',
                    800: 'var(--secondary-800)', // on-surface
                    900: 'var(--secondary-900)',
                    950: 'var(--secondary-950)'
                }
            },
            dark: {
                primary: {
                    color: '{primary.200}',
                    contrastColor: '{primary.900}',
                    hoverColor: '{primary.100}',
                    activeColor: '{primary.300}'
                },
                surface: {
                    0: "var(--surface-dark-0)",
                    50: "var(--surface-dark-50)",
                    100: "var(--surface-dark-100)",
                    200: "var(--surface-dark-200)",
                    300: "var(--surface-dark-300)",
                    400: "var(--surface-dark-400)",
                    500: "var(--surface-dark-500)",
                    600: "var(--surface-dark-600)",
                    700: "var(--surface-dark-700)",
                    800: "var(--surface-dark-800)",
                    900: "var(--surface-dark-900)",
                    950: "var(--surface-dark-950)"
                }
            }
        }
    }
});
