import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-autocomplete",
  imports: [
    BaseIonicInput,
    ReactiveFormsModule,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-input
        mode="md"
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        [readonly]="readonly()"
        (ionInput)="onInput($event)"
        (ionFocus)="showSuggestions = true"
        (ionBlur)="onBlur()"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-input>

      @if (showSuggestions && suggestions().length > 0) {
        <ion-list
          class="ion-margin-top"
          style="max-height: 200px; overflow-y: auto;"
        >
          @for (item of suggestions(); track item) {
            <ion-item button (click)="selectSuggestion(item)">
              <ion-label>{{ item }}</ion-label>
            </ion-item>
          }
        </ion-list>
      }
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputAutocomplete),
      multi: true,
    },
  ],
})
export class IonInputAutocomplete extends BaseIonicInput {
  suggestions = input<string[]>([]);

  showSuggestions = false;

  onInput(event: any): void {
    const val = (event.target as any)?.value || "";
    this.showSuggestions = val.length > 0;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectSuggestion(item: string): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(item);
    this.onChange(item);
    this.onTouch();
    this.showSuggestions = false;
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
