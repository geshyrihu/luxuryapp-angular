import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonCheckbox } from "@ionic/angular/standalone";
import { CheckboxBase } from "@ui/base/checkbox.base";

@Component({
  selector: "ili-checkbox",
  standalone: true,
  imports: [FormsModule, IonCheckbox],
  template: `
    <ion-checkbox
      [disabled]="disabled()"
      [checked]="checked()"
      (ionChange)="checked.set($event.detail.checked)"
    >
      @if (label()) {
        {{ label() }}
      }
    </ion-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliCheckbox extends CheckboxBase {}
