import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LxAccordion } from "@ui/adaptive/accordion/accordion";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AccordionItem } from "src/app/shared/ui/base/accordion.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface RouteEntry {
  path: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: string;
  body?: string;
  response?: string;
}

interface FrontendRoute {
  path: string;
  component: string;
  description: string;
}

@Component({
  selector: "app-report-guide",
  imports: [RouterModule, LxAccordion, WebButtonLabel, AppIcon, LxTag],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./report-guide.html",
})
export class ReportGuide {
  activeSection = signal<string>("intro");

  technicalAccordion: AccordionItem[] = [
    {
      id: "technical",
      title: "Detalles Técnicos y Tipos de Datos (Solo Expertos)",
      icon: "material-symbols-light:settings",
    },
  ];

  frontendRoutes: FrontendRoute[] = [
    {
      path: "/contabilidad/reportes",
      component: "ReportCatalog",
      description:
        'Catálogo de reportes del cliente. Lista "Mis Reportes" y "Plantillas". Permite crear, editar, ver y eliminar reportes.',
    },
    {
      path: "/contabilidad/reportes/nuevo",
      component: "ReportBuilder",
      description:
        "Constructor de nuevo reporte. Permite definir metadatos, columnas (periodos), secciones y renglones con drag & drop.",
    },
    {
      path: "/contabilidad/reportes/editar/:id",
      component: "ReportBuilder",
      description:
        "Edición de reporte existente. Carga la definición del reporte por ID y permite modificarla.",
    },
    {
      path: "/contabilidad/reportes/ver/:id",
      component: "ReportViewer",
      description:
        "Ejecución y visualización del reporte. Permite filtrar por año/mes, exportar a Excel o PDF, compartir enlace y consultar el Auditor IA.",
    },
    {
      path: "/contabilidad/reportes/guia",
      component: "ReportGuide",
      description: "Esta Guía práctica del módulo.",
    },
  ];

  apiRoutes: RouteEntry[] = [
    {
      method: "GET",
      path: "/api/dynamic-reports/customer/{customerId}",
      description:
        "Lista todos los reportes activos de un cliente (no plantillas).",
      params: "customerId: Guid del cliente",
      response: "ReportDefinitionListDTO[]",
    },
    {
      method: "GET",
      path: "/api/dynamic-reports/templates",
      description: "Lista todas las plantillas globales (IsTemplate = true).",
      response: "ReportDefinitionListDTO[]",
    },
    {
      method: "GET",
      path: "/api/dynamic-reports/{id}",
      description: "Obtiene la definición completa de un reporte por ID.",
      params: "id: Guid del reporte",
      response:
        "ReportDefinitionDTO (incluye Body con sections/columns y changeHistory)",
    },
    {
      method: "POST",
      path: "/api/dynamic-reports",
      description: "Crea un nuevo reporte.",
      body: "ReportDefinitionDTO",
      response: "ReportDefinitionDTO creado",
    },
    {
      method: "PUT",
      path: "/api/dynamic-reports/{id}",
      description:
        "Actualiza un reporte existente. Agrega automíticamente una entrada al historial de cambios.",
      params: "id: Guid del reporte",
      body: "ReportDefinitionDTO",
      response: "ReportDefinitionDTO actualizado con changeHistory",
    },
    {
      method: "DELETE",
      path: "/api/dynamic-reports/{id}",
      description: "Soft-delete de un reporte (IsActive = false).",
      params: "id: Guid del reporte",
      response: "bool",
    },
    {
      method: "POST",
      path: "/api/dynamic-reports/execute",
      description:
        "Ejecuta un reporte y retorna los datos calculados. Cruza con datos de Aspel.",
      body: "{ reportId, customerId, year, month? }",
      response: "ReportResultDTO (sections con rows y values por columna)",
    },
    {
      method: "POST",
      path: "/api/dynamic-reports/execute/excel",
      description: "Ejecuta el reporte y retorna un archivo .xlsx (EPPlus 8).",
      body: "{ reportId, customerId, year, month? }",
      response:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    {
      method: "POST",
      path: "/api/dynamic-reports/execute/pdf",
      description:
        "Ejecuta el reporte y retorna un archivo .pdf (QuestPDF, apaisado carta).",
      body: "{ reportId, customerId, year, month? }",
      response: "application/pdf",
    },
    {
      method: "GET",
      path: "/api/dynamic-reports/accounts/{customerId}/{year}",
      description:
        "Catálogo de cuentas contables del cliente para el año indicado. Usado por el autocomplete en el Builder.",
      params: "customerId: Guid, year: int",
      response: "AccountCatalogItemDTO[] { code, name, level }",
    },
  ];

  tiposRenglon = [
    {
      tipo: "account",
      descripcion:
        "Cuenta contable. Suma los montos de las cuentas que coincidan con el filtro (accountNumbers, rangeFrom-rangeTo, level, excludeAccounts). El campo sign (1 o -1) invierte el signo del resultado.",
      ejemplo: "Ingresos por cuotas: cuenta 401.*",
    },
    {
      tipo: "subtotal",
      descripcion:
        "Suma los renglones referenciados en sourceRowIds dentro de la misma sección. Puede usarse bold + indent para estilo.",
      ejemplo: "Total Ingresos = suma de account rows de ingresos",
    },
    {
      tipo: "grandTotal",
      descripcion:
        "Suma de míltiples renglones (sourceRowIds) que pueden estar en distintas secciones. Aparece en las tarjetas KPI (summary-cards).",
      ejemplo: "Resultado Neto = Total Ingresos - Total Gastos",
    },
    {
      tipo: "formula",
      descripcion:
        "Expresión aritmítica libre usando [rowId] como variable. Evaluada con DataTable.Compute(). Permite cólculos de razones financieras.",
      ejemplo: "Margen% = [row-ingresos] / [row-egresos] * 100",
    },
    {
      tipo: "header",
      descripcion:
        "Encabezado visual (sin valor). ótil para separar grupos de renglones con un tútulo.",
      ejemplo: "-- INGRESOS OPERATIVOS --",
    },
    {
      tipo: "spacer",
      descripcion: "Fila vacóa para separación visual.",
      ejemplo: "",
    },
  ];

  tiposPeriodo = [
    {
      tipo: "month",
      campo: "month (1-12)",
      descripcion: "Valor del mes exacto indicado. Ejemplo: mes=3 ? Marzo.",
    },
    {
      tipo: "accumulated",
      campo: "month (1-12)",
      descripcion: "Suma acumulada de Enero hasta el mes indicado.",
    },
    {
      tipo: "quarterly",
      campo: "month (1-4 = Q1-Q4)",
      descripcion:
        "Suma de los 3 meses del trimestre. Q1=Ene-Mar, Q2=Abr-Jun, Q3=Jul-Sep, Q4=Oct-Dic.",
    },
    {
      tipo: "annual",
      campo: "(ignorado)",
      descripcion:
        "Suma de los 12 meses del año. Para presupuesto suma los 12 montos de presupuesto.",
    },
  ];

  tiposVisualizacion = [
    {
      tipo: "table-simple",
      descripcion:
        "Tabla esténdar. Una fila por renglon, una columna por periodo. Formato numírico con indentación segón indent.",
    },
    {
      tipo: "table-twoColumn",
      descripcion:
        "Vista de dos columnas paralelas. Las secciones se dividen en dos bloques lado a lado.",
    },
    {
      tipo: "table-comparative",
      descripcion:
        "Vista comparativa. Similar a simple pero con estilos diferenciados para resaltar comparaciones.",
    },
    {
      tipo: "table-budgetVsActual",
      descripcion:
        "Tabla de 5 columnas: Real | Presupuesto | Variación | % Variación. Colorea en verde/rojo la variación.",
    },
    {
      tipo: "summary-cards",
      descripcion:
        "Tarjetas KPI. Muestra los renglones grandTotal y subtotal-bold como cards con valor principal.",
    },
  ];

  ejemploJson = `{
  "sections": [
    {
      "id": "sec-1",
      "title": "Ingresos",
      "position": 1,
      "rows": [
        {
          "id": "row-1",
          "type": "account",
          "label": "Cuotas de Mantenimiento",
          "accountFilter": {
            "accountNumbers": ["401001", "401002"],
            "excludeAccounts": []
          },
          "sign": 1,
          "indent": 1,
          "bold": false,
          "showZero": false,
          "sourceRowIds": [],
          "position": 1
        },
        {
          "id": "row-subtotal-1",
          "type": "subtotal",
          "label": "Total Ingresos",
          "sourceRowIds": ["row-1"],
          "sign": 1,
          "indent": 0,
          "bold": true,
          "showZero": true,
          "position": 2
        }
      ]
    }
  ],
  "columns": [
    {
      "id": "col-real",
      "label": "Real Marzo 2025",
      "periodType": "month",
      "dataSource": "contabilidad",
      "year": 2025,
      "month": 3
    },
    {
      "id": "col-ppto",
      "label": "Presupuesto Marzo 2025",
      "periodType": "month",
      "dataSource": "budget",
      "year": 2025,
      "month": 3
    }
  ]
}`;
}
