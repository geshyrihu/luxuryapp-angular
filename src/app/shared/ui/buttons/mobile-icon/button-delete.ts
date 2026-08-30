import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";
import { ConfirmService } from "../shared/confirm.service";

@Component({
  selector: "ii-button-delete",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmDelete($event)"
    >
      <app-icon [icon]="resolvedIconClass() || IconCatalog.DeleteOutline" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconDelete extends MobileButtonBase {
  protected readonly IconCatalog = AppIconCatalog;
  override color = input<string>("danger");
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  private readonly confirmSvc = inject(ConfirmService);

  protected async confirmDelete(event: Event): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (
      await this.confirmSvc.confirm(this.confirmMessage(), this.confirmHeader())
    ) {
      this.confirmed.emit();
    }
  }
}
