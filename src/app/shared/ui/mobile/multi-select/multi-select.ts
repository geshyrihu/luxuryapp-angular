import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  forwardRef,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MultiSelectBase } from "@ui/base/multi-select.base";
import { IonItem, IonSelect, IonSelectOption } from "@ionic/angular/standalone";

@Component({
  selector: "ili-multi-select",
  imports: [FormsModule, IonItem, IonSelect, IonSelectOption],
  template: `
    <ion-item [class]="styleClass()">
      <ion-select 
        [multiple]="true"
        [placeholder]="placeholder()"
        [ngModel]="ngModel()"
        (ngModelChange)="onModelChange($event)">
        @for (option of options(); track option) {
          <ion-select-option [value]="option">
            {{ optionLabel() ? option[optionLabel()] : option }}
          </ion-select-option>
        }
      </ion-select>
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MobileMultiSelect),
      multi: true,
    },
  ],
})
export class MobileMultiSelect extends MultiSelectBase {
  onModelChange(val: any) {
    this.ngModel.set(val);
    this.onChange.emit(val);
  }
}
