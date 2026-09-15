import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  PHONE_PREFIXES,
  PhonePrefix,
} from "src/app/core/data/phone-prefixes.data";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "web-custom-input-phone-prefix",
  imports: [BaseInputSignal, ReactiveFormsModule, NgSelectModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [horizontal]="horizontal()"
      [required]="requiredInput()"
    >
      <ng-select
        [items]="prefixes"
        [formControl]="control() || internalControl"
        bindLabel="name"
        bindValue="dialCode"
        [searchable]="true"
        [clearable]="false"
        [labelForId]="id()"
        appendTo="body"
        placeholder="Prefijo"
      >
        <!-- Valor seleccionado -->
        <ng-template ng-label-tmp let-item="item">
          @if (item) {
          <div class="d-flex align-items-center gap-2">
            <span class="text-xl leading-none">{{ item.flag }}</span>
            <span class="font-medium">{{ item.dialCode }}</span>
          </div>
          }
        </ng-template>

        <!-- Opciones del dropdown -->
        <ng-template ng-option-tmp let-option="item">
          <div class="d-flex align-items-center gap-2">
            <span class="text-xl leading-none">{{ option.flag }}</span>
            <span class="flex-1">{{ option.name }}</span>
            <span class="text-500 text-sm">{{ option.dialCode }}</span>
          </div>
        </ng-template>
      </ng-select>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
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
