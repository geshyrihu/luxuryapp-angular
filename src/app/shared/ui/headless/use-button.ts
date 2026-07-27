import { signal, computed, Signal } from '@angular/core';

/**
 * Interface de configuración para el hook useButton
 */
export interface UseButtonOptions {
  initialState?: 'idle' | 'loading' | 'success' | 'error';
  disabled?: boolean;
}

/**
 * Hook arquitectónico headless para botones
 * Demuestra el uso de Signals en Angular 22 para separar lógica visual del componente
 */
export function useButton(options?: UseButtonOptions) {
  const state = signal<'idle' | 'loading' | 'success' | 'error'>(options?.initialState ?? 'idle');
  const baseDisabled = signal<boolean>(options?.disabled ?? false);

  // Computed signal que determina si el botón está efectivamente deshabilitado
  const isDisabled = computed(() => {
    return baseDisabled() || state() === 'loading';
  });

  // Clases CSS computadas base (Tailwind/Tokens)
  const baseClasses = computed(() => {
    return 'px-4 py-2 font-medium rounded-md transition-colors duration-fast ease-standard';
  });

  // Métodos expuestos
  return {
    state: state.asReadonly(),
    isDisabled,
    baseClasses,
    
    // Acciones mutadoras
    setLoading: () => state.set('loading'),
    setSuccess: () => state.set('success'),
    setError: () => state.set('error'),
    setIdle: () => state.set('idle'),
    setDisabled: (disabled: boolean) => baseDisabled.set(disabled)
  };
}
