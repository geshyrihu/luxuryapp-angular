import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TextareaModule } from "primeng/textarea";
import { BaseInputSignal } from "../base/base-input-signal";

// 📄 COMPONENTE DE ÁREA DE TEXTO
// Un componente para áreas de texto multilínea que extiende la funcionalidad de BaseInput.
@Component({
  selector: "custom-input-textarea-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, TextareaModule],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
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
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <textarea
        pTextarea
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [rows]="rows()"
        [cols]="cols()"
        [maxlength]="maxLength()"
        [autoResize]="!disableResize()"
        [style]="{ resize: disableResize() ? 'none' : 'vertical' }"
        [class]="customClass()"
        [invalid]="isInvalid()"
        [fluid]="fluid()"
      ></textarea>
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTextAreaSignal),
      multi: true,
    },
  ],
})
export class CustomInputTextAreaSignal extends BaseInputSignal {
  // 🎨 PROPIEDADES ADICIONALES
  rows = input<number>(5);
  cols = input<number>(30);
  maxLength = input<number | undefined>(undefined);
  disableResize = input<boolean>(false);
  customClass = input<string>("");
  fluid = input<boolean>(true);
}
