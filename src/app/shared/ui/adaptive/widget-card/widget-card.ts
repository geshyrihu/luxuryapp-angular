import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";
import { LxCard } from "@ui/adaptive/card/card";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "lux-widget-card",
  standalone: true,
  imports: [CommonModule, AppIcon, LxCard, NgbPopoverModule],
  templateUrl: "./widget-card.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LxWidgetCard {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input({ required: true }) icon!: AppIconName | string;
  
  /** Color principal del texto o iconos (ej. '#003152') */
  @Input() color: string = "var(--ds-primary)";
  
  /** Color de fondo del contenedor del icono (ej. 'rgba(0, 49, 82, 0.05)') */
  @Input() bgColor: string = "var(--ds-surface-variant)";

  /** Ruta para navegar (opcional) */
  @Input() route?: string;

  /** Texto del botón/enlace de acción. Por defecto "Acceder" */
  @Input() actionText: string = "Acceder";

  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    this.cardClick.emit();
  }
}
