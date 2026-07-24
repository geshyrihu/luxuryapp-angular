import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  forwardRef,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { IonCheckbox, IonItem, IonList } from "@ionic/angular/standalone";
import { ListboxBase } from "@ui/base/listbox.base";

@Component({
  selector: "ili-listbox",
  imports: [FormsModule, IonList, IonItem, IonCheckbox],
  template: `
    <ion-list [class]="styleClass()">
      @for (option of options(); track option) {
        <ion-item>
          <ion-checkbox
            [checked]="value() === option[optionValue()] || value() === option"
            (ionChange)="selectOption(option)"
          >
            {{ optionLabel() ? option[optionLabel()] : option }}
          </ion-checkbox>
        </ion-item>
      }
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MobileListbox),
      multi: true,
    },
  ],
})
export class MobileListbox extends ListboxBase {
  selectOption(option: any) {
    const val = this.optionValue() ? option[this.optionValue()] : option;
    this.value.set(val);
    this.onChangeCva(val);
  }
}
