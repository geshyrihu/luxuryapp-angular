export const EndpointsSupplier = {
  PurchaseRequests: {
    addProduct: "purchase-request/add-product",
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
      `solicitud-compra/get-id-solicitud-compra/${folio}/${customerId}`,
    getIndividual: (id: string | number) => `solicitud-compra/get-solicitud-compra-individual/${id}`,
    getSolicitudCompraById: (id: string) => `purchaserequest/${id}`,
    listByCustomerAndStatus: (customerId: string, status: number | string) =>
      `purchaserequest/list/${customerId}/${status}`,
    listSolicitudCompraByCustomerAndStatus: (customerId: string, status: number | string) =>
      `solicitudcompra/list/${customerId}/${status}`,
    presentation: (customerId: string) => `solicitud-compra/presentation/${customerId}`,
    presentationOrder: "solicitud-compra/presentation/order",
    presentationSelection: (id: string) => `solicitud-compra/presentation/${id}/selection`,
    searchToAdd: (purchaseRequestId: string) =>
      `purchase-request/search-to-add-request/${purchaseRequestId}`,
    solicitudCompraBase: "solicitud-compra",
    update: (id: string) => `purchaserequest/${id}`,
    updateProduct: (id: string | number) => `purchase-request/update-product/${id}`,
    cuadroComparativoEvidences: (solicitudCompraId: string) => `solicitud-compra/cuadro-comparativo/${solicitudCompraId}/evidences`,
    cuadroComparativoEvidenceDelete: (evidenceId: string) => `solicitud-compra/cuadro-comparativo/evidences/${evidenceId}`,
    comiteEvents: (customerId: string) => `solicitud-compra/comite-events/${customerId}`,
  },
  CustomerProvider: {
    getById: (id: string) => `customer-provider/get-by-id/${id}`,
  },
  InventarioIluminacion: {
    getById: (id: string) => `inventario-iluminacion/${id}`,
  },
  InventarioPintura: {
    getById: (id: string) => `inventario-pintura/${id}`,
  },
  PurchaseRequestDetails: {
    addProductList: (solicitudCompraId: string) =>
      `solicitud-compra-detalle/add-product/${solicitudCompraId}`,
    create: "solicitud-compra-detalle",
    delete: (id: string | number) => `solicitudcompradetalle/${id}`,
    updatePrice: (id: string) => `solicitud-compra-detalle/update-price/${id}`,
    editProduct: (id: string | number) =>
      `solicitudcompradetalle/editproduct/${id}`,
    searchToAdd: (solicitudId: string) =>
      `solicitud-compra-detalle/search-to-add-request/${solicitudId}`,
    update: (id: string | number) => `solicitud-compra-detalle/${id}`,
  },
  ProviderSupport: {
    delete: (id: string) => `provider-support/${id}`,
    getAll: "provider-support",
    getById: (id: string) => `provider-support/${id}`,
  },
  PurchaseOrders: {
    authorize: (id: string, userId: string) =>
      `orden-compra-auth/autorizar/${id}/${userId}`,
    create: (providerId: string | number, posicion: number, solicitudCompraId: string) =>
      `ordencompra/${providerId}/${posicion}/${solicitudCompraId}`,
    delete: (id: string | number) => `ordencompra/${id}`,
    getById: (id: string | number) => `orden-compra/${id}`,
    getForEdit: (id: string | number) => `orden-compra/get-for-edit/${id}`,
    listPagadas: (customerId: string, type: string) =>
      `orden-compra/pagadas/${customerId}/${type}`,
    pdf: (id: string | number) => `ordencompra/pdf/${id}`,
    progressiveCreate: "ordencompra/progressive-create",
    relatedQuotes: (solicitudCompraId: string) =>
      `orden-compra/cotizaciones-relacionadas/${solicitudCompraId}`,
    solicitudPago: (id: string | number) => `orden-compra/solicitud-pago/${id}`,
    unauthorize: (id: string) => `orden-compra-auth/desautorizar/${id}`,
    linkManagerList: (customerId: string) =>
      `orden-compra/link-manager-list/${customerId}`,
    linkToRequest: (ordenCompraId: string, solicitudCompraId: string) =>
      `orden-compra/link-to-request/${ordenCompraId}/${solicitudCompraId}`,
    unlinkSolicitud: (id: string | number) => `orden-compra/unlink-solicitud/${id}`,
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
      `providers/${id}/${customerId}`,
  },
  PurchaseOrderBudgets: {
    create: "orden-compra-presupuesto",
    delete: (id: string | number) => `orden-compra-presupuesto/${id}`,
    getById: (id: string | number) => `orden-compra-presupuesto/${id}`,
    update: (id: string | number) => `orden-compra-presupuesto/${id}`,
    getAllForOrdenCompraTotal: (ordenCompraId: string) => `orden-compra-presupuesto/get-all-for-orden-compra-total/${ordenCompraId}`,
  },
  PurchaseOrderDetails: {
    getAllTotal: (ordenCompraId: string) => `orden-compra-detalle/get-all-total/${ordenCompraId}`,
    addProductToOrder: (ordenCompraId: string) =>
      `orden-compra-detalle/add-producto-to-order/${ordenCompraId}`,
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
  RefactorSupplier: {
    customerproviderById: (id: any) => `customer-provider/${id}`,
    inventarioIluminacionListById: (customerIdS: any) => `inventario-iluminacion/list/${customerIdS}`,
    inventarioIluminacionById: (id: any) => `inventario-iluminacion/${id}`,
    inventarioPinturaById: (id: any) => `inventario-pintura/${id}`,
    ordenCompraAuthNoAutorizadaByIdById: (ordenCompraAuthId: any, authS: any) => `orden-compra-auth/no-autorizada/${ordenCompraAuthId}/${authS}`,
    providersByIdById: (providerId: any, customerIdS: any) => `providers/${providerId}/${customerIdS}`,
    providersChangeStateByIdById: (p0: any, p1: any) => `providers/change-state/${p0}/${p1}`,
    qualificationProvider: "qualification-provider",
    qualificationProviderById: (qualificationProviderId: any) => `qualification-provider/${qualificationProviderId}`,
    cotizacionproveedor: "cotizacion-proveedor",
    cotizacionProveedorById: (cotizacionProveedorId: any) => `cotizacion-proveedor/${cotizacionProveedorId}`,
    cotizacionProveedorUpdateProviderById: (cotizacionProveedor: any) => `cotizacion-proveedor/update-provider/${cotizacionProveedor}`,
    cotizacionProveedorRemoveFileById: (cotizacionProveedor: any) => `cotizacion-proveedor/remove-file/${cotizacionProveedor}`,
    solicitudCompraDeleteproviderByIdById: (solicitudCompraId: any, cotizacionProveedorId: any) => `solicitud-compra/deleteprovider/${solicitudCompraId}/${cotizacionProveedorId}`,
    solicitudCompraCuadroComparativoByIdBudgets: (solicitudCompraId: any) => `solicitud-compra/cuadro-comparativo/${solicitudCompraId}/budgets`,
    solicitudCompraCuadroComparativoBudgetsById: (budgetId: any) => `solicitud-compra/cuadro-comparativo/budgets/${budgetId}`,
      customerProviderById: (customerIdS: any) => `customer-provider/${customerIdS}`,
    inventarioPinturaListById: (customerIdS: any) => `inventario-pintura/list/${customerIdS}`,
    ordenCompraListByIdByIdById: (customerId: any, statusCompra: any, tipoGasto: any) => `orden-compra/list/${customerId}/${statusCompra}/${tipoGasto}`,
    ordenCompraPagadasByIdById: (customerIdS: any, type: any) => `orden-compra/pagadas/${customerIdS}/${type}`,
    productosById: (productoId: any) => `productos/${productoId}`,
    providersValidarRfcByIdById: (valueRfc: any, customerIdS: any) => `providers/validar-rfc/${valueRfc}/${customerIdS}`,
    providersList: "providers/list",
    providersAutorizarById: (providerId: any) => `providers/autorizar/${providerId}`,
    providersCoincidenciasById: (providerId: any) => `providers/coincidencias/${providerId}`,
    qualificationProviderByIdById: (authS: any, providerId: any) => `qualification-provider/${authS}/${providerId}`,
    cotizacionProveedorPosicionCotizacionByIdById: (solicitudCompraId: any, posicionCotizacion: any) => `cotizacion-proveedor/posicion-cotizacion/${solicitudCompraId}/${posicionCotizacion}`,
    solicitudcompraById: (solicitudCompraId: any) => `solicitud-compra/${solicitudCompraId}`,
    ordenCompraCotizacionesRelacionadasById: (solicitudCompraId: any) => `orden-compra/cotizaciones-relacionadas/${solicitudCompraId}`,
    solicitudcompraCuadrocomparativoById: (solicitudCompraId: any) => `solicitud-compra/cuadrocomparativo/${solicitudCompraId}`,
},
} as const;
