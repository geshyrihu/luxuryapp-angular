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
          contrastColor: "#ffffff",
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
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      dark: {
        primary: {
          color: "{primary.400}",
          contrastColor: "#ffffff",
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
          0: "#09090b",
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
          950: "#ffffff",
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
            background: "rgba(34, 197, 94, 0.12)",
            color: "#4ade80",
          },
          warn: {
            background: "rgba(245, 158, 11, 0.12)",
            color: "#fbbf24",
          },
          danger: {
            background: "rgba(239, 68, 68, 0.12)",
            color: "#f87171",
          },
        },
      },
    },
    datatable: {
      header: {
        background: "{primary.500}",
        color: "#ffffff",
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
              hoverBackground: "#a7f3d0", // Este lo dejamos hardcoded o creamos var si lo usas mucho
            },
          },
          warn: {
            background: "var(--warning-bg)",
            borderColor: "var(--warning-color)",
            color: "var(--warning-color)",
            closeButton: {
              hoverBackground: "#fde68a",
            },
          },
          error: {
            background: "var(--danger-bg)",
            borderColor: "var(--danger-color)",
            color: "var(--danger-color)",
            closeButton: {
              hoverBackground: "#fecaca",
            },
          },
        },
        dark: {
          success: {
            background: "rgba(34, 197, 94, 0.12)",
            borderColor: "rgba(34, 197, 94, 0.35)",
            color: "#4ade80",
            closeButton: {
              hoverBackground: "rgba(34, 197, 94, 0.2)",
            },
          },
          warn: {
            background: "rgba(245, 158, 11, 0.12)",
            borderColor: "rgba(245, 158, 11, 0.35)",
            color: "#fbbf24",
            closeButton: {
              hoverBackground: "rgba(245, 158, 11, 0.2)",
            },
          },
          error: {
            background: "rgba(239, 68, 68, 0.12)",
            borderColor: "rgba(239, 68, 68, 0.35)",
            color: "#f87171",
            closeButton: {
              hoverBackground: "rgba(239, 68, 68, 0.2)",
            },
          },
        },
      },
    },
  },
});

export default MyPreset;
