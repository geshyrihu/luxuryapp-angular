import { Injectable, inject } from "@angular/core";
import { ConsoleLoggerService } from "./console-logger.service";
@Injectable({
  providedIn: "root",
})
export class StorageService {
  private localStorage: any;
  private consoleLogger = inject(ConsoleLoggerService);

  constructor() {
    this.consoleLogger.custom(
      "📦",
      "#3F51B5",
      "[StorageService] Inicializando servicio de almacenamiento local...",
    );
    this.localStorage = window.localStorage;
  }

  retrieve(key: string): any {
    this.consoleLogger.custom(
      "🔍",
      "#2196F3",
      `[StorageService] Recuperando valor para clave: '${key}'`,
    );

    const item = this.localStorage.getItem(key);

    if (item && item !== "undefined") {
      const parsed = JSON.parse(item);
      this.consoleLogger.custom(
        "✅",
        "#4CAF50",
        `[StorageService] Valor encontrado para '${key}':`,
        parsed,
      );
      return parsed;
    }

    this.consoleLogger.custom(
      "🟡",
      "#FF9800",
      `[StorageService] No se encontró valor para clave '${key}' o es undefined.`,
    );
    return undefined;
  }

  store(key: string, value: any): void {
    const stringValue = JSON.stringify(value);
    this.consoleLogger.custom(
      "💾",
      "#FF9800",
      `[StorageService] Guardando clave: '${key}'`,
      { value: value },
    );

    this.localStorage.setItem(key, stringValue);
    this.consoleLogger.custom(
      "✅",
      "#4CAF50",
      `[StorageService] Clave '${key}' guardada exitosamente.`,
    );
  }

  remove(key: string): void {
    this.consoleLogger.custom(
      "🗑️",
      "#F44336",
      `[StorageService] Eliminando clave: '${key}'`,
    );

    this.localStorage.removeItem(key);
    this.consoleLogger.custom(
      "✅",
      "#9E9E9E",
      `[StorageService] Clave '${key}' eliminada.`,
    );
  }

  clear(key?: string): void {
    if (key) {
      this.consoleLogger.custom(
        "🧹",
        "#FF5722",
        `[StorageService] Limpiando clave específica: '${key}'`,
      );
      this.localStorage.removeItem(key);
      this.consoleLogger.custom(
        "✅",
        "#9E9E9E",
        `[StorageService] Clave '${key}' ha sido limpiada.`,
      );
    } else {
      this.consoleLogger.custom(
        "🔥",
        "#D32F2F",
        "[StorageService] Limpiando TODO el almacenamiento local.",
      );
      this.localStorage.clear();
      this.consoleLogger.custom(
        "✅",
        "#4CAF50",
        "[StorageService] Almacenamiento local completamente limpio.",
      );
    }
  }
}









