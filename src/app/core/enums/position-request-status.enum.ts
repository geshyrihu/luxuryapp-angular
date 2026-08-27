export enum PositionRequestStatus {
  Abierta = 3,
}

export function positionRequestStatusLabel(status: number | null | undefined): string {
  if (status == null) return "Sin solicitud";
  return status === PositionRequestStatus.Abierta
    ? "Vacante abierta"
    : "Alta en proceso";
}
