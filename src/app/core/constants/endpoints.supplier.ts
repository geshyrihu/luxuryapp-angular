export const EndpointsSupplier = {
  PurchaseRequests: {
    addProduct: "PurchaseRequest/add-product",
    addProductList: (purchaseRequestId: string) =>
      `purchaserequest/add-product/${purchaseRequestId}`,
    create: "purchaserequest",
    deleteProduct: (id: string | number) => `purchaserequest/delete-product/${id}`,
    cuadroComparativo: (id: string) => `solicitudcompra/cuadrocomparativo/${id}`,
    cuadroComparativoUpdate: (id: string) => `SolicitudCompra/CuadroComparativo/${id}`,
    delete: (id: string | number) => `solicitudcompra/${id}`,
    getById: (id: string | number) => `SolicitudCompra/${id}`,
    getDetail: (id: string) => `purchaserequest/datail/${id}`,
    getIdByFolioAndCustomer: (folio: string, customerId: string) =>
      `SolicitudCompra/GetIdSolicitudCompra/${folio}/${customerId}`,
    getIndividual: (id: string | number) => `SolicitudCompra/GetSolicitudCompraIndividual/${id}`,
    getSolicitudCompraById: (id: string) => `purchaserequest/${id}`,
    listByCustomerAndStatus: (customerId: string, status: number | string) =>
      `purchaserequest/list/${customerId}/${status}`,
    listSolicitudCompraByCustomerAndStatus: (customerId: string, status: number | string) =>
      `solicitudcompra/list/${customerId}/${status}`,
    presentation: (customerId: string) => `SolicitudCompra/Presentation/${customerId}`,
    presentationOrder: "SolicitudCompra/Presentation/Order",
    presentationSelection: (id: string) => `SolicitudCompra/Presentation/${id}/Selection`,
    searchToAdd: (purchaseRequestId: string) =>
      `PurchaseRequest/SearchToAddRequest/${purchaseRequestId}`,
    solicitudCompraBase: "SolicitudCompra",
    update: (id: string) => `purchaserequest/${id}`,
    updateProduct: (id: string | number) => `PurchaseRequest/update-product/${id}`,
  },
  PurchaseRequestDetails: {
    addProductList: (solicitudCompraId: string) =>
      `SolicitudCompraDetalle/AddProduct/${solicitudCompraId}`,
    create: "SolicitudCompraDetalle",
    delete: (id: string | number) => `solicitudcompradetalle/${id}`,
    editProduct: (id: string | number) =>
      `solicitudcompradetalle/editproduct/${id}`,
    searchToAdd: (solicitudId: string) =>
      `SolicitudCompraDetalle/SearchToAddRequest/${solicitudId}`,
    update: (id: string | number) => `SolicitudCompraDetalle/${id}`,
  },
  ProviderSupport: {
    delete: (id: string) => `providersupport/${id}`,
    getAll: "providersupport",
    getById: (id: string) => `providersupport/${id}`,
  },
  PurchaseOrders: {
    authorize: (id: string, userId: string) =>
      `OrdenCompraAuth/Autorizar/${id}/${userId}`,
    create: (providerId: string | number, posicion: number, solicitudCompraId: string) =>
      `ordencompra/${providerId}/${posicion}/${solicitudCompraId}`,
    delete: (id: string | number) => `ordencompra/${id}`,
    getById: (id: string | number) => `OrdenCompra/${id}`,
    getForEdit: (id: string | number) => `OrdenCompra/GetForEdit/${id}`,
    listPagadas: (customerId: string, type: string) =>
      `OrdenCompra/Pagadas/${customerId}/${type}`,
    pdf: (id: string | number) => `ordencompra/Pdf/${id}`,
    progressiveCreate: "ordencompra/progressive-create",
    relatedQuotes: (solicitudCompraId: string) =>
      `OrdenCompra/CotizacionesRelacionadas/${solicitudCompraId}`,
    solicitudPago: (id: string | number) => `OrdenCompra/SolicitudPago/${id}`,
    unauthorize: (id: string) => `OrdenCompraAuth/Desautorizar/${id}`,
    linkManagerList: (customerId: string) =>
      `OrdenCompra/link-manager-list/${customerId}`,
    linkToRequest: (ordenCompraId: string, solicitudCompraId: string) =>
      `OrdenCompra/link-to-request/${ordenCompraId}/${solicitudCompraId}`,
    unlinkSolicitud: (id: string | number) => `OrdenCompra/UnlinkSolicitud/${id}`,
    update: (id: string | number) => `OrdenCompra/${id}`,
    uploadInvoice: (id: string | number) => `OrdenCompraStatus/${id}/invoices`,
    validateInvoice: (id: string | number) => `funding/validate-invoice/${id}`,
  },
  OrdenCompraStatus: {
    byOrdenCompra: (ordenCompraId: string) =>
      `OrdenCompraStatus/by-orden-compra/${ordenCompraId}`,
    deleteInvoice: (id: string | number) => `OrdenCompraStatus/invoices/${id}`,
    update: (id: string | number) => `OrdenCompraStatus/${id}`,
    updateInvoice: (id: string | number) => `OrdenCompraStatus/invoices/${id}`,
    updateInvoiceType: (id: string | number) =>
      `OrdenCompraStatus/invoices/${id}/type`,
  },
  Providers: {
    delete: (id: string) => `providers/${id}`,
    getByIdAndCustomer: (id: string | number, customerId: string) =>
      `providers/${id}/${customerId}`,
  },
  PurchaseOrderBudgets: {
    create: "OrdenCompraPresupuesto",
    delete: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
    getById: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
    update: (id: string | number) => `OrdenCompraPresupuesto/${id}`,
  },
  PurchaseOrderDetails: {
    addProductToOrder: (ordenCompraId: string) =>
      `OrdenCompraDetalle/AddProductoToOrder/${ordenCompraId}`,
    create: "OrdenCompraDetalle/",
    delete: (id: string | number) => `OrdenCompraDetalle/${id}`,
    getById: (id: string | number) => `OrdenCompraDetalle/${id}`,
    update: (id: string | number) => `OrdenCompraDetalle/${id}`,
  },
  PurchaseOrderPaymentData: {
    getById: (id: string | number) => `OrdenCompraDatosPago/${id}`,
    update: (id: string | number) => `OrdenCompraDatosPago/${id}`,
  },
  PurchaseOrderPaymentVouchers: {
    delete: (id: string | number) => `OrdenCompraComprobantePago/${id}`,
    upload: (ordenCompraId: string | number) => `OrdenCompraComprobantePago/${ordenCompraId}`,
  },
} as const;
