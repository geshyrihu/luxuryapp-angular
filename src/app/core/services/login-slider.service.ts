import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class LoginSliderService {
  // apiResponseS = inject(ApiResponseService); // Ya no se usa

  // Todas las imágenes disponibles
  private allImages: string[] = [];

  // Configuración
  // private readonly VISIBLE_SLIDES = 5; 
  // private readonly TRANSITION_INTERVAL = 3000;

  // Estado actual
  private currentIndex = 0;
  private visibleImages$ = new BehaviorSubject<string[]>([]);

  constructor() {
    this.initializeSlider();
  }

  /**
   * Obtiene las imágenes visibles actuales
   */
  getVisibleImages$() {
    return this.visibleImages$.asObservable();
  }

  /**
   * Inicializa el slider con las primeras imágenes
   */
  private async initializeSlider(): Promise<void> {
    const images = [
      "assets/images/image-15.jpg",
      // Add more if known, otherwise just one is enough to avoid blank screen
    ];
    this.visibleImages$.next(images);
  }

  /**
   * Inicia la rotación automática
   */
  startAutoRotation(): void {
    // DESACTIVADO
  }

  getVisibleImages(): string[] {
      return [];
  }
}









