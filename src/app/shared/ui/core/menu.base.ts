import { Directive, input } from "@angular/core";

@Directive()
export abstract class MenuBase {
  styleClass = input<string>("");
  model = input<any>(undefined);
  /**
   * Se conserva por compatibilidad con `LxMenu` (wrapper adaptativo), que
   * sigue pasando `[popup]` a `<app-menu>`/`<ili-menu>`. `AppMenu` (web)
   * ya siempre se comporta como panel flotante tipo dropdown — el valor
   * no cambia su comportamiento, solo evita romper el binding heredado.
   */
  popup = input<boolean>(true);
}
