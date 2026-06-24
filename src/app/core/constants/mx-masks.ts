export const MX_MASKS = {
  PHONE: "(000) 0000-000",
  MOBILE: "000-000-0000",
  RFC_MORAL: "AAA000000AAA",
  RFC_FISICA: "AAAA000000AAA",
  CURP: "AAAA000000AAAAAA00",
  ZIP: "00000",
  CARD: "0000 0000 0000 0000",
  EXPIRY: "00/00",
  ACCOUNT: "0000-0000-0000-0000-0000",
  CLABE: "00000000000000000000",
  POLIZA: "AA-000000",
  FOLIO: "AAA-000000",
  PLACA: "AAA-000-AA",
} as const;

export type MxMaskKey = keyof typeof MX_MASKS;

export const MX_MASK_LABELS: Record<MxMaskKey, string> = {
  PHONE: "Teléfono (10 dígitos)",
  MOBILE: "Celular (10 dígitos)",
  RFC_MORAL: "RFC Persona Moral (12 caracteres)",
  RFC_FISICA: "RFC Persona Física (13 caracteres)",
  CURP: "CURP (18 caracteres)",
  ZIP: "Código Postal (5 dígitos)",
  CARD: "Tarjeta (16 dígitos)",
  EXPIRY: "Vencimiento (MM/AA)",
  ACCOUNT: "Cuenta bancaria (24 dígitos)",
  CLABE: "CLABE (20 dígitos)",
  POLIZA: "Póliza (AA-000000)",
  FOLIO: "Folio (AAA-000000)",
  PLACA: "Placa vehicular (AAA-000-AA)",
};
