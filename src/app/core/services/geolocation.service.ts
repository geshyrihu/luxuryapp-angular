import { Injectable, inject } from "@angular/core";
import { ConsoleLoggerService } from "./console-logger.service";

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Injectable({ providedIn: "root" })
export class GeolocationService {
  private logger = inject(ConsoleLoggerService);

  getCurrentPosition(): Promise<GeolocationPosition | null> {
    if (!navigator.geolocation) {
      this.logger.warn("[Geolocation] API de geolocalización no disponible.");
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          this.logger.warn(
            `[Geolocation] Error al obtener posición: ${error.message}`,
          );
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 30000,
        },
      );
    });
  }
}
