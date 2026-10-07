import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

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
  selector: "lux-button-group",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="d-flex flex-wrap gap-2" role="group">
      @for (opt of options(); track opt.value) {
        <lux-button-web
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
export class LuxButtonGroup<T = string> {
  options = input.required<ButtonGroupOption<T>[]>();
  value = input<T | null>(null);
  activeSeverity = input<
    "primary" | "success" | "danger" | "info" | "warning"
  >("primary");
  size = input<"sm" | "md" | "lg">("sm");

  valueChange = output<T>();
}
