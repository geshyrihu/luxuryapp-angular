export interface IAutitoriaCuentasAspelResponseDTO {
  ejercicio: number;
  empresa: string;
  totalCustomersConfigurados: number;
  totalCustomersProcesados: number;
  totalCustomersConError: number;
  totalCuentasCatalogoGeneral: number;
  totalCuentasCompartidas: number;
  totalCuentasParciales: number;
  customers: IAutitoriaCuentaAspelCustomerDTO[];
  catalogoGeneral: IAutitoriaCuentaAspelCatalogoDTO[];
}

export interface IAutitoriaCuentaAspelCustomerDTO {
  customerId: string;
  customerName: string;
  customerShortName: string;
  customerIdAspelId: number;
  estatus: string;
  errorMensaje?: string | null;
  totalCuentasActivas: number;
  cuentasPresentesCatalogo: number;
  cuentasFaltantesCatalogo: number;
  cuentasConDiferenciaEstructural: number;
  porcentajeCoberturaCatalogo: number;
}

export interface IAutitoriaCuentaAspelCatalogoDTO {
  numCta: string;
  nombreReferencia: string;
  nivelReferencia: number;
  tipoReferencia: string;
  naturalezaReferencia: string;
  ctaPapaReferencia: string;
  ctaRaizReferencia: string;
  compartidaPorTodos: boolean;
  tieneDiferenciaEstructural: boolean;
  totalCustomersEsperados: number;
  totalCustomersConCuenta: number;
  totalCustomersSinCuenta: number;
  presencias: IAutitoriaCuentaAspelPresenciaDTO[];
}

export interface IAutitoriaCuentaAspelPresenciaDTO {
  customerId: string;
  customerName: string;
  customerShortName: string;
  presente: boolean;
  estructuraValida: boolean;
  nombreActual: string;
  nivelActual: number;
  tipoActual: string;
  naturalezaActual: string;
  ctaPapaActual: string;
  ctaRaizActual: string;
  camposConDiferencia: string[];
}
