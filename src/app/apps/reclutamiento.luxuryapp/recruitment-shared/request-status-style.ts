import { TagSeverity } from "@ui/base/tag.base";

export function requestStatusTagSeverity(status: string | null | undefined): TagSeverity {
  switch (normalizeRequestStatus(status)) {
    case "pendiente":
      return "warn";
    case "proceso":
      return "info";
    case "concluido":
      return "success";
    case "cancelado":
      return "danger";
    default:
      return "secondary";
  }
}

export function requestStatusBorderColor(status: string | null | undefined): string {
  switch (requestStatusTagSeverity(status)) {
    case "warn":
      return "var(--ds-warning)";
    case "info":
      return "var(--ds-info)";
    case "success":
      return "var(--ds-success)";
    case "danger":
      return "var(--ds-danger)";
    default:
      return "var(--ds-border-strong)";
  }
}

function normalizeRequestStatus(status: string | null | undefined): string {
  return (status ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
