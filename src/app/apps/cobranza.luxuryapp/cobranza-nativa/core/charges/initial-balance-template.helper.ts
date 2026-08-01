import { PropertyInitialBalanceDTO } from "../../interfaces/charge.dto";

const TEMPLATE_FILE_NAME = "Plantilla_Saldos_Iniciales.csv";

function escapeCsvCell(value: string): string {
  if (value.includes('"')) {
    value = value.replaceAll('"', '""');
  }

  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value}"`;
  }

  return value;
}

export function downloadInitialBalanceTemplate(
  properties: PropertyInitialBalanceDTO[],
): void {
  const rows = [
    [
      "PropertyId",
      "Monto",
      "FechaVencimiento",
      "Concepto",
      "ReferenciaCuenta",
      "ReferenciaPropiedad",
    ],
    ...properties.map((property) => [
      property.propertyId,
      "",
      "",
      "Saldo Inicial",
      property.accountNumber ?? "",
      property.propertyFullName ?? "",
    ]),
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = TEMPLATE_FILE_NAME;
  link.click();
  URL.revokeObjectURL(url);
}
