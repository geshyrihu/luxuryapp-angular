import { Directive, ElementRef, inject, Input } from "@angular/core";

/**
 * Marca una sección proyectada dentro de <lx-stepper> (`<section step="1">`).
 * `<ng-content>` no soporta un `select` dinámico por iteración, así que el
 * stepper no puede filtrar el contenido proyectado por sí mismo; en su lugar
 * StepperBase consulta estas directivas via @ContentChildren y alterna su
 * visibilidad segun el paso activo.
 */
@Directive({
  selector: "[step]",
})
export class StepperStepSection {
  @Input() step!: string;

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  setActive(active: boolean): void {
    this.elementRef.nativeElement.style.display = active ? "block" : "none";
  }
}
