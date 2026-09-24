import { Directive, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { PlatformService } from '@core/services/platform.service';

/**
 * Motor Estructural Adaptativo: Renderiza el contenido SOLO si la vista es Escritorio/Web.
 * Destruye el DOM por completo si la vista es móvil (evita fuga de Bootstrap).
 */
@Directive({
  selector: '[lxWeb]',
  standalone: true
})
export class LxWebDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly platform = inject(PlatformService);
  private hasView = false;

  constructor() {
    effect(() => {
      const isWeb = !this.platform.isMobile();
      if (isWeb && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!isWeb && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}

/**
 * Motor Estructural Adaptativo: Renderiza el contenido SOLO si la vista es Móvil.
 * Destruye el DOM por completo si la vista es web (evita sobrecarga de Ionic en desktop).
 */
@Directive({
  selector: '[lxMobile]',
  standalone: true
})
export class LxMobileDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly platform = inject(PlatformService);
  private hasView = false;

  constructor() {
    effect(() => {
      const isMobile = this.platform.isMobile();
      if (isMobile && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!isMobile && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
