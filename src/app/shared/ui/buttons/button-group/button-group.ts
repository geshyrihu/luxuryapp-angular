import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { WebButtonLabel } from "../web-label/button";

export interface ButtonGroupOption<T = string> {
  label: string;
  value: T;
  iconClass?: string;
}

/**
 * Grupo de botones de seleccion unica (filtros tipo "chip"), compuesto sobre
 * `il-button` para heredar sus estilos/severidades en vez de reinventarlos.
 * Reemplaza los botones sueltos con `[class.btn-primary]`/`[class.btn-outline]`
 * repetidos manualmente en varias pantallas de listado.
 */
@Component({
  selector: "il-button-group",
  imports: [WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="flex flex-wrap gap-2" role="group">
      @for (opt of options(); track opt.value) {
        <il-button
          [label]="opt.label"
          [iconClass]="opt.iconClass ?? ''"
          [severity]="value() === opt.value ? activeSeverity() : 'secondary'"
          [variant]="value() === opt.value ? 'solid' : 'outline'"
          [size]="size()"
          [attr.aria-pressed]="value() === opt.value"
          (clicked)="valueChange.emit(opt.value)"
        />
      }
    </div>
  `,
})
export class IlButtonGroup<T = string> {
  options = input.required<ButtonGroupOption<T>[]>();
  value = input<T | null>(null);
  activeSeverity = input<
    "primary" | "success" | "danger" | "info" | "warning"
  >("primary");
  size = input<"sm" | "md" | "lg">("sm");

  valueChange = output<T>();
}
