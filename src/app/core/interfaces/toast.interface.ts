// src/app/core/interfaces/toast.interface.ts
export interface ToastMessage {
  severity: "success" | "info" | "warn" | "error";
  summary: string;
  detail?: string;
  life?: number; // Tiempo en ms que el toast es visible
}









