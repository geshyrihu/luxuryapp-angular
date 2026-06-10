/**
 * IDs de customers críticos con Guids determinísticos.
 * Estos Guids se mantienen constantes en todas las migraciones usando Guid Version 5.
 *
 * IMPORTANTE: Estos valores son generados determinísticamente en el backend
 * usando DeterministicGuidGenerator.GenerateCustomerGuid(oldId).
 * Siempre producen el mismo Guid para el mismo customer, incluso si se borra
 * y recrea la base de datos SQLServer.
 */
export const CRITICAL_CUSTOMER_IDS = {
  /**
   * Customer ID 25 - TORRE MITIKAH
   * Guid determinístico generado desde: DeterministicGuidGenerator.GenerateCustomerGuid(25)
   */
  TORRE_MITIKAH: "4c5cd4ae-d859-a85f-8ff6-8fac21901457",
  // 4c5cd4ae-d859-a85f-8ff6-8fac21901457
  /**
   * Customer ID 64 - RESIDENCIAL ROYAL R 1440
   * Guid determinístico generado desde: DeterministicGuidGenerator.GenerateCustomerGuid(64)
   */
  RESIDENCIAL_ROYAL: "045dfca2-6af7-905a-afc4-c265c225175d",

  /**
   * Customer ID 65 - PENINSULA
   * Guid determinístico generado desde: DeterministicGuidGenerator.GenerateCustomerGuid(65)
   */
  PENINSULA: "66a50304-9d0c-0456-863b-59d2e1551df7",
} as const;

/**
 * Type-safe access to critical customer IDs
 */
export type CriticalCustomerId =
  (typeof CRITICAL_CUSTOMER_IDS)[keyof typeof CRITICAL_CUSTOMER_IDS];

/**
 * Helper function to check if a customerId is a critical customer
 */
export function isCriticalCustomer(customerId: string): boolean {
  return Object.values(CRITICAL_CUSTOMER_IDS).includes(
    customerId as CriticalCustomerId,
  );
}

/**
 * Get the name of a critical customer by ID
 */
export function getCriticalCustomerName(customerId: string): string | null {
  switch (customerId) {
    case CRITICAL_CUSTOMER_IDS.TORRE_MITIKAH:
      return "TORRE MITIKAH";
    case CRITICAL_CUSTOMER_IDS.RESIDENCIAL_ROYAL:
      return "RESIDENCIAL ROYAL R 1440";
    case CRITICAL_CUSTOMER_IDS.PENINSULA:
      return "PENINSULA";
    default:
      return null;
  }
}
