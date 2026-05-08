import { Routes } from "@angular/router";
import { authGuard } from "src/app/core/guard/auth.guard";
export const comprasRoutes: Routes = [
  {
    // Suggested path: 'budget'
    path: "presupuesto",
    loadComponent: () =>
      import("src/app/features/contabilidad/presupuesto-web-aspel/wrapper").then(
        (m) => m.PresupuestoWebAspelWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto",
      breadcrumb: "Presupuesto",
    },
  },
  {
    path: "presupuesto/:id",
    loadComponent: () =>
      import("src/app/features/contabilidad/edicion-presupuesto/presupuesto-individual").then(
        (m) => m.PresupuestoIndividual,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto Individual",
      breadcrumb: "Presupuesto Individual",
    },
  },
  {
    path: "products-services",
    loadComponent: () =>
      import("src/app/features/product/productos-list").then(
        (m) => m.ProductosList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Productos y Servicios",
      breadcrumb: "Lista de Productos y Servicios",
    },
  },
  {
    path: "purchase-requests", // Ruta anterior: 'solicitudes-compra'
    loadComponent: () =>
      import("src/app/features/purchases/solicitud-compra/solicitud-compra-list").then(
        (m) => m.SolicitudCompraList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes de Compra",
      breadcrumb: "Solicitudes de Compra",
    },
  },
  {
    // Suggested path: 'purchase-request/:id'
    path: "solicitud-compra/:id",
    loadComponent: () =>
      import("src/app/features/purchases/solicitud-compra/solicitud-compra").then(
        (m) => m.SolicitudCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitud de Compra",
      breadcrumb: "Solicitud de Compra",
    },
  },
  {
    // Suggested path: 'purchase-request-pdf/:id'
    path: "pdf-solicitud-compra/:id",
    loadComponent: () =>
      import("src/app/features/purchases/solicitud-compra/pdf-solicitud-compra").then(
        (m) => m.PdfSolicitudCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Solicitud de Compra",
      breadcrumb: "PDF Solicitud de Compra",
    },
  },
  {
    // Suggested path: 'comparison-chart/:id'
    path: "cuadro-comparativo/:id",
    loadComponent: () =>
      import("src/app/features/provider-quotation/cuadro-comparativo-list").then(
        (m) => m.CuadroComparativoList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cuadro Comparativo",
      breadcrumb: "Cuadro Comparativo",
    },
  },
  {
    path: "fixed-expenses-catalog", // Ruta anterior: 'catalogo-gastos-fijos'
    loadComponent: () =>
      import("src/app/features/expense-catalog/catalogo-gastos-fijos-list").then(
        (m) => m.CatalogoGastosFijosList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Gastos Fijos",
      breadcrumb: "Catálogo de Gastos Fijos",
    },
  },
  {
    // Suggested path: 'fixed-expenses-catalog-form/:id'
    path: "catalogo-gastos-fijos-form/:id",
    loadComponent: () =>
      import("src/app/features/expense-catalog/catalogo-gasto-fijo-form").then(
        (m) => m.CatalogoGastoFijoForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Gastos Fijos",
      breadcrumb: "Catálogo de Gastos Fijos",
    },
  },
  {
    path: "purchase-orders", // Ruta anterior: 'ordenes-compra'
    loadComponent: () =>
      import("src/app/features/purchases/purchase-order/orden-compra-list").then(
        (m) => m.OrdenCompraList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Órdenes de Compra",
      breadcrumb: "Órdenes de Compra",
    },
  },
  {
    // Suggested path: 'purchase-order/:id'
    path: "orden-compra/:id",
    loadComponent: () =>
      import("src/app/features/purchases/purchase-order/orden-compra").then(
        (m) => m.OrdenCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "Orden de Compra",
      breadcrumb: "Orden de Compra",
    },
  },
  {
    // Suggested path: 'purchase-order-pdf/:id'
    path: "orden-compra-pdf/:id",
    loadComponent: () =>
      import("src/app/features/purchases/purchase-order/orden-compra-pdf/orden-compra-pdf").then(
        (m) => m.OrdenCompraPdf,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Orden de Compra",
      breadcrumb: "PDF Orden de Compra",
    },
  },
  {
    // Suggested path: 'payment-request-pdf/:id'
    path: "solicitud-pago-pdf/:id",
    loadComponent: () =>
      import("src/app/features/purchases/purchase-order/solicitud-pago-pdf/solicitud-pago-pdf").then(
        (m) => m.SolicitudPagoPdfComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Solicitud de Pago",
      breadcrumb: "PDF Solicitud de Pago",
    },
  },

  {
    path: "paid", // Ruta anterior: 'pagadas'
    loadComponent: () =>
      import("src/app/features/purchases/purchase-order/orden-compra-pagadas/orden-compra-pagadas").then(
        (m) => m.OrdenCompraPagadas,
      ),
    canActivate: [authGuard],
    data: {
      title: "Órdenes de Compra Pagadas",
      breadcrumb: "Órdenes de Compra Pagadas",
    },
  },
  {
    path: "maintenance-budget", // Ruta anterior: 'mtto-presupuesto'
    loadComponent: () =>
      import("src/app/features/reports/mantenimiento-presupuesto/gastos-mantenimiento").then(
        (m) => m.GastosMantenimiento,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mantenimiento de Presupuesto",
      breadcrumb: "Mantenimiento de Presupuesto",
    },
  },
];
