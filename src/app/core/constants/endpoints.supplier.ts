export const EndpointsSupplier = {
  PurchaseRequests: {
    addProduct: "PurchaseRequest/add-product",
    addProductList: (purchaseRequestId: string) =>
      `purchaserequest/add-product/${purchaseRequestId}`,
    create: "purchaserequest",
    deleteProduct: (id: string | number) => `purchaserequest/delete-product/${id}`,
    cuadroComparativo: (id: string) => `solicitudcompra/cuadrocomparativo/${id}`,
    cuadroComparativoUpdate: (id: string) => `solicitud-compra/cuadro-comparativo/${id}`,
    delete: (id: string | number) => `solicitudcompra/${id}`,
    getById: (id: string | number) => `solicitud-compra/${id}`,
    getDetail: (id: string) => `purchaserequest/datail/${id}`,
    getIdByFolioAndCustomer: (folio: string, customerId: string) =>
      `solicitud-compra/GetIdSolicitudCompra/${folio}/${customerId}`,
    getIndividual: (id: string | number) => `solicitud-compra/GetSolicitudCompraIndividual/${id}`,
    getSolicitudCompraById: (id: string) => `purchaserequest/${id}`,
    listByCustomerAndStatus: (customerId: string, status: number | string) =>
      `purchaserequest/list/${customerId}/${status}`,
    listSolicitudCompraByCustomerAndStatus: (customerId: string, status: number | string) =>
      `solicitudcompra/list/${customerId}/${status}`,
    presentation: (customerId: string) => `solicitud-compra/Presentation/${customerId}`,
    presentationOrder: "solicitud-compra/Presentation/Order",
    presentationSelection: (id: string) => `solicitud-compra/Presentation/${id}/Selection`,
    searchToAdd: (purchaseRequestId: string) =>
      `PurchaseRequest/SearchToAddRequest/${purchaseRequestId}`,
    solicitudCompraBase: "solicitud-compra",
    update: (id: string) => `purchaserequest/${id}`,
    updateProduct: (id: string | number) => `PurchaseRequest/update-product/${id}`,
    cuadroComparativoEvidences: (solicitudCompraId: string) => `solicitud-compra/cuadro-comparativo/${solicitudCompraId}/Evidences`,
    cuadroComparativoEvidenceDelete: (evidenceId: string) => `solicitud-compra/cuadro-comparativo/Evidences/${evidenceId}`,
    comiteEvents: (customerId: string) => `solicitud-compra/comite-events/${customerId}`,
  },
  CustomerProvider: {
    getById: (id: string) => `customer-provider/getById/${id}`,
  },
  InventarioIluminacion: {
    getById: (id: string) => `inventario-iluminacion/${id}`,
  },
  InventarioPintura: {
    getById: (id: string) => `inventario-pintura/${id}`,
  },
  PurchaseRequestDetails: {
    addProductList: (solicitudCompraId: string) =>
      `solicitud-compra-detalle/AddProduct/${solicitudCompraId}`,
    create: "solicitud-compra-detalle",
    delete: (id: string | number) => `solicitudcompradetalle/${id}`,
    updatePrice: (id: string) => `solicitud-compra-detalle/UpdatePrice/${id}`,
    editProduct: (id: string | number) =>
      `solicitudcompradetalle/editproduct/${id}`,
    searchToAdd: (solicitudId: string) =>
      `solicitud-compra-detalle/SearchToAddRequest/${solicitudId}`,
    update: (id: string | number) => `solicitud-compra-detalle/${id}`,
  },
  ProviderSupport: {
    delete: (id: string) => `providersupport/${id}`,
    getAll: "providersupport",
    getById: (id: string) => `providersupport/${id}`,
  },
  PurchaseOrders: {
    authorize: (id: string, userId: string) =>
      `orden-compra-auth/Autorizar/${id}/${userId}`,
    create: (providerId: string | number, posicion: number, solicitudCompraId: string) =>
      `ordencompra/${providerId}/${posicion}/${solicitudCompraId}`,
    delete: (id: string | number) => `ordencompra/${id}`,
    getById: (id: string | number) => `orden-compra/${id}`,
    getForEdit: (id: string | number) => `orden-compra/GetForEdit/${id}`,
    listPagadas: (customerId: string, type: string) =>
      `orden-compra/Pagadas/${customerId}/${type}`,
    pdf: (id: string | number) => `ordencompra/Pdf/${id}`,
    progressiveCreate: "ordencompra/progressive-create",
    relatedQuotes: (solicitudCompraId: string) =>
      `orden-compra/CotizacionesRelacionadas/${solicitudCompraId}`,
    solicitudPago: (id: string | number) => `orden-compra/SolicitudPago/${id}`,
    unauthorize: (id: string) => `orden-compra-auth/Desautorizar/${id}`,
    linkManagerList: (customerId: string) =>
      `orden-compra/link-manager-list/${customerId}`,
    linkToRequest: (ordenCompraId: string, solicitudCompraId: string) =>
      `orden-compra/link-to-request/${ordenCompraId}/${solicitudCompraId}`,
    unlinkSolicitud: (id: string | number) => `orden-compra/UnlinkSolicitud/${id}`,
    update: (id: string | number) => `orden-compra/${id}`,
    uploadInvoice: (id: string | number) => `orden-compra-status/${id}/invoices`,
    validateInvoice: (id: string | number) => `funding/validate-invoice/${id}`,
  },
  OrdenCompraStatus: {
    byOrdenCompra: (ordenCompraId: string) =>
      `orden-compra-status/by-orden-compra/${ordenCompraId}`,
    deleteInvoice: (id: string | number) => `orden-compra-status/invoices/${id}`,
    update: (id: string | number) => `orden-compra-status/${id}`,
    updateInvoice: (id: string | number) => `orden-compra-status/invoices/${id}`,
    updateInvoiceType: (id: string | number) =>
      `orden-compra-status/invoices/${id}/type`,
  },
  Providers: {
    delete: (id: string) => `providers/${id}`,
    getByIdAndCustomer: (id: string | number, customerId: string) =>
      `providers/${id}/${customerId}`,
    getByIdAndCustomerAlt: (id: string, customerId: string) =>
      `Providers/${id}/${customerId}`,
  },
  PurchaseOrderBudgets: {
    create: "orden-compra-presupuesto",
    delete: (id: string | number) => `orden-compra-presupuesto/${id}`,
    getById: (id: string | number) => `orden-compra-presupuesto/${id}`,
    update: (id: string | number) => `orden-compra-presupuesto/${id}`,
    getAllForOrdenCompraTotal: (ordenCompraId: string) => `orden-compra-presupuesto/GetAllForOrdenCompraTotal/${ordenCompraId}`,
  },
  PurchaseOrderDetails: {
    getAllTotal: (ordenCompraId: string) => `orden-compra-detalle/GetAllTotal/${ordenCompraId}`,
    addProductToOrder: (ordenCompraId: string) =>
      `orden-compra-detalle/AddProductoToOrder/${ordenCompraId}`,
    create: "orden-compra-detalle/",
    delete: (id: string | number) => `orden-compra-detalle/${id}`,
    getById: (id: string | number) => `orden-compra-detalle/${id}`,
    update: (id: string | number) => `orden-compra-detalle/${id}`,
  },
  PurchaseOrderPaymentData: {
    getById: (id: string | number) => `orden-compra-datos-pago/${id}`,
    update: (id: string | number) => `orden-compra-datos-pago/${id}`,
  },
  PurchaseOrderPaymentVouchers: {
    delete: (id: string | number) => `orden-compra-comprobante-pago/${id}`,
    upload: (ordenCompraId: string | number) => `orden-compra-comprobante-pago/${ordenCompraId}`,
  },
} as const;
