export enum Recurrence {
    Eventual = 1,
    Mensual = 2,
    Bimestral = 3,
    Trimestral = 4,
    Cuatrimestral = 5,
    Quimestral = 6,
    Semestral = 7,
    Anual = 8
}

export enum EChargeType {
    MantenimientoOrdinario,
    CuotaExtraordinaria,
    RecargoMora,
    SaldoInicial,
    Otros,
    Multa
}

export enum EFineStatus {
    Emitida = 1,
    Notificada = 2,
    CargoGenerado = 3,
    Pagada = 4,
    Anulada = 5,
}

export enum EChargeStatus {
    Pendiente,
    Pagado,
    PagoParcial,
    Vencido,
    Cancelado
}

export enum EPaymentStatus {
    Registrado,
    Verificado,
    Rechazado,
    Cancelado,
    Revertido,
    NoIdentificado,
}

export enum ELateFeeType {
    Fijo,
    Porcentaje
}

// Just defining the most common ones or leaving as number
export enum EPaymentMethod {
    Cash = 1,
    NominativeCheck = 2,
    ElectronicTransfer = 3,
    CreditCard = 4,
    ElectronicWallet = 5,
    ElectronicMoney = 6,
    FoodVouchers = 8,
    PaymentInKind = 12,
    SubrogationPayment = 13,
    ConsignmentPayment = 14,
    DebtForgiveness = 15,
    Compensation = 17,
    Novation = 23,
    Confusion = 24,
    DebtRemission = 25,
    PrescriptionOrExpiration = 26,
    CreditorSatisfaction = 27,
    DebitCard = 28,
    ServiceCard = 29,
    AdvanceApplication = 30,
    ToBeDefined = 99
}

export enum ECalculationMethod {
    FixedAmount = 1,
    Indiviso = 2
}

export enum EDiscountType {
    FixedValue = 1,
    Percentage = 2
}

export enum EMemberRole {
    Owner = 1,
    CoOwner = 2,
    Tenant = 3,
    Resident = 4,
    Manager = 5,
}

export enum EFinancialApprovalOperationType {
    Condonacion = 1,
    DevolucionPago = 2,
    ReaperturaPeriodo = 3,
    AnulacionCargoPagado = 4,
    AjusteAlAlza = 5,
}

export enum EFinancialApprovalStatus {
    Pendiente = 1,
    Aprobada = 2,
    Rechazada = 3,
    Cancelada = 4,
}

export enum EFinancialEventType {
    EmisionCargo = 1,
    CancelacionCargo = 2,
    AjusteCargo = 3,
    CondonacionCargo = 4,
    RecepcionPago = 10,
    AplicacionPago = 11,
    CancelacionPago = 12,
    ReversoPago = 13,
    RechazoPago = 14,
    EmisionNotaCredito = 20,
    AplicacionNotaCredito = 21,
    CancelacionNotaCredito = 22,
    GeneracionRecargo = 30,
    CierrePeriodo = 40,
}

