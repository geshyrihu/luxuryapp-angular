import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button-active-desactive",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="toggleState()"
    >
      <app-icon
        [icon]="state() ? IconCatalog.LockOpenOutline : IconCatalog.LockOpenOutline"
      />
      <span>{{ state() ? inactivasLabel() : activasLabel() }}</span>
    </button>
  `,
})
export class WebButtonLabelActiveDesactive extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "outline",
  );
  override severity = input<any>("secondary");

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
