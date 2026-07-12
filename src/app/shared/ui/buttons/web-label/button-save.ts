import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button-save",

  imports: [AppIcon],
  styles: [":host { display: block; width: fit-content; margin-left: auto; }"],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses() + ' gap-2'"
      [disabled]="disabled() || submitting()"
      (click)="emitClick($event)"
    >
      <app-icon
        [icon]="
          propertyId()
            ? 'mdi:content-save-edit-outline'
            : 'mdi:content-save-outline'
        "
      />
      <span>{{ finalLabel() }}</span>
    </button>
  `,
})
export class WebButtonLabelSave extends BaseButton {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  override severity = input<any>("info");
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override type = input<"button" | "submit" | "reset">("submit");

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
