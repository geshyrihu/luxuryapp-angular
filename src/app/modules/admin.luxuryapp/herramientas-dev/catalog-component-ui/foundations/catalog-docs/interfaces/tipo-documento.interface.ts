export interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  severity: "success" | "info" | "warn" | "danger" | "secondary" | "contrast";
}
