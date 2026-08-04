import { Injectable, signal } from "@angular/core";

interface LogEntry {
  level: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: string;
  details?: string;
}

/**
 * Servicio para capturar logs en la app y mostrarlos en pantalla.
 * Útil para debugging en producción (especialmente iPhone sin Mac).
 *
 * Uso:
 * ```typescript
 * this.debugConsole.log("Mi mensaje");
 * this.debugConsole.error("Error:", error);
 * ```
 *
 * En el template:
 * ```html
 * @if (debugConsole.showConsole()) {
 *   <lx-debug-console [logs]="debugConsole.logs()" />
 * }
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class DebugConsoleService {
  logs = signal<LogEntry[]>([]);
  showConsole = signal(false);
  private maxLogs = 100;

  constructor() {
    this.interceptConsoleLogs();
  }

  private interceptConsoleLogs(): void {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args) => {
      originalLog(...args);
      this.addLog("log", args.map(String).join(" "));
    };

    console.error = (...args) => {
      originalError(...args);
      const message = args[0]?.toString() || "Error";
      const details = args.slice(1).map(String).join(" ");
      this.addLog("error", message, details);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      this.addLog("warn", args.map(String).join(" "));
    };

    console.info = (...args) => {
      originalInfo(...args);
      this.addLog("info", args.map(String).join(" "));
    };
  }

  private addLog(
    level: LogEntry["level"],
    message: string,
    details?: string,
  ): void {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const entry: LogEntry = {
      level,
      message: message.substring(0, 200),
      timestamp,
      details: details?.substring(0, 300),
    };

    this.logs.update((current) => {
      const updated = [entry, ...current];
      return updated.slice(0, this.maxLogs);
    });
  }

  toggleConsole(): void {
    this.showConsole.update((v) => !v);
  }

  clearLogs(): void {
    this.logs.set([]);
  }
}
