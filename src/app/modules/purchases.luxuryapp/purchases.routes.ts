import { Routes } from "@angular/router";
import { authGuard } from "@core/auth/guards/auth.guard";

export const purchasesRoutes: Routes = [
  {
    path: "budget",
    loadComponent: () =>
      import("@accounting.luxuryapp/general-ledger/aspel-web-budget/wrapper").then(
        (m) => m.PresupuestoWebAspelWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presupuesto",
      breadcrumb: "Presupuesto",
    },
  },
  {
    path: "products-services",
    loadComponent: () =>
      import("@purchases.luxuryapp/products/productos-list").then(
        (m) => m.ProductosList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Lista de Productos y Servicios",
      breadcrumb: "Lista de Productos y Servicios",
    },
  },
  {
    path: "purchase-requests",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-requests/requests/solicitud-compra-list").then(
        (m) => m.SolicitudCompraList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitudes de Compra",
      breadcrumb: "Solicitudes de Compra",
    },
  },
  {
    path: "purchase-request/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-requests/requests/solicitud-compra").then(
        (m) => m.SolicitudCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "Solicitud de Compra",
      breadcrumb: "Solicitud de Compra",
    },
  },
  {
    path: "purchase-request-pdf/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-requests/requests/pdf-solicitud-compra").then(
        (m) => m.PdfSolicitudCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Solicitud de Compra",
      breadcrumb: "PDF Solicitud de Compra",
    },
  },
  {
    path: "comparison-chart/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-requests/comparison/cuadro-comparativo-list").then(
        (m) => m.CuadroComparativoList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Cuadro Comparativo",
      breadcrumb: "Cuadro Comparativo",
    },
  },
  {
    path: "purchase-request-presentation",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-requests/requests/solicitud-compra-presentacion").then(
        (m) => m.SolicitudCompraPresentacion,
      ),
    canActivate: [authGuard],
    data: {
      title: "Presentación de Solicitudes de Compra",
      breadcrumb: "Presentación",
    },
  },
  {
    path: "fixed-expenses-catalog",
    loadComponent: () =>
      import("@accounting.luxuryapp/accounting-catalogs/fixed-expense-catalogs/catalogo-gastos-fijos-list").then(
        (m) => m.CatalogoGastosFijosList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Gastos Fijos",
      breadcrumb: "Catálogo de Gastos Fijos",
    },
  },
  {
    path: "fixed-expenses-catalog-form/:id",
    loadComponent: () =>
      import("@accounting.luxuryapp/accounting-catalogs/fixed-expense-catalogs/catalogo-gasto-fijo-form").then(
        (m) => m.CatalogoGastoFijoForm,
      ),
    canActivate: [authGuard],
    data: {
      title: "Catálogo de Gastos Fijos",
      breadcrumb: "Catálogo de Gastos Fijos",
    },
  },
  {
    path: "purchase-orders",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-orders/purchase-order/orden-compra-list").then(
        (m) => m.OrdenCompraList,
      ),
    canActivate: [authGuard],
    data: {
      title: "Órdenes de Compra",
      breadcrumb: "Órdenes de Compra",
    },
  },
  {
    path: "purchase-order/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-orders/purchase-order/orden-compra").then(
        (m) => m.OrdenCompra,
      ),
    canActivate: [authGuard],
    data: {
      title: "Orden de Compra",
      breadcrumb: "Orden de Compra",
    },
  },
  {
    path: "purchase-order-pdf/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-orders/purchase-order/purchase-order-pdf/orden-compra-pdf").then(
        (m) => m.OrdenCompraPdf,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Orden de Compra",
      breadcrumb: "PDF Orden de Compra",
    },
  },
  {
    path: "payment-request-pdf/:id",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-orders/purchase-order/payment-request-pdf/solicitud-pago-pdf").then(
        (m) => m.SolicitudPagoPdfComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: "PDF Solicitud de Pago",
      breadcrumb: "PDF Solicitud de Pago",
    },
  },
  {
    path: "paid",
    loadComponent: () =>
      import("@purchases.luxuryapp/purchase-history/historial-compras-wrapper").then(
        (m) => m.HistorialComprasWrapper,
      ),
    canActivate: [authGuard],
    data: {
      title: "Órdenes de Compra Pagadas",
      breadcrumb: "Órdenes de Compra Pagadas",
    },
  },
  {
    path: "maintenance-budget",
    loadComponent: () =>
      import("@operations.luxuryapp/reports/maintenance-budget/gastos-mantenimiento").then(
        (m) => m.GastosMantenimiento,
      ),
    canActivate: [authGuard],
    data: {
      title: "Mantenimiento de Presupuesto",
      breadcrumb: "Mantenimiento de Presupuesto",
    },
  },
];
