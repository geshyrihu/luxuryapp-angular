import { PRIME_TO_ICONIFY, resolveIconifyIcon, resolveToIconify } from './icon-mapping';

describe('icon-mapping', () => {
  describe('resolveToIconify', () => {
    it('traduce un nombre heredado a su equivalente de Material Symbols', () => {
      expect(resolveToIconify('trash')).toBe('material-symbols-light:delete');
    });

    it('acepta el prefijo heredado que aún puede venir en datos guardados', () => {
      expect(resolveToIconify('pi pi-trash')).toBe('material-symbols-light:delete');
      expect(resolveToIconify('pi-trash')).toBe('material-symbols-light:delete');
    });

    it('devuelve el valor por defecto cuando no hay nombre', () => {
      expect(resolveToIconify('')).toBe('material-symbols-light:settings');
      expect(resolveToIconify(null)).toBe('material-symbols-light:settings');
    });
  });

  describe('resolveIconifyIcon', () => {
    it('deja pasar un identificador de Iconify sin tocarlo', () => {
      expect(resolveIconifyIcon('material-symbols-light:home')).toBe(
        'material-symbols-light:home',
      );
    });

    it('traduce los emoji que quedaron en datos antiguos', () => {
      expect(resolveIconifyIcon('✅')).toBe('material-symbols-light:check');
      expect(resolveIconifyIcon('🔍')).toBe('material-symbols-light:search');
    });

    it('conserva un emoji sin regla para que se pinte como carácter', () => {
      expect(resolveIconifyIcon('🦄')).toBe('🦄');
    });
  });

  describe('PRIME_TO_ICONIFY', () => {
    // Este proyecto usa un único paquete de iconos. Una entrada que apunte a
    // otro prefijo no se dibuja: `<iconify-icon>` no avisa, solo deja el hueco.
    it('todos sus valores apuntan a material-symbols-light', () => {
      const ajenos = Object.entries(PRIME_TO_ICONIFY).filter(
        ([, valor]) => !valor.startsWith('material-symbols-light:'),
      );
      expect(ajenos).toEqual([]);
    });

    it('ninguna clave conserva el prefijo de PrimeIcons', () => {
      const conPrefijo = Object.keys(PRIME_TO_ICONIFY).filter((k) => k.startsWith('pi'));
      expect(conPrefijo).toEqual([]);
    });
  });
});
