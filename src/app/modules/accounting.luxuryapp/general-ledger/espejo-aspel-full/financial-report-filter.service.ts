import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ReportFilterService {
  year = signal<number>(new Date().getFullYear());
  mesIdx = signal<number>(Math.max(2, new Date().getMonth() - 1)); // 0-based

  // Contexto para IA
  currentReportName = signal<string>("");
  currentReportContext = signal<string>("");
}
