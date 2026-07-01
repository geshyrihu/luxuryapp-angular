import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IlButtonBase } from "./il-button-base";

@Component({
  selector: "il-button-save",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || submitting()"
      (click)="emitClick($event)"
    >
      <app-icon [icon]="propertyId() ? 'mdi:content-save-edit-outline' : 'mdi:content-save-outline'" />
      <span>{{ finalLabel() }}</span>
    </button>
  `,
})
export class IlButtonSave extends IlButtonBase {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  override severity = input<any>("success");
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("outline");
  override type = input<"button" | "submit" | "reset">("submit");

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
