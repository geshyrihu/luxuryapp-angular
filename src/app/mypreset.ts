import { definePreset } from "@primeng/themes";
import Lara from "@primeng/themes/lara";
export const PrimeNgSpanishLocale = {
  startsWith: "Comienza con",
  contains: "Contiene",
  notContains: "No contiene",
  endsWith: "Termina con",
  equals: "Igual a",
  notEquals: "No igual a",
  noFilter: "Sin filtro",
  lt: "Menor que",
  lte: "Menor o igual que",
  gt: "Mayor que",
  gte: "Mayor o igual que",
  is: "Es",
  isNot: "No es",
  before: "Antes",
  after: "Después",
  dateIs: "Fecha es",
  dateIsNot: "Fecha no es",
  dateBefore: "Fecha antes de",
  dateAfter: "Fecha después de",
  clear: "Limpiar",
  apply: "Aplicar",
  matchAll: "Coincidir todo",
  matchAny: "Coincidir cualquiera",
  addRule: "Agregar regla",
  removeRule: "Eliminar regla",
  accept: "Sí",
  reject: "No",
  choose: "Elegir",
  upload: "Subir",
  cancel: "Cancelar",
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  today: "Hoy",
  weekHeader: "Sem",
  firstDayOfWeek: 1,
  dateFormat: "dd/mm/yy",
  weak: "Débil",
  medium: "Medio",
  strong: "Fuerte",
  passwordPrompt: "Ingrese una contraseña",
  emptyMessage: "No se encontraron resultados",
  emptyFilterMessage: "No se encontraron resultados",
  pending: "Pendiente",
  true: "Verdadero",
  false: "Falso",
  chooseFile: "Elegir archivo",
  chooseFiles: "Elegir archivos",
  prevYear: "Año anterior",
  nextYear: "Año siguiente",
  prevMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  selectionMessage: "{0} elementos seleccionados",
  totalRecordsMessage: "{0} elementos en total",
};
// const MyPreset = definePreset(Aura, {
const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: "var(--primary-50)",
      100: "var(--primary-100)",
      200: "var(--primary-200)",
      300: "var(--primary-300)",
      400: "var(--primary-400)",
      500: "var(--primary-500)",
      600: "var(--primary-600)",
      700: "var(--primary-700)",
      800: "var(--primary-800)",
      900: "var(--primary-900)",
      950: "var(--primary-950)",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.500}",
          contrastColor: "var(--ds-primary-text)",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.100}",
          color: "{primary.700}",
          focusColor: "{primary.800}",
        },
        surface: {
          0: "var(--secondary-50)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          950: "var(--secondary-950)",
        },
      },
      dark: {
        primary: {
          color: "{primary.400}",
          contrastColor: "var(--ds-primary-text)",
          hoverColor: "{primary.300}",
          activeColor: "{primary.200}",
        },
        highlight: {
          background: "color-mix(in srgb, {primary.400}, transparent 84%)",
          focusBackground: "color-mix(in srgb, {primary.400}, transparent 76%)",
          color: "rgba(255,255,255,.87)",
          focusColor: "rgba(255,255,255,.87)",
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
          950: "var(--surface-dark-950)",
        },
      },
    },
  },
  components: {
    tag: {
      colorScheme: {
        light: {
          success: {
            background: "var(--success-bg)",
            color: "var(--success-color)",
          },
          info: {
            background: "var(--ds-info-light)",
            color: "var(--ds-info)",
          },
          warn: {
            background: "var(--warning-bg)",
            color: "var(--warning-color)",
          },
          danger: {
            background: "var(--danger-bg)",
            color: "var(--danger-color)",
          },
        },
        dark: {
          success: {
            background: "color-mix(in srgb, var(--success-500), transparent 88%)",
            color: "var(--success-400)",
          },
          info: {
            background: "color-mix(in srgb, var(--info-500), transparent 88%)",
            color: "var(--info-400)",
          },
          warn: {
            background: "color-mix(in srgb, var(--warning-500), transparent 88%)",
            color: "var(--warning-400)",
          },
          danger: {
            background: "color-mix(in srgb, var(--danger-500), transparent 88%)",
            color: "var(--danger-400)",
          },
        },
      },
    },
    datatable: {
      header: {
        background: "{primary.500}",
        color: "var(--ds-primary-text)",
        borderColor: "{primary.500}",
      },
      row: {
        /*
        hover: {
          background: "{primary.50}",
          color: "{primary.900}",
        },
        */
      },
    },
    message: {
      colorScheme: {
        light: {
          success: {
            background: "var(--success-bg)",
            borderColor: "var(--success-color)", // Simplificado para usar el color principal
            color: "var(--success-color)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--success-500), transparent 80%)",
            },
          },
          warn: {
            background: "var(--warning-bg)",
            borderColor: "var(--warning-color)",
            color: "var(--warning-color)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--warning-500), transparent 80%)",
            },
          },
          error: {
            background: "var(--danger-bg)",
            borderColor: "var(--danger-color)",
            color: "var(--danger-color)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--danger-500), transparent 80%)",
            },
          },
        },
        dark: {
          success: {
            background: "color-mix(in srgb, var(--success-500), transparent 88%)",
            borderColor: "color-mix(in srgb, var(--success-500), transparent 65%)",
            color: "var(--success-400)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--success-500), transparent 80%)",
            },
          },
          warn: {
            background: "color-mix(in srgb, var(--warning-500), transparent 88%)",
            borderColor: "color-mix(in srgb, var(--warning-500), transparent 65%)",
            color: "var(--warning-400)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--warning-500), transparent 80%)",
            },
          },
          error: {
            background: "color-mix(in srgb, var(--danger-500), transparent 88%)",
            borderColor: "color-mix(in srgb, var(--danger-500), transparent 65%)",
            color: "var(--danger-400)",
            closeButton: {
              hoverBackground: "color-mix(in srgb, var(--danger-500), transparent 80%)",
            },
          },
        },
      },
    },
  },
});

export default MyPreset;
