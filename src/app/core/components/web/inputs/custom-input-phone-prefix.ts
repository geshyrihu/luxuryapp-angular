import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import {
  PHONE_PREFIXES,
  PhonePrefix,
} from "src/app/core/data/phone-prefixes.data";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-phone-prefix",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [horizontal]="horizontal()"
      [required]="requiredInput()"
    >
      <p-select
        [options]="prefixes"
        [formControl]="control() || internalControl"
        optionValue="dialCode"
        [filter]="true"
        filterBy="name,dialCode"
        [showClear]="false"
        appendTo="body"
        fluid
        placeholder="Prefijo"
      >
        <!-- Valor seleccionado -->
        <ng-template #selectedItem let-item>
          @if (item) {
          <div class="flex align-items-center gap-2">
            <span class="text-xl leading-none">{{ item.flag }}</span>
            <span class="font-medium">{{ item.dialCode }}</span>
          </div>
          }
        </ng-template>

        <!-- Opciones del dropdown -->
        <ng-template #item let-option>
          <div class="flex align-items-center gap-2">
            <span class="text-xl leading-none">{{ option.flag }}</span>
            <span class="flex-1">{{ option.name }}</span>
            <span class="text-500 text-sm">{{ option.dialCode }}</span>
          </div>
        </ng-template>
      </p-select>
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputPhonePrefix),
      multi: true,
    },
  ],
})
export class CustomInputPhonePrefix extends BaseInputSignal {
  readonly prefixes: PhonePrefix[] = PHONE_PREFIXES;
}

