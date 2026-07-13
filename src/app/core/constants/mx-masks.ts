export const MX_MASKS = {
  PHONE: "(000) 0000-000",
  MOBILE: "000-000-0000",
  RFC_MORAL: "aaa000000-aaa",
  RFC_FISICA: "aaaa000000-aaa",
  CURP: "aaaa000000-aaaaaa00",
  ZIP: "00000",
  CARD: "0000 0000 0000 0000",
  EXPIRY: "00/00",
  ACCOUNT: "0000-0000-0000-0000-0000",
  CLABE: "00000000000000000000",
  POLIZA: "aa-000000",
  FOLIO: "aaa-000000",
  PLACA: "aaa-000-aa",
} as const;

export type MxMaskKey = keyof typeof MX_MASKS;

export const MX_MASK_LABELS: Record<MxMaskKey, string> = {
  PHONE: "teléfono (10 dígitos)",
  MOBILE: "celular (10 dígitos)",
  RFC_MORAL: "rfc persona moral (12 caracteres)",
  RFC_FISICA: "rfc persona física (13 caracteres)",
  CURP: "curp (18 caracteres)",
  ZIP: "código postal (5 dígitos)",
  CARD: "tarjeta (16 dígitos)",
  EXPIRY: "vencimiento (mm/aa)",
  ACCOUNT: "cuenta bancaria (24 dígitos)",
  CLABE: "clabe (20 dígitos)",
  POLIZA: "póliza (aa-000000)",
  FOLIO: "folio (aaa-000000)",
  PLACA: "placa vehicular (aaa-000-aa)",
};
