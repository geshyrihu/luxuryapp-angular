import { Component, computed, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🔣 CUSTOM INPUT SELECT PREFIX
 * -------------------------------------------------------------------------
 * Input híbrido: Select a la izquierda para categoría/prefijo y texto a la derecha.
 * Ideal para teléfonos (+52 555-555) o documentos (DNI 12345678).
 */
@Component({
  selector: "web-custom-input-select-signal-prefix",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <p-inputgroup [class]="getInputStyleClass()">
        <p-inputgroup-addon class="p-0">
          <p-select
            [options]="selectOptions()"
            [placeholder]="selectPlaceholder()"
            optionLabel="label"
            optionValue="value"
            [attr.disabled]="disabled() ? true : null"
            (onChange)="onSelectItem($event)"
            [showClear]="false"
            class="border-noround-right"
          />
        </p-inputgroup-addon>
        <input
          type="text"
          pInputText
          [id]="id()"
          [formControl]="control() || internalControl"
          [readOnly]="readonly()"
          [disabled]="disabled()"
          [placeholder]="inputPlaceholder()"
        />
      </p-inputgroup>
    </base-input-signal>
  `,
  styles: [
    `
      :host ::ng-deep .p-inputgroup .p-inputgroup-addon {
        padding: 0;
      }

      :host ::ng-deep .p-inputgroup .p-select {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      :host ::ng-deep .p-inputgroup input {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      :host ::ng-deep .p-inputgroup .p-inputgroup-addon {
        background: var(--ds-bg-surface);
        border-color: var(--ds-border);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectPrefix),
      multi: true,
    },
  ],
})
export class CustomInputSelectPrefix extends BaseInputSignal {
  // <--- Inputs --->
  data = input<any[]>([]);
  selectPlaceholder = input<string>("Seleccionar");
  inputPlaceholder = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  // <--- Outputs --->
  propagar = output<any>();

  // <--- Computados --->
  selectOptions = computed(() => {
    return this.data().map((item) => ({
      label: typeof item === "string" ? item : item.label || item,
      value: typeof item === "string" ? item : item.value || item,
    }));
  });

  getInputStyleClass = computed(() => {
    if (this.size() === "small") return "p-inputgroup-sm";
    if (this.size() === "large") return "p-inputgroup-lg";
    return "";
  });

  public onSelectItem(event: any): void {
    this.propagar.emit(event);
  }
}
