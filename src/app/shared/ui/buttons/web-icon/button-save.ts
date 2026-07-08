import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-save",

  imports: [CommonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || submitting()"
      (click)="emitClick($event)"
    >
      <app-icon
        [icon]="propertyId() ? 'fluent-color:save-16' : 'fluent-color:save-16'"
      />
    </button>
  `,
})
export class WebButtonIconSave extends BaseButton {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  override severity = input<any>("success");
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override type = input<"button" | "submit" | "reset">("submit");

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
