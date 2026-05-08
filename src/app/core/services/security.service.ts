import { Injectable, inject } from "@angular/core";
import { UserTokenDTO } from "../interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "./console-logger.service";
import { StorageService } from "./storage.service";
@Injectable({
  providedIn: "root",
})
export class SecurityService {
  private storeService = inject(StorageService);
  private consoleLogger = inject(ConsoleLoggerService);

  constructor() {
    this.consoleLogger.custom(
      "🔐",
      "#3F51B5",
      "[SecurityService] Servicio de seguridad inicializado.",
    );
  }

  setAuthData(data: UserTokenDTO): void {
    this.consoleLogger.custom(
      "🔐",
      "#2196F3",
      "[SecurityService] Guardando datos de autenticación...",
    );

    this.storeService.store("userAuthData", data);
    this.consoleLogger.custom(
      "✅",
      "#4CAF50",
      "[SecurityService] Datos completos (userAuthData) guardados.",
      { roles: data.roles, expiration: data.expiration },
    );

    this.storeService.store("accessToken", data.token);
    this.consoleLogger.custom(
      "🔑",
      "#FF9800",
      '[SecurityService] Token almacenado como "accessToken".',
      { token: `${data.token.substring(0, 12)}...` },
    );
  }

  getAuthData(): UserTokenDTO | null {
    this.consoleLogger.custom(
      "🔍",
      "#2196F3",
      "[SecurityService] Intentando recuperar datos de autenticación...",
    );

    const data = this.storeService.retrieve("userAuthData");

    if (data) {
      this.consoleLogger.custom(
        "✅",
        "#4CAF50",
        "[SecurityService] Datos de autenticación encontrados.",
        {
          applicationUserId: data.infoUserAuthDTO?.applicationUserId,
          roles: data.roles,
        },
      );
      return data as UserTokenDTO;
    }

    this.consoleLogger.custom(
      "🟡",
      "#FF9800",
      "[SecurityService] No se encontraron datos de autenticación.",
    );
    return null;
  }

  resetAuthData(): void {
    this.consoleLogger.custom(
      "🚪",
      "#F44336",
      "[SecurityService] Limpiando datos de autenticación...",
    );

    this.storeService.remove("userAuthData");
    this.storeService.remove("accessToken");

    this.consoleLogger.custom(
      "🧹",
      "#9E9E9E",
      "[SecurityService] Datos de sesión eliminados: userAuthData y accessToken.",
    );
  }

  getToken(): string | null {
    this.consoleLogger.custom(
      "🔍",
      "#3F51B5",
      "[SecurityService] Solicitando token de acceso...",
    );

    const token = this.storeService.retrieve("accessToken");

    if (token) {
      this.consoleLogger.custom(
        "✅",
        "#4CAF50",
        "[SecurityService] Token recuperado exitosamente.",
        { token: `${token.substring(0, 12)}...` },
      );
    } else {
      this.consoleLogger.custom(
        "❌",
        "#FF5722",
        "[SecurityService] No se encontró token de acceso.",
      );
    }

    return token;
  }
}









